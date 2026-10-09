# 2T Launcher PRO

A lightweight Windows launcher for AutoHotkey scripts, files, and folders.

## Features

- Search and filter launcher entries by category.
- Add AutoHotkey scripts and file or folder shortcuts.
- Edit, remove, and launch saved entries.
- Choose a theme and configure a global launcher hotkey.
- Review the local activity log.

## Requirements

- Windows.
- [AutoHotkey v2](https://www.autohotkey.com/).

## Install and run

1. Download and extract the ZIP from the latest [GitHub Release](https://github.com/phuckhang2020/2T-Launcher-PRO/releases).
2. Install AutoHotkey v2 if it is not already installed.
3. Run `2T Launcher PRO.ahk`.
4. Use **Add Script** or **Add File/Folder** to add your own launcher entries.

The launcher starts with an empty list. Add your own entries from the application. It stores the editable list and settings under `data/` and its activity log under `logs/`, next to the launcher. These are created locally as needed and are intentionally excluded from version control and release archives. The repository does not include organization-specific automation scripts or work files.

## Repository layout

```text
.
|-- .github/
|   |-- ISSUE_TEMPLATE/
|   `-- workflows/
|-- Lib/
|   `-- Jxon.ahk
|-- 2T Launcher PRO.ahk
|-- CHANGELOG.md
|-- LICENSE
└-- README.md
```

The main script stays at the repository root so its relative library path and the documented launch steps remain stable.

## Privacy and support

Before opening an issue, remove personal information, usernames, local file paths, company data, and sensitive screenshots from the report. Do not attach activity logs, launcher configuration, credentials, or work documents.

Use GitHub Issues to report reproducible bugs or suggest general improvements. For security-sensitive reports, do not post details publicly; contact the repository owner through a private channel.

## Releases

Releases are created from version tags in the form `vMAJOR.MINOR.PATCH` (for example, `v1.0.0`). Pushing a version tag runs the GitHub Actions release workflow, which creates a source ZIP containing only the launcher, its required library, and public project documentation.

See [CHANGELOG.md](CHANGELOG.md) for changes.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE).
