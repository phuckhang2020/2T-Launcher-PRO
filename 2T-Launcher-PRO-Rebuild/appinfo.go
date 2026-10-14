package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"
)

const (
	AppVersion = "1.1.0"
	AppAuthor  = "Tam Truong"
	releaseAPI = "https://api.github.com/repos/phuckhang2020/2T-Launcher-PRO/releases/latest"
)

type AppInfo struct {
	Version string `json:"version"`
	Author  string `json:"author"`
}

type UpdateInfo struct {
	CurrentVersion  string `json:"currentVersion"`
	LatestVersion   string `json:"latestVersion"`
	ReleaseURL      string `json:"releaseUrl"`
	UpdateAvailable bool   `json:"updateAvailable"`
}

type SystemMetrics struct {
	CPUPercent    float64 `json:"cpuPercent"`
	MemoryPercent float64 `json:"memoryPercent"`
	GPUPercent    float64 `json:"gpuPercent"`
}

func (a *App) GetAppInfo() AppInfo {
	return AppInfo{Version: AppVersion, Author: AppAuthor}
}

func (a *App) CheckForUpdates() (UpdateInfo, error) {
	requestContext, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()
	request, err := http.NewRequestWithContext(requestContext, http.MethodGet, releaseAPI, nil)
	if err != nil {
		return UpdateInfo{}, err
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("User-Agent", "2T-Launcher-PRO")
	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return UpdateInfo{}, fmt.Errorf("không thể kiểm tra GitHub Releases: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return UpdateInfo{}, fmt.Errorf("GitHub Releases trả về HTTP %d", response.StatusCode)
	}
	var release struct {
		TagName string `json:"tag_name"`
		HTMLURL string `json:"html_url"`
	}
	if err := json.NewDecoder(response.Body).Decode(&release); err != nil {
		return UpdateInfo{}, fmt.Errorf("phản hồi GitHub không hợp lệ: %w", err)
	}
	if release.TagName == "" || release.HTMLURL == "" {
		return UpdateInfo{}, errors.New("không tìm thấy bản phát hành GitHub mới nhất")
	}
	return UpdateInfo{
		CurrentVersion:  AppVersion,
		LatestVersion:   release.TagName,
		ReleaseURL:      release.HTMLURL,
		UpdateAvailable: compareVersions(release.TagName, AppVersion) > 0,
	}, nil
}

func compareVersions(left, right string) int {
	leftParts := parseVersion(left)
	rightParts := parseVersion(right)
	for index := 0; index < 3; index++ {
		if leftParts[index] > rightParts[index] {
			return 1
		}
		if leftParts[index] < rightParts[index] {
			return -1
		}
	}
	return 0
}

func parseVersion(version string) [3]int {
	var parts [3]int
	segments := strings.Split(strings.TrimLeft(strings.TrimSpace(version), "vV"), ".")
	for index := 0; index < len(segments) && index < len(parts); index++ {
		numeric := strings.Builder{}
		for _, character := range segments[index] {
			if character < '0' || character > '9' {
				break
			}
			numeric.WriteRune(character)
		}
		parts[index], _ = strconv.Atoi(numeric.String())
	}
	return parts
}

func (a *App) GetSystemMetrics() (SystemMetrics, error) {
	if runtime.GOOS != "windows" {
		return SystemMetrics{}, errors.New("chỉ số hệ thống chỉ được hỗ trợ trên Windows")
	}
	commandContext, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	command := exec.CommandContext(commandContext, "powershell.exe", "-NoProfile", "-NonInteractive", "-Command", metricsPowerShell)
	hideConsoleWindow(command)
	output, err := command.Output()
	if err != nil {
		return SystemMetrics{}, fmt.Errorf("không thể đọc chỉ số hệ thống: %w", err)
	}
	var metrics SystemMetrics
	if err := json.Unmarshal(output, &metrics); err != nil {
		return SystemMetrics{}, fmt.Errorf("không thể phân tích chỉ số hệ thống: %w", err)
	}
	return metrics, nil
}

const metricsPowerShell = `$ErrorActionPreference='Stop'; $cpu=(Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'").PercentProcessorTime; $os=Get-CimInstance Win32_OperatingSystem; $mem=[math]::Round((1-([double]$os.FreePhysicalMemory/[double]$os.TotalVisibleMemorySize))*100,1); $gpu=(Get-CimInstance Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine -ErrorAction SilentlyContinue | Where-Object {$_.Name -match 'engtype_3D'} | Measure-Object -Property UtilizationPercentage -Maximum).Maximum; if ($null -eq $gpu) {$gpu=-1}; [pscustomobject]@{cpuPercent=[double]$cpu;memoryPercent=[double]$mem;gpuPercent=[double]$gpu} | ConvertTo-Json -Compress`
