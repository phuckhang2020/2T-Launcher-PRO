package main

import "context"

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type Settings struct {
	Hotkey                 string `json:"hotkey"`
	Theme                  string `json:"theme"`
	Mode                   string `json:"mode"`
	ScriptFolder           string `json:"scriptFolder"`
	AHKExePath             string `json:"ahkExePath"`
	CategoryDisplay        string `json:"categoryDisplay"`
	Language               string `json:"language"`
	CategorySortingEnabled bool   `json:"categorySortingEnabled"`
}

type App struct {
	ctx          context.Context
	settings     Settings
	settingsPath string
	library      LibraryData
	libraryPath  string
	history      []HistoryEntry
	historyPath  string
	mu           sync.RWMutex
}

func NewApp() *App {
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = os.TempDir()
	}
	return &App{
		settings:     defaultSettings(),
		settingsPath: filepath.Join(configDir, "2T Launcher PRO", "settings.json"),
		library:      defaultLibrary(),
		libraryPath:  filepath.Join(configDir, "2T Launcher PRO", "library.json"),
		historyPath:  filepath.Join(configDir, "2T Launcher PRO", "history.json"),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	if data, err := os.ReadFile(a.settingsPath); err == nil {
		var settings Settings
		if json.Unmarshal(data, &settings) == nil {
			a.settings = normalizeSettings(settings)
		}
	}
	if data, err := os.ReadFile(a.libraryPath); err == nil {
		var library LibraryData
		if json.Unmarshal(data, &library) == nil {
			a.library = normalizeLibrary(library)
		}
	}
	if data, err := os.ReadFile(a.historyPath); err == nil {
		var history []HistoryEntry
		if json.Unmarshal(data, &history) == nil {
			a.history = history
		}
	}
}

func defaultSettings() Settings {
	folder, err := os.UserHomeDir()
	if err != nil {
		folder = "."
	}
	return Settings{
		Hotkey:          "CTRL+SHIFT+O",
		Theme:           "Default",
		Mode:            "light",
		ScriptFolder:    folder,
		AHKExePath:      "",
		CategoryDisplay: "pane",
		Language:        "vi",
	}
}

func normalizeSettings(settings Settings) Settings {
	defaults := defaultSettings()
	switch settings.Hotkey {
	case "CTRL+SHIFT+O", "CTRL+SHIFT+L", "CTRL+ALT+O", "CTRL+ALT+L", "CTRL+SHIFT+F12":
	default:
		settings.Hotkey = defaults.Hotkey
	}
	switch settings.Theme {
	case "Default", "Blue", "Orange":
	default:
		settings.Theme = defaults.Theme
	}
	if settings.Mode != "dark" {
		settings.Mode = "light"
	}
	if settings.CategoryDisplay != "dropdown" {
		settings.CategoryDisplay = "pane"
	}
	if settings.Language != "en" {
		settings.Language = "vi"
	}
	settings.ScriptFolder = strings.TrimSpace(settings.ScriptFolder)
	if settings.ScriptFolder == "" {
		settings.ScriptFolder = defaults.ScriptFolder
	}
	return settings
}

func (a *App) GetSettings() Settings {
	a.mu.RLock()
	defer a.mu.RUnlock()
	return a.settings
}

func (a *App) SaveSettings(settings Settings) error {
	settings = normalizeSettings(settings)
	if settings.AHKExePath != "" {
		path, err := validateAHKExecutablePath(settings.AHKExePath)
		if err != nil {
			return err
		}
		settings.AHKExePath = path
	}
	if err := updateDesktopShortcut(a.ctx, settings.Hotkey); err != nil {
		return err
	}
	if err := a.writeSettings(settings); err != nil {
		return err
	}
	a.mu.Lock()
	a.settings = settings
	a.mu.Unlock()
	return nil
}

func (a *App) ResetSettings() error {
	return a.SaveSettings(defaultSettings())
}

func (a *App) PickScriptFolder() (string, error) {
	if a.ctx == nil {
		return "", errors.New("ứng dụng chưa khởi động")
	}
	settings := a.GetSettings()
	return wailsruntime.OpenDirectoryDialog(a.ctx, wailsruntime.OpenDialogOptions{
		Title:            "Chọn thư mục script mặc định",
		DefaultDirectory: usableStartDirectory(settings.ScriptFolder),
	})
}

func (a *App) writeSettings(settings Settings) error {
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(a.settingsPath), 0o700); err != nil {
		return err
	}
	if err := os.WriteFile(a.settingsPath, data, 0o600); err != nil {
		return err
	}
	return nil
}

func updateDesktopShortcut(ctx context.Context, hotkey string) error {
	if runtime.GOOS != "windows" {
		return nil
	}
	executable, err := os.Executable()
	if err != nil {
		return fmt.Errorf("không lấy được đường dẫn ứng dụng: %w", err)
	}
	script := "$ErrorActionPreference='Stop'; $shell=New-Object -ComObject WScript.Shell; " +
		"$desktop=[Environment]::GetFolderPath('Desktop'); " +
		"$link=$shell.CreateShortcut((Join-Path $desktop '2T Launcher PRO.lnk')); " +
		"$link.TargetPath=$env:TWO_T_LAUNCHER_EXE; " +
		"$link.WorkingDirectory=Split-Path -Parent $env:TWO_T_LAUNCHER_EXE; " +
		"$link.Description='Launch 2T Launcher PRO'; " +
		"$link.Hotkey=$env:TWO_T_LAUNCHER_HOTKEY; $link.Save()"
	command := exec.CommandContext(ctx, "powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script)
	hideConsoleWindow(command)
	command.Env = append(os.Environ(), "TWO_T_LAUNCHER_EXE="+executable, "TWO_T_LAUNCHER_HOTKEY="+hotkey)
	if output, err := command.CombinedOutput(); err != nil {
		return fmt.Errorf("không thể cập nhật shortcut Desktop: %w: %s", err, strings.TrimSpace(string(output)))
	}
	return nil
}
