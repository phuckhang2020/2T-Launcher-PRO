//go:build windows

package main

import (
	"fmt"
	"os/exec"
	"syscall"

	"golang.org/x/sys/windows"
)

const createNoWindow = 0x08000000

func hideConsoleWindow(command *exec.Cmd) {
	command.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: createNoWindow,
	}
}

func setProcessSuspended(processID int, suspend bool) error {
	process, err := windows.OpenProcess(0x0800, false, uint32(processID))
	if err != nil {
		return fmt.Errorf("không mở được tiến trình AHK: %w", err)
	}
	defer windows.CloseHandle(process)

	procedureName := "NtResumeProcess"
	if suspend {
		procedureName = "NtSuspendProcess"
	}
	procedure := windows.NewLazySystemDLL("ntdll.dll").NewProc(procedureName)
	status, _, _ := procedure.Call(uintptr(process))
	if status != 0 {
		return fmt.Errorf("Windows không thể cập nhật trạng thái AHK (0x%X)", status)
	}
	return nil
}
