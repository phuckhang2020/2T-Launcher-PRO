package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type LauncherItem struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Path        string `json:"path"`
	Status      string `json:"status,omitempty"`
	ProcessID   int    `json:"processId,omitempty"`
}

type LibraryData struct {
	Items      []LauncherItem `json:"items"`
	Categories []string       `json:"categories"`
}

func defaultLibrary() LibraryData {
	return LibraryData{
		Items: []LauncherItem{},
		Categories: []string{
			"SAP", "Excel", "Outlook", "File Management", "Power BI", "Utility",
		},
	}
}

func normalizeLibrary(library LibraryData) LibraryData {
	defaults := defaultLibrary()
	categories := make([]string, 0, len(library.Categories))
	for _, category := range library.Categories {
		category = strings.TrimSpace(category)
		if category != "" && !containsCategory(categories, category) {
			categories = append(categories, category)
		}
	}
	if library.Categories == nil {
		categories = defaults.Categories
	}
	items := make([]LauncherItem, 0, len(library.Items))
	for _, item := range library.Items {
		item.Name = strings.TrimSpace(item.Name)
		item.Description = strings.TrimSpace(item.Description)
		item.Path = strings.TrimSpace(item.Path)
		item.Category = strings.TrimSpace(item.Category)
		if item.ID == "" || item.Name == "" || item.Path == "" {
			continue
		}
		if item.Category != "" && !containsCategory(categories, item.Category) {
			item.Category = ""
		}
		items = append(items, item)
	}
	return LibraryData{Items: items, Categories: categories}
}

func (a *App) GetLibrary() LibraryData {
	a.mu.RLock()
	defer a.mu.RUnlock()
	categories := make([]string, len(a.library.Categories))
	copy(categories, a.library.Categories)
	return LibraryData{
		Items:      append([]LauncherItem(nil), a.library.Items...),
		Categories: categories,
	}
}

func (a *App) SaveItem(item LauncherItem) (LauncherItem, error) {
	item.Name = strings.TrimSpace(item.Name)
	item.Description = strings.TrimSpace(item.Description)
	item.Category = strings.TrimSpace(item.Category)
	item.Path = strings.TrimSpace(item.Path)
	if item.Name == "" {
		return LauncherItem{}, errors.New("hãy nhập tên mục")
	}
	if item.Path == "" {
		return LauncherItem{}, errors.New("hãy chọn file hoặc thư mục")
	}
	absolutePath, err := filepath.Abs(item.Path)
	if err != nil {
		return LauncherItem{}, fmt.Errorf("đường dẫn không hợp lệ: %w", err)
	}
	if _, err := os.Stat(absolutePath); err != nil {
		return LauncherItem{}, fmt.Errorf("không tìm thấy file hoặc thư mục: %w", err)
	}
	item.Path = absolutePath

	a.mu.Lock()
	defer a.mu.Unlock()
	if item.Category != "" && !containsCategory(a.library.Categories, item.Category) {
		return LauncherItem{}, errors.New("danh mục không tồn tại")
	}
	if item.ID == "" {
		item.ID, err = newItemID()
		if err != nil {
			return LauncherItem{}, err
		}
		item.Status = "Sẵn sàng"
		a.library.Items = append(a.library.Items, item)
	} else {
		found := false
		for index := range a.library.Items {
			if a.library.Items[index].ID == item.ID {
				item.Status = a.library.Items[index].Status
				item.ProcessID = a.library.Items[index].ProcessID
				a.library.Items[index] = item
				found = true
				break
			}
		}
		if !found {
			return LauncherItem{}, errors.New("không tìm thấy mục cần sửa")
		}
	}
	if err := a.writeLibraryLocked(); err != nil {
		return LauncherItem{}, err
	}
	return item, nil
}

func (a *App) DeleteItem(id string) error {
	return a.DeleteItems([]string{id})
}

func (a *App) DeleteItems(ids []string) error {
	if len(ids) == 0 {
		return errors.New("chưa chọn mục cần xoá")
	}
	a.mu.Lock()
	defer a.mu.Unlock()
	selected := make(map[string]struct{}, len(ids))
	for _, id := range ids {
		selected[id] = struct{}{}
	}
	if len(selected) != len(ids) {
		return errors.New("danh sách mục được chọn có mục trùng lặp")
	}
	items := make([]LauncherItem, 0, len(a.library.Items))
	found := make(map[string]struct{}, len(selected))
	for _, item := range a.library.Items {
		if _, remove := selected[item.ID]; !remove {
			items = append(items, item)
			continue
		}
		if item.ProcessID != 0 || item.Status == "Đang chạy" || item.Status == "Tạm dừng" {
			return fmt.Errorf("không thể xoá “%s” khi script AHK đang chạy hoặc tạm dừng", item.Name)
		}
		found[item.ID] = struct{}{}
	}
	if len(found) != len(selected) {
		return errors.New("không tìm thấy một hoặc nhiều mục cần xoá")
	}
	previous := a.library.Items
	a.library.Items = items
	if err := a.writeLibraryLocked(); err != nil {
		a.library.Items = previous
		return err
	}
	return nil
}

func (a *App) AddCategory(name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return errors.New("hãy nhập tên danh mục")
	}
	if isAllCategoryName(name) {
		return errors.New("Tất cả là danh mục hệ thống và không thể tạo lại")
	}
	a.mu.Lock()
	defer a.mu.Unlock()
	if containsCategory(a.library.Categories, name) {
		return errors.New("danh mục đã tồn tại")
	}
	a.library.Categories = append(a.library.Categories, name)
	return a.writeLibraryLocked()
}

func (a *App) RenameCategory(oldName, newName string) error {
	oldName = strings.TrimSpace(oldName)
	newName = strings.TrimSpace(newName)
	if newName == "" {
		return errors.New("hãy nhập tên danh mục")
	}
	if isAllCategoryName(newName) {
		return errors.New("không thể đổi tên danh mục thành Tất cả")
	}
	a.mu.Lock()
	defer a.mu.Unlock()
	if !containsCategory(a.library.Categories, oldName) {
		return errors.New("không tìm thấy danh mục")
	}
	if !strings.EqualFold(oldName, newName) && containsCategory(a.library.Categories, newName) {
		return errors.New("danh mục đã tồn tại")
	}
	for index, category := range a.library.Categories {
		if strings.EqualFold(category, oldName) {
			a.library.Categories[index] = newName
		}
	}
	for index := range a.library.Items {
		if strings.EqualFold(a.library.Items[index].Category, oldName) {
			a.library.Items[index].Category = newName
		}
	}
	return a.writeLibraryLocked()
}

func (a *App) DeleteCategory(name string) error {
	return a.DeleteCategories([]string{name})
}

func (a *App) DeleteCategories(names []string) error {
	if len(names) == 0 {
		return errors.New("chưa chọn danh mục cần xoá")
	}
	a.mu.Lock()
	defer a.mu.Unlock()
	selected := make(map[string]string, len(names))
	for _, name := range names {
		name = strings.TrimSpace(name)
		if isAllCategoryName(name) {
			return errors.New("không thể xoá danh mục Tất cả")
		}
		found := ""
		for _, category := range a.library.Categories {
			if strings.EqualFold(category, name) {
				found = category
				break
			}
		}
		if found == "" {
			return fmt.Errorf("không tìm thấy danh mục %q", name)
		}
		key := strings.ToLower(found)
		if _, exists := selected[key]; exists {
			return errors.New("danh sách danh mục được chọn có mục trùng lặp")
		}
		selected[key] = found
	}
	previous := a.library.Categories
	previousItems := append([]LauncherItem(nil), a.library.Items...)
	categories := make([]string, 0, len(previous)-len(selected))
	for _, category := range previous {
		if _, remove := selected[strings.ToLower(category)]; !remove {
			categories = append(categories, category)
		}
	}
	a.library.Categories = categories
	for index := range a.library.Items {
		if _, remove := selected[strings.ToLower(a.library.Items[index].Category)]; remove {
			a.library.Items[index].Category = ""
		}
	}
	if err := a.writeLibraryLocked(); err != nil {
		a.library.Categories = previous
		a.library.Items = previousItems
		return err
	}
	return nil
}

func (a *App) ReorderCategories(order []string) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	if len(order) != len(a.library.Categories) {
		return errors.New("thứ tự danh mục không hợp lệ")
	}
	seen := make(map[string]struct{}, len(order))
	for _, category := range order {
		if !containsCategory(a.library.Categories, category) {
			return errors.New("thứ tự danh mục không hợp lệ")
		}
		key := strings.ToLower(category)
		if _, exists := seen[key]; exists {
			return errors.New("thứ tự danh mục chứa mục trùng lặp")
		}
		seen[key] = struct{}{}
	}
	a.library.Categories = append([]string(nil), order...)
	return a.writeLibraryLocked()
}

func (a *App) PickAHKExecutable() (string, error) {
	settings := a.GetSettings()
	defaultDirectory := settings.ScriptFolder
	if settings.AHKExePath != "" {
		defaultDirectory = filepath.Dir(settings.AHKExePath)
	}
	return a.pickFile("Chọn AutoHotkey executable", defaultDirectory, []wailsruntime.FileFilter{
		{DisplayName: "AutoHotkey executable", Pattern: "*.exe"},
	})
}

func (a *App) PickItemFile() (string, error) {
	return a.pickFile("Chọn file cần thêm", a.GetSettings().ScriptFolder, []wailsruntime.FileFilter{
		{DisplayName: "Tất cả file", Pattern: "*.*"},
	})
}

func (a *App) PickItemFolder() (string, error) {
	if a.ctx == nil {
		return "", errors.New("ứng dụng chưa khởi động")
	}
	return wailsruntime.OpenDirectoryDialog(a.ctx, wailsruntime.OpenDialogOptions{
		Title:            "Chọn thư mục cần thêm",
		DefaultDirectory: usableStartDirectory(a.GetSettings().ScriptFolder),
	})
}

func (a *App) pickFile(title, defaultDirectory string, filters []wailsruntime.FileFilter) (string, error) {
	if a.ctx == nil {
		return "", errors.New("ứng dụng chưa khởi động")
	}
	return wailsruntime.OpenFileDialog(a.ctx, wailsruntime.OpenDialogOptions{
		Title:            title,
		DefaultDirectory: usableStartDirectory(defaultDirectory),
		Filters:          filters,
	})
}

func usableStartDirectory(directory string) string {
	if info, err := os.Stat(directory); err == nil && info.IsDir() {
		return directory
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "."
	}
	return home
}

func (a *App) RunItem(id string) error {
	a.mu.RLock()
	var item LauncherItem
	found := false
	for _, candidate := range a.library.Items {
		if candidate.ID == id {
			item = candidate
			found = true
			break
		}
	}
	ahkExePath := a.settings.AHKExePath
	a.mu.RUnlock()
	if !found {
		return errors.New("không tìm thấy mục cần mở")
	}
	info, err := os.Stat(item.Path)
	if err != nil {
		return fmt.Errorf("không tìm thấy đường dẫn: %w", err)
	}
	if !info.IsDir() && strings.EqualFold(filepath.Ext(item.Path), ".ahk") {
		if ahkExePath == "" {
			a.setItemStatus(id, "Lỗi")
			return errors.New("hãy chọn đường dẫn AutoHotkey executable trong Cài đặt trước khi chạy script")
		}
		ahkExePath, err := validateAHKExecutablePath(ahkExePath)
		if err != nil {
			a.setItemStatus(id, "Lỗi")
			return err
		}
		command := exec.Command(ahkExePath, item.Path)
		if err := command.Start(); err != nil {
			a.setItemStatus(id, "Lỗi")
			return fmt.Errorf("không thể chạy script AutoHotkey: %w", err)
		}
		a.setItemProcess(id, command.Process.Pid, "Đang chạy")
		go func() {
			if err := command.Wait(); err != nil {
				a.setItemProcess(id, 0, "Lỗi")
				return
			}
			a.setItemProcess(id, 0, "Sẵn sàng")
		}()
		return nil
	}
	command, err := openPathCommand(item.Path, info.IsDir())
	if err != nil {
		return err
	}
	if err := command.Start(); err != nil {
		return fmt.Errorf("không thể mở đường dẫn: %w", err)
	}
	return nil
}

func (a *App) ToggleAHKPause(id string) (string, error) {
	a.mu.RLock()
	var item LauncherItem
	found := false
	for _, candidate := range a.library.Items {
		if candidate.ID == id {
			item = candidate
			found = true
			break
		}
	}
	a.mu.RUnlock()
	if !found || item.ProcessID == 0 {
		return "", errors.New("không tìm thấy tiến trình AHK đang chạy")
	}
	suspend := item.Status == "Đang chạy"
	if !suspend && item.Status != "Tạm dừng" {
		return "", errors.New("script AHK không ở trạng thái có thể tạm dừng")
	}
	if err := setProcessSuspended(item.ProcessID, suspend); err != nil {
		return "", err
	}
	newStatus := "Đang chạy"
	if suspend {
		newStatus = "Tạm dừng"
	}
	a.setItemStatus(id, newStatus)
	return newStatus, nil
}

type AHKStatus struct {
	State        string `json:"state"`
	RunningCount int    `json:"runningCount"`
	PausedCount  int    `json:"pausedCount"`
	ErrorCount   int    `json:"errorCount"`
	Detail       string `json:"detail"`
}

func (a *App) GetAHKStatus() AHKStatus {
	settings := a.GetSettings()
	if settings.AHKExePath == "" {
		return AHKStatus{State: "not-ready"}
	}
	if _, err := validateAHKExecutablePath(settings.AHKExePath); err != nil {
		return AHKStatus{State: "not-ready"}
	}
	a.mu.RLock()
	defer a.mu.RUnlock()
	status := AHKStatus{State: "idle"}
	for _, item := range a.library.Items {
		switch item.Status {
		case "Đang chạy":
			status.RunningCount++
		case "Tạm dừng":
			status.PausedCount++
		case "Lỗi":
			status.ErrorCount++
		}
	}
	switch {
	case status.ErrorCount > 0:
		status.State = "error"
		status.Detail = fmt.Sprintf("%d", status.ErrorCount)
	case status.PausedCount > 0:
		status.State = "paused"
		status.Detail = fmt.Sprintf("%d", status.PausedCount)
	case status.RunningCount > 0:
		status.State = "running"
		status.Detail = fmt.Sprintf("%d", status.RunningCount)
	}
	return status
}

func validateAHKExecutablePath(path string) (string, error) {
	absolutePath, err := filepath.Abs(strings.TrimSpace(path))
	if err != nil {
		return "", fmt.Errorf("đường dẫn AutoHotkey không hợp lệ: %w", err)
	}
	info, err := os.Stat(absolutePath)
	if err != nil || info.IsDir() || !strings.EqualFold(filepath.Ext(absolutePath), ".exe") {
		return "", errors.New("hãy chọn AutoHotkey executable hợp lệ trong Cài đặt")
	}
	return absolutePath, nil
}

func openPathCommand(path string, isDirectory bool) (*exec.Cmd, error) {
	switch runtime.GOOS {
	case "windows":
		if isDirectory {
			return exec.Command("explorer.exe", path), nil
		}
		return exec.Command("rundll32.exe", "url.dll,FileProtocolHandler", path), nil
	case "darwin":
		return exec.Command("open", path), nil
	default:
		return exec.Command("xdg-open", path), nil
	}
}

func (a *App) setItemStatus(id, status string) {
	a.mu.Lock()
	for index := range a.library.Items {
		if a.library.Items[index].ID == id {
			a.library.Items[index].Status = status
			break
		}
	}
	a.mu.Unlock()
	if a.ctx != nil {
		wailsruntime.EventsEmit(a.ctx, "library:changed")
	}
}

func (a *App) setItemProcess(id string, processID int, status string) {
	a.mu.Lock()
	for index := range a.library.Items {
		if a.library.Items[index].ID == id {
			a.library.Items[index].ProcessID = processID
			a.library.Items[index].Status = status
			break
		}
	}
	a.mu.Unlock()
	if a.ctx != nil {
		wailsruntime.EventsEmit(a.ctx, "library:changed")
	}
}

func (a *App) writeLibraryLocked() error {
	data, err := json.MarshalIndent(a.library, "", "  ")
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(a.libraryPath), 0o700); err != nil {
		return err
	}
	return os.WriteFile(a.libraryPath, data, 0o600)
}

func containsCategory(categories []string, name string) bool {
	for _, category := range categories {
		if strings.EqualFold(category, name) {
			return true
		}
	}
	return false
}

func isAllCategoryName(name string) bool {
	return strings.EqualFold(strings.TrimSpace(name), "all") || strings.EqualFold(strings.TrimSpace(name), "tất cả")
}

func newItemID() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("không thể tạo mã mục: %w", err)
	}
	return hex.EncodeToString(bytes), nil
}
