# 2T Launcher PRO

A Windows launcher for scripts, files, and folders, available as a desktop
application and as the original AutoHotkey edition.

## Features

- Add, edit, search, open, run, and bulk-remove file, folder, and AHK entries.
- Create and manage categories, filter the list, and reorder categories.
- Use English or Vietnamese, light or dark appearance, and pane or dropdown
	category navigation.
- Configure AutoHotkey when needed; ordinary files and folders do not require it.
- Review local activity history and current CPU, memory, and GPU usage.
- Install the Wails desktop edition or run its portable executable.

## Requirements

- Windows.
- Windows 10/11 with WebView2 Runtime for the desktop edition.
- [AutoHotkey](https://www.autohotkey.com/) only when running `.ahk` entries.

## Install and run

1. Download **2T Launcher PRO Setup** from the latest [GitHub Release](https://github.com/phuckhang2020/2T-Launcher-PRO/releases) and run the installer, or download and extract the **Portable** ZIP.
2. Add files and folders directly. To run an `.ahk` entry, select the AutoHotkey executable in Settings; the app links to the AutoHotkey homepage if it is not configured.

The original AutoHotkey edition remains available in the release source ZIP as
`2T Launcher PRO.ahk`. It requires AutoHotkey v2 and can be run independently
of the desktop edition.

The desktop edition stores its library, settings, and history separately under
the current user's configuration directory. The original AHK edition stores
data in `data/` and logs in `logs/` next to its script. These stores are not
shared or imported automatically. The repository does not include private
automation scripts or work files.

## Repository layout

```text
.
|-- .github/
|   |-- ISSUE_TEMPLATE/
|   `-- workflows/
|-- Lib/
|   `-- Jxon.ahk
|-- 2T Launcher PRO.ahk
|-- 2T-Launcher-PRO-Rebuild/
|   `-- Go + Wails desktop application
|-- CHANGELOG.md
|-- LICENSE
└-- README.md
```

The legacy main script stays at the repository root so its relative library
path remains stable.

## Privacy and support

Before opening an issue, remove personal information, usernames, local file paths, company data, and sensitive screenshots from the report. Do not attach activity logs, launcher configuration, credentials, or work documents.

Use GitHub Issues to report reproducible bugs or suggest general improvements. For security-sensitive reports, do not post details publicly; contact the repository owner through a private channel.

## Releases

Releases are created from version tags in the form `vMAJOR.MINOR.PATCH` (for
example, `v1.1.0`). Pushing a version tag runs the GitHub Actions release
workflow, which publishes the desktop installer, portable ZIP, and legacy AHK
source ZIP.

See [CHANGELOG.md](CHANGELOG.md) for changes.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE).
