#Requires AutoHotkey v2.0
#SingleInstance Force
#Include Lib\Jxon.ahk

DataDir := A_ScriptDir "\data"
DataFile := DataDir "\scripts.json"
SettingsFile := DataDir "\launcher_settings.ini"
FieldOrder := ["Function", "Description", "Category", "Version", "Path", "Owner", "LastUpdated"]
CategoryPlainList := ["SAP", "Excel", "Outlook", "File Management", "Power BI", "Utility"]
LauncherHotkeyValues := ["CTRL+SHIFT+O", "CTRL+SHIFT+L", "CTRL+ALT+O", "CTRL+ALT+L", "CTRL+SHIFT+F12"]
LauncherHotkeyLabels := ["Ctrl + Shift + O", "Ctrl + Shift + L", "Ctrl + Alt + O", "Ctrl + Alt + L", "Ctrl + Shift + F12"]
LauncherThemeValues := ["Default", "Blue", "Orange"]
LauncherThemeLabels := ["Mặc định", "Xanh", "Cam sáng"]
LauncherTheme := IniRead(SettingsFile, "Appearance", "Theme", LauncherThemeValues[1])
if (LauncherTheme != LauncherThemeValues[1] && LauncherTheme != LauncherThemeValues[2] && LauncherTheme != LauncherThemeValues[3])
    LauncherTheme := LauncherThemeValues[1]
LauncherHotkey := IniRead(SettingsFile, "Launcher", "Hotkey", LauncherHotkeyValues[1])
HotkeyIsValid := false
for Value in LauncherHotkeyValues {
    if (Value = LauncherHotkey) {
        HotkeyIsValid := true
        break
    }
}
if !HotkeyIsValid
    LauncherHotkey := LauncherHotkeyValues[1]

Scripts := []
LoadScriptsFromJson()
try UpdateDesktopLauncherShortcut(LauncherHotkey)

; ---------------- Main GUI ----------------

MainGui := Gui("+Resize +MinSize1090x450", "2T LauncherPro")
MainGui.BackColor := "EAF2FB"
MainGui.SetFont("s10", "Segoe UI")

HeaderText := MainGui.AddText("x0 y0 w1090 h44 BackgroundE7F7FB")
LogoText := MainGui.AddText("x14 y2 w40 h40 Center 0x200 Background168CF0 cFFFFFF", "T")
LogoText.SetFont("s12 Bold", "Segoe UI")
AppNameText := MainGui.AddText("x68 y8 w150 h28 BackgroundTrans c172B3A", "2T Launcher")
AppNameText.SetFont("s15 Bold", "Segoe UI")
AppNameProText := MainGui.AddText("x188 y8 w60 h28 BackgroundTrans c168CF0", "Pro")
AppNameProText.SetFont("s15 Bold", "Segoe UI")
SettingsButton := MainGui.AddButton("x1020 y7 w55 h30", "⚙")
SettingsButton.SetFont("s13", "Segoe UI Symbol")

MainGui.AddText("x10 y58 c1E3A5F", "Search:")
SearchBox := MainGui.AddEdit("x70 y53 w220 h26")

MainGui.AddText("x310 y58 c1E3A5F", "Category:")
CategoryDDLItems := ["All"]
for Cat in CategoryPlainList
    CategoryDDLItems.Push(CategoryEmoji(Cat))
CategoryDDL := MainGui.AddDropDownList("x380 y53 w220", CategoryDDLItems)
CategoryDDL.Value := 1

ViewLogButton := MainGui.AddButton("x10 y100 w100 h32", "View Log")
RefreshButton := MainGui.AddButton("x120 y100 w100 h32", "Refresh")
AddScriptButton := MainGui.AddButton("x230 y100 w120 h32", "Add Script")
AddPathButton := MainGui.AddButton("x360 y100 w140 h32", "Add File/Folder")
EditInfoButton := MainGui.AddButton("x510 y100 w150 h32", "Edit Info")

LV := MainGui.AddListView(
    "x10 y145 w1060 h320 Grid",
    ["Function", "Description", "Category", "Version", "Owner", "Last Updated", "Status"]
)

CopyrightText := MainGui.AddText("x10 y475 w1060 c1E3A5F Center", "2T Launcher PRO")

SearchBox.OnEvent("Change", ApplyFilter)
CategoryDDL.OnEvent("Change", ApplyFilter)

ViewLogButton.OnEvent("Click", ViewLog)
RefreshButton.OnEvent("Click", RefreshList)
AddScriptButton.OnEvent("Click", ShowAddScriptDialog)
AddPathButton.OnEvent("Click", ShowAddPathMenu)
EditInfoButton.OnEvent("Click", EditSelectedInfo)
SettingsButton.OnEvent("Click", ShowLauncherSettings)
ApplyLauncherTheme(LauncherTheme)

LV.OnEvent("DoubleClick", LV_DoubleClick)
LV.OnEvent("ContextMenu", ShowItemContextMenu)
MainGui.OnEvent("Size", GuiResize)

LoadScripts()

MainGui.Show("w1090 h580")
ApplyLogoRoundedCorners()

; ---------------- Window resize ----------------

GuiResize(GuiObj, MinMax, Width, Height) {
    global HeaderText, SettingsButton, LV, CopyrightText

    if (MinMax = -1) ; minimized - nothing has a usable size, skip
        return

    HeaderText.Move(0, 0, Width, 44)
    SettingsButton.Move(Width - 65, 7, 55, 30)
    LV.Move(10, 145, Width - 20, Height - 145 - 45)
    StretchListViewColumns()

    CopyrightText.Move(10, Height - 30, Width - 20)
}

ShowLauncherSettings(*) {
    global MainGui, LauncherHotkey, LauncherHotkeyLabels, LauncherHotkeyValues
    global LauncherTheme, LauncherThemeLabels, LauncherThemeValues

    SettingsGui := Gui("+Owner" MainGui.Hwnd, "Cài đặt 2T Launcher PRO")
    SettingsGui.BackColor := "EAF2FB"
    SettingsGui.SetFont("s10", "Segoe UI")

    SettingsGui.AddText("x20 y18 w540", "Đường dẫn launcher hiện tại:")
    SettingsGui.AddEdit("x20 y42 w540 ReadOnly", A_ScriptFullPath)
    SettingsGui.AddText("x20 y82 w540", "Phím tắt mở launcher:")
    HotkeyDDL := SettingsGui.AddDropDownList("x20 y106 w220", LauncherHotkeyLabels)

    CurrentIndex := 1
    for Index, Value in LauncherHotkeyValues {
        if (Value = LauncherHotkey) {
            CurrentIndex := Index
            break
        }
    }
    HotkeyDDL.Value := CurrentIndex

    SettingsGui.AddText("x270 y82 w130", "Màu giao diện:")
    ThemeDDL := SettingsGui.AddDropDownList("x270 y106 w180", LauncherThemeLabels)
    CurrentThemeIndex := 1
    for Index, Value in LauncherThemeValues {
        if (Value = LauncherTheme) {
            CurrentThemeIndex := Index
            break
        }
    }
    ThemeDDL.Value := CurrentThemeIndex
    CurrentThemeLabel := LauncherThemeLabels[CurrentThemeIndex]
    SettingsGui.AddText("x20 y150 w540", "Màu hiện tại: " CurrentThemeLabel)

    SettingsGui.AddText("x20 y175 w540 h48", "Sau khi di chuyển hoặc đổi tên thư mục, hãy mở file launcher một lần. Shortcut Desktop sẽ tự cập nhật đường dẫn mới.")
    ApplyButton := SettingsGui.AddButton("x350 y235 w100 h32", "Áp dụng")
    CancelButton := SettingsGui.AddButton("x460 y235 w100 h32", "Đóng")

    ApplyButton.OnEvent("Click", (*) => ApplyLauncherSettings(SettingsGui, HotkeyDDL, ThemeDDL))
    CancelButton.OnEvent("Click", (*) => SettingsGui.Destroy())
    SettingsGui.Show("w580 h285")
}

ApplyLauncherSettings(SettingsGui, HotkeyDDL, ThemeDDL) {
    global LauncherHotkey, LauncherHotkeyValues, SettingsFile
    global LauncherTheme, LauncherThemeValues

    NewHotkey := LauncherHotkeyValues[HotkeyDDL.Value]
    NewTheme := LauncherThemeValues[ThemeDDL.Value]
    try {
        UpdateDesktopLauncherShortcut(NewHotkey)
        IniWrite(NewHotkey, SettingsFile, "Launcher", "Hotkey")
        IniWrite(NewTheme, SettingsFile, "Appearance", "Theme")
        LauncherHotkey := NewHotkey
        LauncherTheme := NewTheme
        ApplyLauncherTheme(LauncherTheme)
        MsgBox("Đã áp dụng giao diện và cập nhật shortcut Desktop với phím tắt " LauncherHotkey ".", "Cài đặt", "Iconi")
        SettingsGui.Destroy()
    } catch as Err {
        MsgBox("Không thể cập nhật cài đặt:`n" Err.Message, "Lỗi", "Iconx")
    }
}

ApplyLauncherTheme(ThemeName) {
    global MainGui, HeaderText, LogoText, AppNameText, AppNameProText

    if (ThemeName = "Orange") {
        WindowColor := "FFF3E8"
        HeaderColor := "FFE1C7"
        AccentColor := "FF7A00"
        LogoColor := AccentColor
        BrandColor := "172B3A"
    } else if (ThemeName = "Blue") {
        WindowColor := "229EDB"
        HeaderColor := "66CCF5"
        AccentColor := "0879A8"
        LogoColor := "168CF0"
        BrandColor := "000000"
    } else {
        WindowColor := "EAF2FB"
        HeaderColor := "E7F7FB"
        AccentColor := "168CF0"
        LogoColor := AccentColor
        BrandColor := "172B3A"
    }

    MainGui.BackColor := WindowColor
    HeaderText.Opt("Background" HeaderColor)
    LogoText.Opt("Background" LogoColor)
    AppNameText.Opt("c" BrandColor)
    AppNameProText.Opt("c" AccentColor)
    ApplyLogoRoundedCorners()
}

ApplyLogoRoundedCorners() {
    global LogoText

    LogoText.GetPos(, , &LogoWidth, &LogoHeight)
    LogoRegion := DllCall("CreateRoundRectRgn", "Int", 0, "Int", 0, "Int", LogoWidth + 1, "Int", LogoHeight + 1, "Int", 12, "Int", 12, "Ptr")
    DllCall("SetWindowRgn", "Ptr", LogoText.Hwnd, "Ptr", LogoRegion, "Int", true, "Int")
}

UpdateDesktopLauncherShortcut(HotkeyValue) {
    ShortcutPath := A_Desktop "\2T Launcher PRO.lnk"
    Shell := ComObject("WScript.Shell")
    Shortcut := Shell.CreateShortcut(ShortcutPath)
    Shortcut.TargetPath := A_ScriptFullPath
    Shortcut.WorkingDirectory := A_ScriptDir
    Shortcut.Description := "Launch 2T Launcher PRO"
    Shortcut.Hotkey := HotkeyValue
    Shortcut.Save()
}

; Keeps every column fixed-width except Description, which absorbs whatever extra
; space the ListView has - avoids a blank "leftover" strip when the window is wide.
StretchListViewColumns() {
    global LV

    LV.GetPos(, , &LVWidth)

    FixedColumnsWidth := 150 + 150 + 70 + 130 + 100 + 140 ; Function, Category, Version, Owner, LastUpdated, Status
    DescWidth := LVWidth - FixedColumnsWidth
    if (DescWidth < 200)
        DescWidth := 200

    LV.ModifyCol(1, 150)
    LV.ModifyCol(2, DescWidth)
    LV.ModifyCol(3, 150)
    LV.ModifyCol(4, 70)
    LV.ModifyCol(5, 130)
    LV.ModifyCol(6, 100)
    LV.ModifyCol(7, 140)
}

; ---------------- Category / path helpers ----------------

CategoryEmoji(Category) {
    static Icons := Map(
        "SAP", "🔧",
        "Excel", "📊",
        "Outlook", "📧",
        "File Management", "📁",
        "Power BI", "📈",
        "Utility", "⚙️"
    )
    return (Icons.Has(Category) ? Icons[Category] : "📄") " " Category
}

ResolvePath(P) {
    return (InStr(P, ":\") = 2 || SubStr(P, 1, 2) = "\\") ? P : A_ScriptDir "\" P
}

ToRelativePath(P) {
    Prefix := A_ScriptDir "\"
    if (SubStr(P, 1, StrLen(Prefix)) = Prefix)
        return SubStr(P, StrLen(Prefix) + 1)
    return P
}

; ---------------- JSON persistence ----------------

LoadScriptsFromJson() {
    global Scripts, DataFile, DataDir

    if !DirExist(DataDir)
        DirCreate(DataDir)

    if !FileExist(DataFile) {
        Scripts := BuildSeedScripts()
        SaveScriptsToJson()
        return
    }

    try {
        JsonText := FileRead(DataFile, "UTF-8")
        Scripts := Jxon.Load(JsonText)
    } catch as Err {
        MsgBox("Không đọc được data\scripts.json:`n" Err.Message "`n`nSẽ dùng danh sách mặc định.", "Lỗi", "Iconx")
        Scripts := BuildSeedScripts()
    }

    ; Status is a runtime-only field (not persisted in JSON) - normalize it on every load.
    for Item in Scripts
        Item.Status := "Sẵn sàng"
}

SaveScriptsToJson() {
    global Scripts, DataFile, DataDir, FieldOrder

    if !DirExist(DataDir)
        DirCreate(DataDir)

    JsonText := Jxon.StringifyArrayOfObjects(Scripts, FieldOrder)

    if FileExist(DataFile)
        FileDelete(DataFile)

    FileAppend(JsonText, DataFile, "UTF-8")
}

BuildSeedScripts() {
    return []
}

MakeScriptItem(FunctionName, Description, Category, Version, Path, Owner, LastUpdated) {
    Item := {}
    Item.Function := FunctionName
    Item.Description := Description
    Item.Category := Category
    Item.Version := Version
    Item.Path := Path
    Item.Owner := Owner
    Item.LastUpdated := LastUpdated
    Item.Status := "Sẵn sàng"
    return Item
}

; ---------------- List rendering / filtering ----------------

LoadScripts(FilterText := "", CategoryIndex := 1) {
    global LV, Scripts, CategoryPlainList

    LV.Delete()

    CategoryFilter := (CategoryIndex = 1) ? "All" : CategoryPlainList[CategoryIndex - 1]

    for Item in Scripts {
        SearchTarget := Item.Function " " Item.Description " " Item.Category " " Item.Version " " Item.Owner

        if FilterText != "" {
            if !InStr(StrLower(SearchTarget), StrLower(FilterText))
                continue
        }

        if CategoryFilter != "All" {
            if Item.Category != CategoryFilter
                continue
        }

        LV.Add(
            "",
            Item.Function,
            Item.Description,
            CategoryEmoji(Item.Category),
            Item.Version,
            Item.Owner,
            Item.LastUpdated,
            Item.Status
        )
    }

    StretchListViewColumns()
}

ApplyFilter(*) {
    global SearchBox, CategoryDDL
    LoadScripts(SearchBox.Value, CategoryDDL.Value)
}

RerenderList() {
    global SearchBox, CategoryDDL
    LoadScripts(SearchBox.Value, CategoryDDL.Value)
}

RefreshList(*) {
    global SearchBox, CategoryDDL
    SearchBox.Value := ""
    CategoryDDL.Value := 1
    LoadScripts()
}

LV_DoubleClick(LV, RowNumber) {
    OpenItemByRow(RowNumber)
}

ShowItemContextMenu(LV, RowNumber, IsRightClick, X, Y) {
    if (RowNumber > 0)
        LV.Modify(RowNumber, "Select Focus")
    else
        RowNumber := LV.GetNext()

    if (RowNumber = 0)
        return

    Item := GetSelectedItem()
    if !IsObject(Item)
        return

    ItemMenu := Menu()
    ItemMenu.Add("Open Folder", OpenSelectedScriptFolder)
    ItemMenu.Add("Edit Info", EditSelectedInfo)

    FullPath := ResolvePath(Item.Path)
    if !DirExist(FullPath)
        ItemMenu.Add("Edit Script", EditSelectedScript)

    ItemMenu.Add(IsAutoHotkeyScript(Item) ? "Delete Script" : "Remove Shortcut", DeleteSelectedScript)
    ItemMenu.Show(X, Y)
}

; ---------------- Edit / Open Folder / View Log ----------------

EditSelectedScript(*) {
    Item := GetSelectedItem()
    if !IsObject(Item)
        return

    FullPath := ResolvePath(Item.Path)
    if !FileExist(FullPath) {
        MsgBox("Không tìm thấy file:`n" FullPath, "Lỗi", "Iconx")
        return
    }

    Run('notepad.exe "' FullPath '"')
}

OpenSelectedScriptFolder(*) {
    Item := GetSelectedItem()
    if !IsObject(Item)
        return

    FullPath := ResolvePath(Item.Path)
    if DirExist(FullPath)
        Dir := FullPath
    else
        SplitPath(FullPath, , &Dir)

    if !DirExist(Dir) {
        MsgBox("Không tìm thấy thư mục:`n" Dir, "Lỗi", "Iconx")
        return
    }

    Run('explorer.exe "' Dir '"')
}

ViewLog(*) {
    LogFile := A_ScriptDir "\logs\run_log.txt"

    if !FileExist(LogFile) {
        MsgBox("Chưa có log nào.", "View Log", "Icon!")
        return
    }

    Run('notepad.exe "' LogFile '"')
}

OpenItemByRow(RowNumber) {
    global LV, Scripts

    SelectedFunction := LV.GetText(RowNumber, 1)

    for Item in Scripts {
        if Item.Function = SelectedFunction {
            FullPath := ResolvePath(Item.Path)

            if !FileExist(FullPath) && !DirExist(FullPath) {
                MsgBox("Không tìm thấy file/thư mục:`n" FullPath, "Lỗi", "Iconx")
                WriteLog("ERROR", Item.Function, "File not found: " FullPath)
                return
            }

            try {
                if IsAutoHotkeyScript(Item) {
                    Run('"' FullPath '"', , , &PID)
                    Item.Status := "Đang chạy..."
                    WriteLog("RUN", Item.Function, FullPath)
                    RerenderList()
                    StartProcessMonitor(Item, PID)
                } else {
                    Run('"' FullPath '"')
                    WriteLog("OPEN", Item.Function, FullPath)
                }
            } catch as Err {
                MsgBox("Không thể mở mục đã chọn:`n" Err.Message, "Lỗi", "Iconx")
                WriteLog("ERROR", Item.Function, Err.Message)
            }

            return
        }
    }

    MsgBox("Không tìm thấy script tương ứng.", "Lỗi", "Iconx")
}

IsAutoHotkeyScript(Item) {
    return (StrLower(SubStr(Item.Path, -4)) = ".ahk")
}

; Polls the launched process every 500ms and flips the row's Status to "Hoàn thành"
; once it exits. State.Fn holds the closure itself so the timer can turn itself off.
StartProcessMonitor(Item, PID) {
    State := {Fn: ""}
    State.Fn := () => CheckProcessStatus(Item, PID, State)
    SetTimer(State.Fn, 500)
}

CheckProcessStatus(Item, PID, State) {
    if ProcessExist(PID)
        return

    SetTimer(State.Fn, 0)
    Item.Status := "Hoàn thành"
    WriteLog("DONE", Item.Function, "Process finished (PID " PID ")")
    RerenderList()
}

GetSelectedRow() {
    global LV

    RowNumber := LV.GetNext()

    if RowNumber = 0 {
        MsgBox("Vui lòng chọn một mục trước.", "Thông báo", "Icon!")
        return 0
    }

    return RowNumber
}

GetSelectedItem() {
    global LV, Scripts

    RowNumber := GetSelectedRow()
    if RowNumber = 0
        return ""

    SelectedFunction := LV.GetText(RowNumber, 1)

    for Item in Scripts {
        if Item.Function = SelectedFunction
            return Item
    }

    MsgBox("Không tìm thấy mục tương ứng.", "Lỗi", "Iconx")
    return ""
}

; ---------------- Add / Edit item dialog ----------------

ShowAddPathMenu(*) {
    AddMenu := Menu()
    AddMenu.Add("File...", (*) => AddPathShortcut(false))
    AddMenu.Add("Folder...", (*) => AddPathShortcut(true))
    MouseGetPos(&X, &Y)
    AddMenu.Show(X, Y)
}

AddPathShortcut(IsFolder) {
    if IsFolder
        SelectedPath := DirSelect("*", 3, "Chọn thư mục cần mở")
    else
        SelectedPath := FileSelect(1, A_MyDocuments, "Chọn file cần mở", "All files (*.*)")

    if (SelectedPath = "")
        return

    global Scripts
    CleanPath := RegExReplace(SelectedPath, "[\\/]+$")
    SplitPath(CleanPath, &FileName)
    ShortcutName := FileName
    Suffix := 2
    while HasFunctionName(ShortcutName) {
        ShortcutName := FileName " (" Suffix ")"
        Suffix += 1
    }

    NewItem := MakeScriptItem(
        ShortcutName,
        IsFolder ? "Folder shortcut" : "File shortcut",
        "File Management",
        "",
        ToRelativePath(CleanPath),
        A_UserName,
        FormatTime(A_Now, "yyyy-MM-dd")
    )

    Scripts.Push(NewItem)
    SaveScriptsToJson()
    WriteLog("ADD", NewItem.Function, NewItem.Path)
    RerenderList()
}

HasFunctionName(FunctionName) {
    global Scripts
    for Item in Scripts {
        if (StrLower(Item.Function) = StrLower(FunctionName))
            return true
    }
    return false
}

ShowAddScriptDialog(*) {
    ShowItemInfoDialog()
}

EditSelectedInfo(*) {
    Item := GetSelectedItem()
    if !IsObject(Item)
        return
    ShowItemInfoDialog(Item)
}

ShowItemInfoDialog(Item := "") {
    global MainGui, CategoryPlainList

    IsEditing := IsObject(Item)
    DialogTitle := IsEditing ? "Cập nhật thông tin" : "Thêm Script Mới"
    AddGui := Gui("+Owner" MainGui.Hwnd, DialogTitle)
    AddGui.BackColor := "EAF2FB"
    AddGui.SetFont("s10", "Segoe UI")

    AddGui.AddText("x10 y15 w100 c1E3A5F", "Function:")
    FunctionEdit := AddGui.AddEdit("x120 y10 w300 h24", IsEditing ? Item.Function : "")

    AddGui.AddText("x10 y50 w100 c1E3A5F", "Description:")
    DescriptionEdit := AddGui.AddEdit("x120 y45 w300 h24", IsEditing ? Item.Description : "")

    AddGui.AddText("x10 y85 w100 c1E3A5F", "Category:")
    CategoryDisplayItems := []
    for Cat in CategoryPlainList
        CategoryDisplayItems.Push(CategoryEmoji(Cat))
    AddCategoryDDL := AddGui.AddDropDownList("x120 y80 w220", CategoryDisplayItems)
    CategoryIndex := 1
    if IsEditing {
        for Index, CategoryName in CategoryPlainList {
            if (CategoryName = Item.Category) {
                CategoryIndex := Index
                break
            }
        }
    }
    AddCategoryDDL.Value := CategoryIndex

    AddGui.AddText("x10 y120 w100 c1E3A5F", "Version:")
    VersionEdit := AddGui.AddEdit("x120 y115 w80 h24", IsEditing ? Item.Version : "1.0")

    AddGui.AddText("x10 y155 w100 c1E3A5F", "Path:")
    PathEdit := AddGui.AddEdit("x120 y150 w300 h24", IsEditing ? Item.Path : "")
    BrowseButton := AddGui.AddButton("x430 y150 w90 h24", "Browse...")

    AddGui.AddText("x10 y190 w100 c1E3A5F", "Owner:")
    OwnerEdit := AddGui.AddEdit("x120 y185 w200 h24", IsEditing ? Item.Owner : A_UserName)

    SaveButton := AddGui.AddButton("x120 y230 w120 h32", IsEditing ? "Update" : "Save")
    CancelButton := AddGui.AddButton("x230 y230 w100 h32", "Cancel")

    BrowseButton.OnEvent("Click", (*) => BrowseForScript(PathEdit))
    CancelButton.OnEvent("Click", (*) => AddGui.Destroy())
    SaveButton.OnEvent("Click", (*) => SaveItemInfo(AddGui, FunctionEdit, DescriptionEdit, AddCategoryDDL, VersionEdit, PathEdit, OwnerEdit, Item))

    AddGui.Show("w540 h290")
}

BrowseForScript(PathEdit) {
    SelectedFile := FileSelect("", A_ScriptDir "\scripts\", "Chọn script AutoHotkey", "AutoHotkey Scripts (*.ahk)")
    if (SelectedFile != "")
        PathEdit.Value := SelectedFile
}

SaveItemInfo(AddGui, FunctionEdit, DescriptionEdit, CategoryDDL, VersionEdit, PathEdit, OwnerEdit, ExistingItem := "") {
    global Scripts, CategoryPlainList

    IsEditing := IsObject(ExistingItem)
    FunctionName := Trim(FunctionEdit.Value)
    ScriptPath := Trim(PathEdit.Value)

    if (FunctionName = "") {
        MsgBox("Vui lòng nhập Function.", "Lỗi", "Iconx")
        return
    }

    if (ScriptPath = "") {
        MsgBox("Vui lòng chọn Path cho script.", "Lỗi", "Iconx")
        return
    }

    for Item in Scripts {
        if (StrLower(Item.Function) = StrLower(FunctionName) && (!IsEditing || Item != ExistingItem)) {
            MsgBox("Function name đã tồn tại, vui lòng chọn tên khác.", "Lỗi", "Iconx")
            return
        }
    }

    Category := CategoryPlainList[CategoryDDL.Value]
    Version := Trim(VersionEdit.Value)
    if (Version = "")
        Version := "1.0"
    Owner := Trim(OwnerEdit.Value)
    if (Owner = "")
        Owner := A_UserName

    if IsEditing {
        ExistingItem.Function := FunctionName
        ExistingItem.Description := DescriptionEdit.Value
        ExistingItem.Category := Category
        ExistingItem.Version := Version
        ExistingItem.Path := ToRelativePath(ScriptPath)
        ExistingItem.Owner := Owner
        ExistingItem.LastUpdated := FormatTime(A_Now, "yyyy-MM-dd")
        ExistingItem.Status := "Sẵn sàng"
        NewItem := ExistingItem
        LogAction := "UPDATE"
    } else {
        NewItem := MakeScriptItem(
            FunctionName,
            DescriptionEdit.Value,
            Category,
            Version,
            ToRelativePath(ScriptPath),
            Owner,
            FormatTime(A_Now, "yyyy-MM-dd")
        )
        Scripts.Push(NewItem)
        LogAction := "ADD"
    }

    SaveScriptsToJson()
    WriteLog(LogAction, NewItem.Function, NewItem.Path)

    AddGui.Destroy()
    RerenderList()
}

; ---------------- Delete script ----------------

DeleteSelectedScript(*) {
    global Scripts

    Item := GetSelectedItem()
    if !IsObject(Item)
        return

    EntryType := IsAutoHotkeyScript(Item) ? "script" : "shortcut"
    Confirm := MsgBox("Bạn có chắc muốn xoá " EntryType " '" Item.Function "' khỏi danh sách không?", "Xác nhận xoá", "YesNo Icon!")
    if (Confirm != "Yes")
        return

    for Index, Existing in Scripts {
        if (Existing = Item) {
            Scripts.RemoveAt(Index)
            break
        }
    }

    SaveScriptsToJson()
    WriteLog("DELETE", Item.Function, Item.Path)
    RerenderList()
}

; ---------------- Logging ----------------

WriteLog(Action, FunctionName, Message) {
    LogDir := A_ScriptDir "\logs"

    if !DirExist(LogDir)
        DirCreate(LogDir)

    LogFile := LogDir "\run_log.txt"

    LogLine := FormatTime(A_Now, "yyyy-MM-dd HH:mm:ss")
        . " | " Action
        . " | " FunctionName
        . " | " Message
        . "`n"

    FileAppend(LogLine, LogFile, "UTF-8")
}
