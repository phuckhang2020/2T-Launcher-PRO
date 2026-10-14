package main

import (
	"encoding/json"
	"os"
	"os/user"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type HistoryEntry struct {
	Timestamp string `json:"timestamp"`
	User      string `json:"user"`
	Action    string `json:"action"`
	Item      string `json:"item"`
}

func (a *App) RecordHistory(action, item string) error {
	actor := "Unknown user"
	if currentUser, err := user.Current(); err == nil && currentUser.Username != "" {
		actor = currentUser.Username
	}
	entry := HistoryEntry{
		Timestamp: time.Now().Format(time.RFC3339Nano),
		User:      actor,
		Action:    strings.TrimSpace(action),
		Item:      strings.TrimSpace(item),
	}

	a.mu.Lock()
	defer a.mu.Unlock()
	a.history = append(a.history, entry)
	if len(a.history) > 1000 {
		a.history = append([]HistoryEntry(nil), a.history[len(a.history)-1000:]...)
	}
	data, err := json.MarshalIndent(a.history, "", "  ")
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(a.historyPath), 0o700); err != nil {
		return err
	}
	return os.WriteFile(a.historyPath, data, 0o600)
}

func (a *App) GetHistory(timeFrame string) []HistoryEntry {
	a.mu.RLock()
	entries := append([]HistoryEntry(nil), a.history...)
	a.mu.RUnlock()

	cutoff := time.Time{}
	switch timeFrame {
	case "24h":
		cutoff = time.Now().Add(-24 * time.Hour)
	case "7d":
		cutoff = time.Now().Add(-7 * 24 * time.Hour)
	case "30d":
		cutoff = time.Now().Add(-30 * 24 * time.Hour)
	}
	filtered := entries[:0]
	for _, entry := range entries {
		timestamp, err := time.Parse(time.RFC3339Nano, entry.Timestamp)
		if err == nil && (cutoff.IsZero() || timestamp.After(cutoff)) {
			filtered = append(filtered, entry)
		}
	}
	sort.SliceStable(filtered, func(i, j int) bool {
		return filtered[i].Timestamp > filtered[j].Timestamp
	})
	return filtered
}
