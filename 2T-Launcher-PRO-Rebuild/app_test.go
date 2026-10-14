package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestNormalizeSettingsFallsBackToDefaults(t *testing.T) {
	settings := normalizeSettings(Settings{
		Hotkey: "CTRL+F1",
		Theme:  "Purple",
		Mode:   "sepia",
	})
	defaults := defaultSettings()

	if settings.Hotkey != defaults.Hotkey {
		t.Errorf("hotkey = %q, want %q", settings.Hotkey, defaults.Hotkey)
	}
	if settings.Theme != defaults.Theme {
		t.Errorf("theme = %q, want %q", settings.Theme, defaults.Theme)
	}
	if settings.Mode != defaults.Mode {
		t.Errorf("mode = %q, want %q", settings.Mode, defaults.Mode)
	}
	if settings.ScriptFolder != defaults.ScriptFolder {
		t.Errorf("script folder = %q, want %q", settings.ScriptFolder, defaults.ScriptFolder)
	}
}

func TestWriteSettingsPersistsJSON(t *testing.T) {
	settings := Settings{
		Hotkey:       "CTRL+ALT+L",
		Theme:        "Blue",
		Mode:         "dark",
		ScriptFolder: t.TempDir(),
	}
	settingsPath := filepath.Join(t.TempDir(), "config", "settings.json")
	app := &App{settingsPath: settingsPath}

	if err := app.writeSettings(settings); err != nil {
		t.Fatalf("writeSettings() error = %v", err)
	}

	data, err := os.ReadFile(settingsPath)
	if err != nil {
		t.Fatalf("ReadFile() error = %v", err)
	}
	var got Settings
	if err := json.Unmarshal(data, &got); err != nil {
		t.Fatalf("Unmarshal() error = %v", err)
	}
	if got != settings {
		t.Errorf("persisted settings = %#v, want %#v", got, settings)
	}
}

func TestRunAHKItemRequiresConfiguredExecutable(t *testing.T) {
	scriptPath := filepath.Join(t.TempDir(), "sample.ahk")
	if err := os.WriteFile(scriptPath, []byte("#Requires AutoHotkey v2.0\n"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}
	app := &App{
		settings: Settings{},
		library:  LibraryData{Items: []LauncherItem{{ID: "script-1", Name: "Sample", Path: scriptPath}}},
	}

	err := app.RunItem("script-1")
	if err == nil || !strings.Contains(err.Error(), "AutoHotkey executable") {
		t.Fatalf("RunItem() error = %v, want a missing AutoHotkey path error", err)
	}
}

func TestAHKStatusReportsNotReadyWithoutExecutable(t *testing.T) {
	app := &App{settings: Settings{}, library: defaultLibrary()}
	if status := app.GetAHKStatus(); status.State != "not-ready" {
		t.Fatalf("GetAHKStatus() = %#v, want not-ready", status)
	}
}

func TestCategoryRenamePreservesItemAssignmentAndDeleteProtectsItems(t *testing.T) {
	root := t.TempDir()
	path := filepath.Join(root, "document.txt")
	if err := os.WriteFile(path, []byte("test"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}
	app := &App{
		library:     defaultLibrary(),
		libraryPath: filepath.Join(root, "config", "library.json"),
	}
	if err := app.AddCategory("Team tools"); err != nil {
		t.Fatalf("AddCategory() error = %v", err)
	}
	item, err := app.SaveItem(LauncherItem{Name: "Document", Category: "Team tools", Path: path})
	if err != nil {
		t.Fatalf("SaveItem() error = %v", err)
	}
	if err := app.RenameCategory("Team tools", "Team files"); err != nil {
		t.Fatalf("RenameCategory() error = %v", err)
	}
	if app.library.Items[0].Category != "Team files" {
		t.Fatalf("renamed item's category = %q, want %q", app.library.Items[0].Category, "Team files")
	}
	if err := app.DeleteCategory("Team files"); err != nil {
		t.Fatalf("DeleteCategory() should preserve entries in All: %v", err)
	}
	if app.library.Items[0].Category != "" {
		t.Fatalf("deleted category item category = %q, want All/uncategorized", app.library.Items[0].Category)
	}
	if err := app.DeleteItem(item.ID); err != nil {
		t.Fatalf("DeleteItem() error = %v", err)
	}
}

func TestGetLibraryPreservesEmptyCategoriesForAllView(t *testing.T) {
	app := &App{library: LibraryData{Items: []LauncherItem{}, Categories: []string{}}}
	library := app.GetLibrary()
	if library.Categories == nil || len(library.Categories) != 0 {
		t.Fatalf("GetLibrary() categories = %#v, want a non-nil empty list", library.Categories)
	}
}

func TestDeleteItemsBulkIsValidatedAndPreservesRunningScripts(t *testing.T) {
	app := &App{
		library: LibraryData{
			Categories: []string{"Work"},
			Items: []LauncherItem{
				{ID: "one", Name: "One", Category: "Work", Status: "Sẵn sàng"},
				{ID: "two", Name: "Two", Category: "Work", Status: "Sẵn sàng"},
			},
		},
		libraryPath: filepath.Join(t.TempDir(), "library.json"),
	}
	if err := app.DeleteItems([]string{"one", "missing"}); err == nil {
		t.Fatal("DeleteItems() should reject an unknown ID")
	}
	if len(app.library.Items) != 2 {
		t.Fatal("DeleteItems() must not partially delete items when validation fails")
	}
	app.library.Items[1].Status = "Đang chạy"
	app.library.Items[1].ProcessID = 100
	if err := app.DeleteItems([]string{"one", "two"}); err == nil {
		t.Fatal("DeleteItems() should reject a running script")
	}
	if len(app.library.Items) != 2 {
		t.Fatal("DeleteItems() must preserve all items when one selected script is running")
	}
	app.library.Items[1].Status = "Sẵn sàng"
	app.library.Items[1].ProcessID = 0
	if err := app.DeleteItems([]string{"one", "two"}); err != nil {
		t.Fatalf("DeleteItems() error = %v", err)
	}
	if len(app.library.Items) != 0 {
		t.Fatalf("item count after bulk delete = %d, want 0", len(app.library.Items))
	}
}

func TestDeleteCategoriesBulkProtectsAllAndCategoriesWithItems(t *testing.T) {
	app := &App{
		library: LibraryData{
			Categories: []string{"Work", "Archive", "Tools"},
			Items:      []LauncherItem{{ID: "one", Name: "One", Category: "Work"}},
		},
		libraryPath: filepath.Join(t.TempDir(), "library.json"),
	}
	if err := app.DeleteCategories([]string{"All"}); err == nil {
		t.Fatal("DeleteCategories() should protect the All category")
	}
	if err := app.AddCategory("Tất cả"); err == nil {
		t.Fatal("AddCategory() should reject the protected All category name")
	}
	if err := app.DeleteCategories([]string{"Archive", "Work"}); err != nil {
		t.Fatalf("DeleteCategories() should preserve entries in All: %v", err)
	}
	if len(app.library.Categories) != 1 || app.library.Categories[0] != "Tools" {
		t.Fatalf("categories after bulk delete = %#v, want only Tools", app.library.Categories)
	}
	if app.library.Items[0].Category != "" {
		t.Fatalf("deleted category item category = %q, want All/uncategorized", app.library.Items[0].Category)
	}
	if err := app.DeleteCategories([]string{"Tools"}); err != nil {
		t.Fatalf("DeleteCategories(all custom categories) error = %v", err)
	}
	if len(app.library.Categories) != 0 {
		t.Fatalf("categories after deleting all custom categories = %#v, want empty list with All preserved in UI", app.library.Categories)
	}
}

func TestValidateAHKExecutablePathRequiresExistingExe(t *testing.T) {
	textFile := filepath.Join(t.TempDir(), "not-ahk.txt")
	if err := os.WriteFile(textFile, []byte("test"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}
	if _, err := validateAHKExecutablePath(textFile); err == nil {
		t.Fatal("validateAHKExecutablePath() should reject a non-executable file")
	}
}

func TestCompareVersions(t *testing.T) {
	tests := []struct {
		left, right string
		want        int
	}{
		{"v1.2.0", "1.1.9", 1},
		{"1.0.0", "v1.0.0", 0},
		{"v0.9.9", "1.0.0", -1},
	}
	for _, test := range tests {
		if got := compareVersions(test.left, test.right); got != test.want {
			t.Errorf("compareVersions(%q, %q) = %d, want %d", test.left, test.right, got, test.want)
		}
	}
}

func TestReorderCategoriesRequiresExactUniqueSet(t *testing.T) {
	app := &App{
		library:     defaultLibrary(),
		libraryPath: filepath.Join(t.TempDir(), "library.json"),
	}
	if err := app.ReorderCategories([]string{"Utility", "SAP", "Excel", "Outlook", "File Management", "Power BI"}); err != nil {
		t.Fatalf("ReorderCategories() error = %v", err)
	}
	if app.library.Categories[0] != "Utility" {
		t.Fatalf("first category = %q, want Utility", app.library.Categories[0])
	}
	if err := app.ReorderCategories([]string{"Utility", "Utility"}); err == nil {
		t.Fatal("ReorderCategories() should reject an incomplete order")
	}
}

func TestGetHistoryFiltersByTimeFrame(t *testing.T) {
	app := &App{history: []HistoryEntry{
		{Timestamp: time.Now().Add(-48 * time.Hour).Format(time.RFC3339Nano), Action: "old"},
		{Timestamp: time.Now().Add(-2 * time.Hour).Format(time.RFC3339Nano), Action: "recent"},
	}}
	entries := app.GetHistory("24h")
	if len(entries) != 1 || entries[0].Action != "recent" {
		t.Fatalf("GetHistory(24h) = %#v, want only recent entry", entries)
	}
}
