# 2T Launcher PRO — Rebuild Plan

This directory is an isolated Go + Wails rebuild. It has a local file/folder
library, category management, and a configurable AutoHotkey runner. The
existing AutoHotkey application remains unchanged.

“MyGo” was interpreted as Go (Golang). The selected stack is Go + Wails with a
Vite-based UI embedded in a Windows desktop window. The rebuild stores its
library and preferences separately from the existing launcher's data.

## Implemented in the rebuild

- Category-first navigation with settings and history in separate dialogs.
- Add, edit, remove, search, and category-filter file, folder, and AHK entries.
- Add, rename, remove, and drag-reorder categories. Removing a category moves
  its entries into the protected All view; All cannot be deleted.
- Select and bulk-delete items or categories. Running/paused scripts are
  protected from deletion.
- Show filtered item counts and open/run an entry by double-clicking its name.
- Pane or dropdown category navigation and English/Vietnamese UI.
- Open files and folders through Windows without requiring AutoHotkey.
- Run, pause, and resume `.ahk` entries after an AutoHotkey executable is set.
- Show an in-app AutoHotkey download guide when an `.ahk` entry is run without
  a configured executable.
- Settings for the Windows Desktop shortcut hotkey, accent palette, light/dark
  mode, default script folder, AutoHotkey executable path, category layout, and
  language.
- Settings persistence under the operating system's user config directory;
  reset restores preferences without deleting scripts or launcher data.
- Library persistence in a separate `library.json` file under the same user
  config directory.
- Per-Windows-user activity history with time filters, live CPU/memory/GPU
  footer metrics, app details, and GitHub release checks.
- Background PowerShell helpers run without opening console windows.

## Feasibility

The launcher can be rebuilt in either Rust or Go without rewriting the
AutoHotkey automation scripts. The new application would own the user
interface, launcher data, settings, and process management, then start `.ahk`
files as separate Windows processes using the configured AutoHotkey runtime. File and folder
shortcuts would continue to open through Windows.

AutoHotkey is only required for `.ahk` entries. Configure its executable in
Settings; a missing runtime or script is reported without blocking file and
folder entries.

## Technology options

| Option | Suggested desktop stack | Strengths | Considerations |
| --- | --- | --- | --- |
| Rust | Tauri 2 with a web UI (HTML/CSS/TypeScript) | Flexible, polished UI; small native host; strong types | Requires Rust and frontend toolchains; Windows integration such as global hotkeys and shortcuts needs deliberate implementation |
| Go (selected) | Wails with a web UI (HTML/CSS/JavaScript) | Straightforward Windows process and filesystem integration; web UI flexibility | Requires Go and frontend toolchains; global hotkeys and shortcut management still need Windows-specific integration |

Both approaches can deliver a substantially more modern UI and launch AHK
scripts. They differ more in implementation and maintenance preferences than in
whether AHK compatibility is possible.

## Existing behavior to preserve

- Search entries and filter by category.
- Add, edit, and remove launcher entries.
- Add AutoHotkey scripts and file or folder shortcuts.
- Launch AHK scripts, show running/completed status, and report launch errors.
- Open non-script files and folders using Windows.
- Keep entry data in the existing JSON shape:
  `Function`, `Description`, `Category`, `Version`, `Path`, `Owner`,
  `LastUpdated`.
- Keep theme and global launcher hotkey preferences, including Desktop shortcut
  updates.
- View an activity log and retain useful run, completion, and error events.
- Resolve paths relative to the application while continuing to accept
  absolute Windows paths.
- Preserve Vietnamese text and current category names.

## Migration plan

1. **Create an independent application skeleton** — done
   - Go + Wails project files and Vite frontend live only in this directory.
   - The light default, blue/orange accent presets, and left navigation are in
     place; settings are the first connected application workflow.
2. **Define compatibility boundaries**
   - Read and write the established JSON fields and INI settings.
   - Initially use a separate test data directory; do not modify the existing
     launcher's `data/` or `logs/`.
   - Add an explicit import or opt-in compatibility test before using existing
     user data.
3. **Implement the AHK and shortcut process layer**
  - Locate or configure AutoHotkey and launch `.ahk` files with safe Windows
     argument handling.
   - Track the launched process and expose running/completed/error states.
   - Open files and folders through Windows' normal file association.
4. **Build the feature-equivalent UI**
   - Search, category filters and CRUD, entry CRUD, file/folder opening, AHK
     execution controls, settings, history, and system status are implemented.
   - Still implement a detailed process/run-log view.
   - Native pickers and validation are used for entry paths and the AHK runtime.
5. **Verify feature parity and compatibility**
   - Test with disposable entries and sample AHK scripts, including paths with
     spaces, missing files, unavailable AutoHotkey, process completion, and
     non-script file/folder entries.
   - Confirm existing JSON records and settings can be read without data loss;
     verify no test writes reach the original data or log directories.
6. **Package and transition deliberately**
   - Build a Windows release with a Wails/NSIS installer, portable ZIP, and
     legacy AHK source ZIP; document prerequisites and rollback.
   - Keep the existing AHK launcher available until parity and user-data
     compatibility are accepted. Switch over only as a separate, explicit
     decision.

## Development prerequisites

- Windows 10/11 with WebView2 Runtime.
- Go 1.24.12 for the current Wails binding generator.
- Node.js and npm.
- NSIS to generate the Windows installer.
- Wails CLI v2 (`go install github.com/wailsapp/wails/v2/cmd/wails@v2.10.2`).

From this directory, install the frontend dependencies with `npm install` in
`frontend/`, then run `wails dev`. Package the Windows app with `wails build
-nsis`; this creates the portable executable and `build/bin/2T Launcher
PRO-amd64-installer.exe` when NSIS is available.

## Safety boundary

Do not copy local `data/`, `logs/`, `scripts/`, work documents, or machine-
specific paths into this directory or a public build. Use synthetic test data.
The original launcher remains the fallback throughout implementation.
