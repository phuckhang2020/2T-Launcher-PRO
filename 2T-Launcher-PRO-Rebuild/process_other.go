//go:build !windows

package main

import (
	"errors"
	"os/exec"
)

func hideConsoleWindow(*exec.Cmd) {}

func setProcessSuspended(int, bool) error {
	return errors.New("tạm dừng script chỉ được hỗ trợ trên Windows")
}
