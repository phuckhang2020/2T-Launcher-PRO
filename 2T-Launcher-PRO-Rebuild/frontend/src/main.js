import './style.css';

const defaults = {
	hotkey: 'CTRL+SHIFT+O',
	theme: 'Default',
	mode: 'light',
	scriptFolder: '',
	ahkExePath: '',
	categoryDisplay: 'pane',
	language: 'vi',
	categorySortingEnabled: false,
};
const defaultCategories = ['SAP', 'Excel', 'Outlook', 'File Management', 'Power BI', 'Utility'];
const translations = {
	vi: {
		workspace: 'Workspace', notice: 'THÔNG BÁO', noticeTitle: 'Thông báo', categories: 'DANH MỤC', manageCategories: 'Quản lý danh mục', addItem: 'Thêm mục', addFilesFoldersAHK: 'Thêm Tệp/Thư mục/AHK',
		nameDescription: 'TÊN / MÔ TẢ', category: 'DANH MỤC', path: 'ĐƯỜNG DẪN', actions: 'THAO TÁC', all: 'Tất cả', items: 'Các mục', searchPlaceholder: 'Tìm theo tên hoặc mô tả...',
		history: 'Lịch sử', ahkIdle: 'AHK sẵn sàng', memory: 'Memory', preferences: 'TÙY CHỈNH ỨNG DỤNG', settings: 'Cài đặt', settingsSubtitle: 'Tùy chỉnh cách mở ứng dụng và giao diện.', open: 'Mở', edit: 'Sửa', delete: 'Xóa', addAction: 'Thêm', editAction: 'Sửa', deleteAction: 'Xóa', runAction: 'Chạy',
		appHotkey: 'Phím tắt mở ứng dụng', desktopHotkeyHelp: 'Thiết lập tổ hợp phím trên shortcut Desktop.', keyCombination: 'Tổ hợp phím', appearance: 'Màu sắc giao diện', accentHelp: 'Chọn màu nhấn cho điều hướng và thao tác.',
		chooseAccent: 'Chọn màu giao diện', default: 'Mặc định', blue: 'Xanh', orange: 'Cam sáng', defaultScriptFolder: 'Thư mục script mặc định', defaultScriptFolderHelp: 'Thư mục mở sẵn khi thêm file.', scriptFolderPath: 'Đường dẫn thư mục script', browse: 'Duyệt',
		ahkHelp: 'Chọn executable để chạy script AHK.', ahkExecutablePath: 'Đường dẫn AutoHotkey executable', chooseAhk: 'Chọn AHK', categoryDisplay: 'Hiển thị danh mục', categoryDisplayHelp: 'Chọn kiểu điều hướng danh mục.', displayMode: 'Kiểu hiển thị', paneMode: 'Pane bên trái', dropdownMode: 'Danh sách thả xuống',
		language: 'Ngôn ngữ', languageHelp: 'Ngôn ngữ hiển thị của ứng dụng.', appLanguage: 'Ngôn ngữ ứng dụng', resetApp: 'Đặt lại ứng dụng', resetHelp: 'Khôi phục cài đặt mặc định. Mục và danh mục không bị xóa.', resetSettings: 'Đặt lại cài đặt', confirmResetSettings: 'Khôi phục cài đặt mặc định? Danh sách script và dữ liệu sẽ được giữ nguyên.', appDetails: 'Chi tiết ứng dụng', updateNotChecked: 'Chưa kiểm tra bản cập nhật', checkUpdates: 'Kiểm tra cập nhật', openRelease: 'Mở bản phát hành', saveSettings: 'Lưu cài đặt',
		itemName: 'Tên mục', description: 'Mô tả', fileOrFolder: 'File hoặc thư mục', file: 'File', folder: 'Thư mục', cancel: 'Huỷ', save: 'Lưu', restoreDefaults: 'Khôi phục', categoryName: 'Tên danh mục mới', add: 'Thêm', activity: 'HOẠT ĐỘNG', timeFrame: 'Khoảng thời gian', last24h: '24 giờ qua', last7d: '7 ngày qua', last30d: '30 ngày qua', allTime: 'Tất cả',
		ahkRunning: 'AHK đang chạy', ahkPaused: 'AHK tạm dừng', ahkError: 'AHK lỗi', ahkNotReady: 'AHK chưa sẵn sàng', ahkNotReadyTitle: 'AutoHotkey chưa sẵn sàng', ahkNotReadyHelp: 'Để chạy script AHK, hãy tải AutoHotkey mới nhất từ trang chủ rồi chọn file executable trong Cài đặt.', downloadAhk: 'Tải AutoHotkey', pause: 'Tạm dừng', resume: 'Tiếp tục', noHistory: 'Chưa có hoạt động trong khoảng thời gian này.', latestVersion: 'Bạn đang dùng phiên bản mới nhất', updateAvailable: 'Đã có phiên bản mới', updateFailed: 'Không thể kiểm tra cập nhật', settingsSaved: 'Đã lưu cài đặt.', selectItem: 'Chọn mục', selectAllItems: 'Chọn tất cả mục đang hiển thị', deleteSelectedItems: 'Xóa mục đã chọn', deleteSelectedCategories: 'Xóa danh mục đã chọn', selectAllCategories: 'Chọn tất cả danh mục', protectedAllCategory: 'Không thể xóa', selectedCount: 'đã chọn', confirmDeleteItems: 'Xóa các mục đã chọn khỏi danh sách? File gốc sẽ không bị xóa.', confirmDeleteCategories: 'Xóa các danh mục đã chọn?', doubleClickToRun: 'Nhấp đúp để chạy/mở',
	},
	en: {
		workspace: 'Workspace', notice: 'NOTICE', noticeTitle: 'Notice', categories: 'CATEGORIES', manageCategories: 'Manage categories', addItem: 'Add item', addFilesFoldersAHK: 'Add File/Folder/AHK',
		nameDescription: 'NAME / DESCRIPTION', category: 'CATEGORY', path: 'PATH', actions: 'ACTIONS', all: 'All', items: 'Items', searchPlaceholder: 'Search by name or description...',
		history: 'History', ahkIdle: 'AHK ready', memory: 'Memory', preferences: 'PREFERENCES', settings: 'Settings', settingsSubtitle: 'Configure app launch and appearance.', open: 'Open', edit: 'Edit', delete: 'Delete', addAction: 'Added', editAction: 'Edited', deleteAction: 'Removed', runAction: 'Opened/ran',
		appHotkey: 'Application shortcut', desktopHotkeyHelp: 'Set the keyboard shortcut on the Desktop link.', keyCombination: 'Key combination', appearance: 'Appearance', accentHelp: 'Choose the accent used for navigation and actions.',
		chooseAccent: 'Choose accent color', default: 'Default', blue: 'Blue', orange: 'Orange', defaultScriptFolder: 'Default script folder', defaultScriptFolderHelp: 'Folder opened when adding a file.', scriptFolderPath: 'Script folder path', browse: 'Browse',
		ahkHelp: 'Select the executable used to run AHK scripts.', ahkExecutablePath: 'AutoHotkey executable path', chooseAhk: 'Select AHK', categoryDisplay: 'Category display', categoryDisplayHelp: 'Choose how category navigation is shown.', displayMode: 'Display mode', paneMode: 'Left pane', dropdownMode: 'Dropdown list',
		language: 'Language', languageHelp: 'Application display language.', appLanguage: 'Application language', resetApp: 'Reset application', resetHelp: 'Restore default settings. Items and categories are kept.', resetSettings: 'Reset settings', confirmResetSettings: 'Restore default settings? Your scripts and data will be kept.', appDetails: 'App details', updateNotChecked: 'Updates have not been checked', checkUpdates: 'Check for updates', openRelease: 'View release', saveSettings: 'Save settings',
		itemName: 'Item name', description: 'Description', fileOrFolder: 'File or folder', file: 'File', folder: 'Folder', cancel: 'Cancel', save: 'Save', restoreDefaults: 'Restore', categoryName: 'New category name', add: 'Add', activity: 'ACTIVITY', timeFrame: 'Time frame', last24h: 'Last 24 hours', last7d: 'Last 7 days', last30d: 'Last 30 days', allTime: 'All time',
		ahkRunning: 'AHK running', ahkPaused: 'AHK paused', ahkError: 'AHK error', ahkNotReady: 'AHK not ready', ahkNotReadyTitle: 'AutoHotkey is not ready', ahkNotReadyHelp: 'To run an AHK script, download the latest AutoHotkey release from its homepage, then select the executable in Settings.', downloadAhk: 'Download AutoHotkey', pause: 'Pause', resume: 'Resume', noHistory: 'No activity in this time frame.', latestVersion: 'You are using the latest version', updateAvailable: 'A new version is available', updateFailed: 'Could not check for updates', settingsSaved: 'Settings saved.', selectItem: 'Select item', selectAllItems: 'Select all visible items', deleteSelectedItems: 'Delete selected items', deleteSelectedCategories: 'Delete selected categories', selectAllCategories: 'Select all categories', protectedAllCategory: 'Cannot be deleted', selectedCount: 'selected', confirmDeleteItems: 'Remove selected items from the list? Original files will not be deleted.', confirmDeleteCategories: 'Delete selected categories?', doubleClickToRun: 'Double-click to run/open',
	},
};
const appApi = window.go?.main?.App;
const settingsDialog = document.querySelector('#settings-dialog');
const historyDialog = document.querySelector('#history-dialog');
const settingsMessage = document.querySelector('#settings-message');
const hotkeyInput = document.querySelector('#hotkey-setting');
const folderInput = document.querySelector('#script-folder-setting');
const ahkExeInput = document.querySelector('#ahk-exe-setting');
const darkModeInput = document.querySelector('#header-dark-mode');
const categoryDisplayInput = document.querySelector('#category-display-setting');
const languageInput = document.querySelector('#language-setting');
const categoryDropdown = document.querySelector('#category-dropdown');
const itemDialog = document.querySelector('#item-dialog');
const categoryDialog = document.querySelector('#category-dialog');
const itemForm = document.querySelector('#item-form');
const categoryForm = document.querySelector('#category-form');
const itemError = document.querySelector('#item-error');
const categoryError = document.querySelector('#category-error');
const ahkGuideDialog = document.querySelector('#ahk-guide-dialog');
const confirmDialog = document.querySelector('#confirm-dialog');

let currentSettings = { ...defaults };
let currentLibrary = { items: [], categories: [...defaultCategories] };
let selectedCategory = '';
const selectedItemIds = new Set();
const selectedCategoryNames = new Set();
let visibleItemIds = [];
let toastTimer;

function t(key) {
	return translations[currentSettings.language]?.[key] || translations.vi[key] || key;
}

function applyLanguage() {
	document.documentElement.lang = currentSettings.language === 'en' ? 'en' : 'vi';
	document.querySelectorAll('[data-i18n]').forEach((element) => {
		element.textContent = t(element.dataset.i18n);
	});
	document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
		element.placeholder = t(element.dataset.i18nPlaceholder);
	});
	const title = selectedCategory || t('all');
	document.querySelector('#page-title').textContent = title;
	document.querySelector('#workspace-title').textContent = title;
	document.querySelector('#library-title').textContent = t('items');
	document.querySelector('#settings-button').title = t('settings');
	document.querySelector('#header-dark-mode').parentElement.title = currentSettings.language === 'en' ? 'Toggle light/dark appearance' : 'Chuyển giao diện sáng/tối';
}

async function loadSettings() {
	try {
		if (appApi?.GetSettings) {
			currentSettings = { ...defaults, ...(await appApi.GetSettings()) };
		} else {
			currentSettings = { ...defaults, ...JSON.parse(localStorage.getItem('2t-launcher-settings') || '{}') };
		}
	} catch {
		currentSettings = { ...defaults };
		showMessage('Không đọc được cài đặt; đang dùng giá trị mặc định.', true);
	}
	applySettingsToForm();
	applyTheme();
	applyCategoryDisplay();
	applyLanguage();
	renderLibrary();
}

function applySettingsToForm() {
	hotkeyInput.value = currentSettings.hotkey;
	folderInput.value = currentSettings.scriptFolder;
	ahkExeInput.value = currentSettings.ahkExePath || '';
	darkModeInput.checked = currentSettings.mode === 'dark';
	categoryDisplayInput.value = currentSettings.categoryDisplay;
	languageInput.value = currentSettings.language;
	document.querySelector('#category-sort-toggle').setAttribute('aria-pressed', String(currentSettings.categorySortingEnabled));
	document.querySelector('#category-sort-toggle').classList.toggle('enabled', currentSettings.categorySortingEnabled);
	document.querySelectorAll('input[name="theme-setting"]').forEach((input) => {
		input.checked = input.value === currentSettings.theme;
	});
}

function applyTheme() {
	const root = document.documentElement;
	root.dataset.theme = currentSettings.theme.toLowerCase();
	root.dataset.mode = currentSettings.mode;
	document.querySelector('meta[name="theme-color"]').content = currentSettings.mode === 'dark' ? '#202226' : '#f2f2f3';
	darkModeInput.checked = currentSettings.mode === 'dark';
}

function collectSettings() {
	return {
		hotkey: hotkeyInput.value,
		theme: document.querySelector('input[name="theme-setting"]:checked')?.value || defaults.theme,
		mode: darkModeInput.checked ? 'dark' : 'light',
		scriptFolder: folderInput.value.trim(),
		ahkExePath: ahkExeInput.value.trim(),
		categoryDisplay: categoryDisplayInput.value,
		language: languageInput.value,
		categorySortingEnabled: document.querySelector('#category-sort-toggle').getAttribute('aria-pressed') === 'true',
	};
}

function showMessage(message, isError = false) {
	settingsMessage.textContent = message;
	settingsMessage.dataset.state = isError ? 'error' : 'success';
}

async function loadLibrary() {
	try {
		if (appApi?.GetLibrary) {
			currentLibrary = await appApi.GetLibrary();
		} else {
			currentLibrary = JSON.parse(localStorage.getItem('2t-launcher-library') || 'null') || {
				items: [],
				categories: [...defaultCategories],
			};
		}
		currentLibrary.items ||= [];
		currentLibrary.categories ||= [...defaultCategories];
	} catch (error) {
		currentLibrary = { items: [], categories: [...defaultCategories] };
		showToast(error?.message || 'Không thể tải thư viện.', true);
	}
	renderLibrary();
}

function saveFallbackLibrary() {
	localStorage.setItem('2t-launcher-library', JSON.stringify(currentLibrary));
}

function renderLibrary() {
	renderCategories();
	renderCategorySelect();
	renderCategoryManager();
	renderItems();
}

function renderCategories() {
	const categoryList = document.querySelector('#category-list');
	categoryList.replaceChildren();
	categoryList.append(createCategoryButton('', t('all'), currentLibrary.items.length, 'blue'));
	categoryDropdown.replaceChildren();
	categoryDropdown.add(new Option(t('all'), ''));
	currentLibrary.categories.forEach((category, index) => {
		const count = currentLibrary.items.filter((item) => item.category === category).length;
		categoryList.append(createCategoryButton(category, category, count, ['violet', 'green', 'orange', 'slate', 'cyan', 'pink'][index % 6]));
		categoryDropdown.add(new Option(category, category));
	});
	categoryDropdown.value = selectedCategory;
}

function createCategoryButton(value, label, count, color) {
	const button = document.createElement('button');
	button.className = `category-item${selectedCategory === value ? ' active' : ''}`;
	button.type = 'button';
	button.dataset.category = value;
	button.draggable = Boolean(value) && currentSettings.categorySortingEnabled;
	const dot = document.createElement('i');
	dot.className = `dot ${color}`;
	const name = document.createElement('span');
	name.textContent = label;
	const badge = document.createElement('span');
	badge.className = 'category-count';
	badge.textContent = String(count);
	button.append(dot, name, badge);
	button.addEventListener('click', () => selectCategory(value));
	button.addEventListener('dragstart', (event) => {
		if (!currentSettings.categorySortingEnabled || !value) {
			event.preventDefault();
			return;
		}
		event.dataTransfer.setData('text/category', value);
		event.dataTransfer.effectAllowed = 'move';
	});
	button.addEventListener('dragover', (event) => {
		if (currentSettings.categorySortingEnabled && value) {
			event.preventDefault();
			event.dataTransfer.dropEffect = 'move';
		}
	});
	button.addEventListener('drop', (event) => {
		event.preventDefault();
		const source = event.dataTransfer.getData('text/category');
		if (source && value && source !== value) reorderCategories(source, value);
	});
	return button;
}

function selectCategory(category) {
	selectedCategory = category;
	document.querySelector('#page-title').textContent = category || t('all');
	document.querySelector('#workspace-title').textContent = category || t('all');
	categoryDropdown.value = category;
	renderLibrary();
}

function applyCategoryDisplay() {
	const display = currentSettings.categoryDisplay === 'dropdown' ? 'dropdown' : 'pane';
	const sidebar = document.querySelector('.sidebar');
	sidebar.dataset.categoryDisplay = display;
	sidebar.classList.toggle('sorting-categories', currentSettings.categorySortingEnabled);
	categoryDropdown.hidden = display !== 'dropdown' || currentSettings.categorySortingEnabled;
}

async function reorderCategories(source, target) {
	const nextCategories = [...currentLibrary.categories];
	const sourceIndex = nextCategories.indexOf(source);
	const targetIndex = nextCategories.indexOf(target);
	if (sourceIndex < 0 || targetIndex < 0) return;
	nextCategories.splice(targetIndex, 0, ...nextCategories.splice(sourceIndex, 1));
	try {
		if (appApi?.ReorderCategories) await appApi.ReorderCategories(nextCategories);
		else {
			currentLibrary.categories = nextCategories;
			saveFallbackLibrary();
		}
		await loadLibrary();
		showToast(currentSettings.language === 'en' ? 'Category order updated.' : 'Đã cập nhật thứ tự danh mục.');
	} catch (error) {
		showToast(error?.message || 'Không thể sắp xếp danh mục.', true);
	}
}

function renderCategorySelect() {
	const select = document.querySelector('#item-category');
	const previous = select.value;
	select.replaceChildren();
	select.add(new Option(t('all'), ''));
	currentLibrary.categories.forEach((category) => {
		const option = document.createElement('option');
		option.value = category;
		option.textContent = category;
		select.append(option);
	});
	select.value = currentLibrary.categories.includes(previous) ? previous : '';
}

function renderCategoryManager() {
	const list = document.querySelector('#category-manager-list');
	list.replaceChildren();
	const allRow = document.createElement('div');
	allRow.className = 'category-manager-row protected-category-row';
	const protectedCheckbox = document.createElement('input');
	protectedCheckbox.type = 'checkbox';
	protectedCheckbox.disabled = true;
	protectedCheckbox.setAttribute('aria-label', t('all'));
	const allName = document.createElement('strong');
	allName.textContent = t('all');
	const protectedLabel = document.createElement('span');
	protectedLabel.className = 'protected-category-label';
	protectedLabel.textContent = t('protectedAllCategory');
	allRow.append(protectedCheckbox, allName, protectedLabel);
	list.append(allRow);
	currentLibrary.categories.forEach((category) => {
		const row = document.createElement('div');
		row.className = 'category-manager-row';
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'category-select-checkbox';
		checkbox.value = category;
		checkbox.checked = selectedCategoryNames.has(category);
		checkbox.addEventListener('change', () => {
			if (checkbox.checked) selectedCategoryNames.add(category);
			else selectedCategoryNames.delete(category);
			updateCategorySelectionControls();
		});
		const name = document.createElement('strong');
		name.textContent = category;
		const actions = document.createElement('span');
		actions.className = 'category-manager-actions';
		actions.append(createActionButton('✎', `${t('edit')} ${category}`, () => renameCategory(category)), createActionButton('×', `${t('delete')} ${category}`, () => removeCategory(category)));
		row.append(checkbox, name, actions);
		list.append(row);
	});
	updateCategorySelectionControls();
}

function renderItems() {
	const host = document.querySelector('#library-items');
	const query = document.querySelector('#library-search').value.trim().toLocaleLowerCase();
	const items = currentLibrary.items.filter((item) => {
		const inCategory = !selectedCategory || item.category === selectedCategory;
		const target = `${item.name} ${item.description} ${item.category} ${item.path}`.toLocaleLowerCase();
		return inCategory && target.includes(query);
	});
	visibleItemIds = items.map((item) => item.id);
	for (const id of selectedItemIds) {
		if (!currentLibrary.items.some((item) => item.id === id)) selectedItemIds.delete(id);
	}
	host.replaceChildren();
	items.forEach((item) => host.append(createItemRow(item)));
	document.querySelector('#empty-state').hidden = items.length > 0;
	document.querySelector('#empty-add-button').hidden = items.length > 0 || Boolean(query);
	document.querySelector('#total-count').textContent = String(items.length);
	updateItemSelectionControls();
}

function updateItemSelectionControls() {
	const toolbar = document.querySelector('#bulk-items-actions');
	const selectedCount = selectedItemIds.size;
	toolbar.hidden = selectedCount === 0;
	document.querySelector('#selected-items-label').textContent = `${selectedCount} ${t('selectedCount')}`;
	const selectAll = document.querySelector('#select-all-items');
	const visibleSelected = visibleItemIds.filter((id) => selectedItemIds.has(id)).length;
	selectAll.checked = visibleItemIds.length > 0 && visibleSelected === visibleItemIds.length;
	selectAll.indeterminate = visibleSelected > 0 && visibleSelected < visibleItemIds.length;
}

function updateCategorySelectionControls() {
	const checkboxes = [...document.querySelectorAll('.category-select-checkbox')];
	const selectAll = document.querySelector('#select-all-categories');
	const selected = checkboxes.filter((checkbox) => checkbox.checked).length;
	selectAll.checked = checkboxes.length > 0 && selected === checkboxes.length;
	selectAll.indeterminate = selected > 0 && selected < checkboxes.length;
	document.querySelector('#bulk-delete-categories').disabled = selected === 0;
}

function createActionButton(symbol, label, onClick) {
	const button = document.createElement('button');
	button.className = 'action-button';
	button.type = 'button';
	button.textContent = symbol;
	button.title = label;
	button.setAttribute('aria-label', label);
	button.addEventListener('click', onClick);
	return button;
}

function createItemRow(item) {
	const row = document.createElement('div');
	row.className = 'library-row';
	const identity = document.createElement('div');
	identity.className = 'item-identity';
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.className = 'item-select-checkbox';
	checkbox.checked = selectedItemIds.has(item.id);
	checkbox.setAttribute('aria-label', `${t('selectItem')} ${item.name}`);
	checkbox.addEventListener('change', () => {
		if (checkbox.checked) selectedItemIds.add(item.id);
		else selectedItemIds.delete(item.id);
		updateItemSelectionControls();
	});
	const copy = document.createElement('div');
	copy.className = 'item-copy';
	const name = document.createElement('strong');
	name.textContent = item.name;
	name.title = t('doubleClickToRun');
	name.addEventListener('dblclick', () => runItem(item));
	const description = document.createElement('span');
	description.textContent = item.description || item.path;
	copy.append(name, description);
	identity.append(checkbox, copy);
	const category = document.createElement('span');
	category.className = 'item-category';
	category.textContent = item.category || t('all');
	const path = document.createElement('span');
	path.className = 'item-path';
	path.title = item.path;
	path.textContent = item.path;
	const actions = document.createElement('div');
	actions.className = 'item-actions';
	if (item.status === 'Đang chạy' || item.status === 'Tạm dừng') {
		const paused = item.status === 'Tạm dừng';
		actions.append(createActionButton(paused ? '▶' : 'Ⅱ', paused ? t('resume') : t('pause'), async () => {
			try {
				if (appApi?.ToggleAHKPause) await appApi.ToggleAHKPause(item.id);
				await loadLibrary();
			} catch (error) {
				showToast(error?.message || 'Không thể đổi trạng thái AHK.', true);
			}
		}));
	}
	actions.append(
		createActionButton('▶', `${t('open')} ${item.name}`, () => runItem(item)),
		createActionButton('✎', `${t('edit')} ${item.name}`, () => openItemDialog(item)),
		createActionButton('×', `${t('delete')} ${item.name}`, () => removeItem(item)),
	);
	row.append(identity, category, path, actions);
	return row;
}

async function runItem(item) {
	const isAHKScript = item.path.toLowerCase().endsWith('.ahk');
	if (isAHKScript && !currentSettings.ahkExePath) {
		ahkGuideDialog.showModal();
		return;
	}
	try {
		if (appApi?.RunItem) await appApi.RunItem(item.id);
		else if (isAHKScript && !currentSettings.ahkExePath) {
			ahkGuideDialog.showModal();
			return;
		} else showToast(currentSettings.language === 'en' ? 'Opening items is available in the desktop app.' : 'Mở mục khả dụng trong ứng dụng desktop.');
		await recordActivity(t('runAction'), item.name);
		await loadLibrary();
	} catch (error) {
		if (/autohotkey/i.test(error?.message || '') && isAHKScript) ahkGuideDialog.showModal();
		else showToast(error?.message || (currentSettings.language === 'en' ? 'Could not open item.' : 'Không thể mở mục.'), true);
	}
}

function openItemDialog(item = null) {
	itemError.textContent = '';
	itemForm.reset();
	document.querySelector('#item-id').value = item?.id || '';
	document.querySelector('#item-name').value = item?.name || '';
	document.querySelector('#item-description').value = item?.description || '';
	document.querySelector('#item-path').value = item?.path || '';
	document.querySelector('#item-dialog-title').textContent = item ? t('edit') : t('addItem');
	renderCategorySelect();
	if (item?.category) document.querySelector('#item-category').value = item.category;
	itemDialog.showModal();
}

async function submitItem(event) {
	event.preventDefault();
	const item = {
		id: document.querySelector('#item-id').value,
		name: document.querySelector('#item-name').value,
		description: document.querySelector('#item-description').value,
		category: document.querySelector('#item-category').value,
		path: document.querySelector('#item-path').value,
	};
	try {
		if (appApi?.SaveItem) await appApi.SaveItem(item);
		else {
			if (item.id) currentLibrary.items = currentLibrary.items.map((entry) => entry.id === item.id ? { ...entry, ...item } : entry);
			else currentLibrary.items.push({ ...item, id: crypto.randomUUID(), status: 'Sẵn sàng' });
			saveFallbackLibrary();
		}
		itemDialog.close();
		await loadLibrary();
		await recordActivity(item.id ? t('editAction') : t('addAction'), item.name);
		showToast(item.id ? (currentSettings.language === 'en' ? 'Item updated.' : 'Đã cập nhật mục.') : (currentSettings.language === 'en' ? 'Item added.' : 'Đã thêm mục.'));
	} catch (error) {
		itemError.textContent = error?.message || 'Không thể lưu mục.';
	}
}

async function chooseItemPath(method) {
	try {
		const path = appApi?.[method] ? await appApi[method]() : window.prompt('Nhập đường dẫn file hoặc thư mục:');
		if (!path) return;
		document.querySelector('#item-path').value = path;
		const nameInput = document.querySelector('#item-name');
		if (!nameInput.value) nameInput.value = path.split(/[\\/]/).filter(Boolean).pop().replace(/\.[^.]+$/, '');
	} catch (error) {
		itemError.textContent = error?.message || 'Không thể chọn đường dẫn.';
	}
}

async function removeItem(item) {
	const confirmation = currentSettings.language === 'en' ? `Remove “${item.name}” from the list? The original file will not be deleted.` : `Xoá “${item.name}” khỏi danh sách? File gốc sẽ không bị xóa.`;
	if (!await confirmInApp(confirmation)) return;
	try {
		if (appApi?.DeleteItem) await appApi.DeleteItem(item.id);
		else {
			currentLibrary.items = currentLibrary.items.filter((entry) => entry.id !== item.id);
			saveFallbackLibrary();
		}
		await loadLibrary();
		await recordActivity(t('deleteAction'), item.name);
		showToast(currentSettings.language === 'en' ? 'Item removed from the list.' : 'Đã xóa mục khỏi danh sách.');
	} catch (error) {
		showToast(error?.message || 'Không thể xoá mục.', true);
	}
}

async function deleteSelectedItems() {
	const ids = [...selectedItemIds];
	if (!ids.length) return;
	if (!await confirmInApp(`${t('confirmDeleteItems')} (${ids.length})`)) return;
	const names = currentLibrary.items.filter((item) => selectedItemIds.has(item.id)).map((item) => item.name);
	try {
		if (appApi?.DeleteItems) await appApi.DeleteItems(ids);
		else {
			currentLibrary.items = currentLibrary.items.filter((item) => !selectedItemIds.has(item.id));
			saveFallbackLibrary();
		}
		selectedItemIds.clear();
		await loadLibrary();
		await recordActivity(t('deleteAction'), names.join(', '));
		showToast(currentSettings.language === 'en' ? `${ids.length} item(s) removed.` : `Đã xóa ${ids.length} mục.`);
	} catch (error) {
		showToast(error?.message || 'Không thể xóa các mục đã chọn.', true);
	}
}

async function deleteSelectedCategories() {
	const names = [...selectedCategoryNames];
	if (!names.length) return;
	if (!await confirmInApp(`${t('confirmDeleteCategories')} (${names.length})`)) return;
	try {
		if (appApi?.DeleteCategories) await appApi.DeleteCategories(names);
		else {
			const deleting = new Set(names);
			currentLibrary.categories = currentLibrary.categories.filter((category) => !deleting.has(category));
			currentLibrary.items = currentLibrary.items.map((item) => deleting.has(item.category) ? { ...item, category: '' } : item);
			saveFallbackLibrary();
		}
		if (selectedCategoryNames.has(selectedCategory)) selectedCategory = '';
		selectedCategoryNames.clear();
		categoryError.textContent = '';
		await loadLibrary();
		await recordActivity(t('deleteAction'), names.join(', '));
		showToast(currentSettings.language === 'en' ? `${names.length} categor(y/ies) removed. Items were kept in All.` : `Đã xóa ${names.length} danh mục. Các mục vẫn được giữ trong Tất cả.`);
	} catch (error) {
		categoryError.textContent = error?.message || 'Không thể xóa các danh mục đã chọn.';
	}
}

async function addCategory(event) {
	event.preventDefault();
	const name = document.querySelector('#new-category-name').value.trim();
	try {
		if (appApi?.AddCategory) await appApi.AddCategory(name);
		else {
			if (isAllCategoryName(name)) throw new Error(currentSettings.language === 'en' ? 'All is a protected system category.' : 'Tất cả là danh mục hệ thống.');
			if (currentLibrary.categories.some((category) => category.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error('Danh mục đã tồn tại.');
			currentLibrary.categories.push(name);
			saveFallbackLibrary();
		}
		categoryForm.reset();
		categoryError.textContent = '';
		await loadLibrary();
		await recordActivity(t('addAction'), name);
	} catch (error) {
		categoryError.textContent = error?.message || 'Không thể thêm danh mục.';
	}
}

async function renameCategory(oldName) {
	const newName = window.prompt('Tên danh mục mới:', oldName)?.trim();
	if (!newName || newName === oldName) return;
	try {
		if (appApi?.RenameCategory) await appApi.RenameCategory(oldName, newName);
		else {
			if (isAllCategoryName(newName)) throw new Error(currentSettings.language === 'en' ? 'All is a protected system category.' : 'Tất cả là danh mục hệ thống.');
			if (currentLibrary.categories.some((category) => category.toLocaleLowerCase() === newName.toLocaleLowerCase())) throw new Error('Danh mục đã tồn tại.');
			currentLibrary.categories = currentLibrary.categories.map((category) => category === oldName ? newName : category);
			currentLibrary.items = currentLibrary.items.map((item) => item.category === oldName ? { ...item, category: newName } : item);
			saveFallbackLibrary();
		}
		if (selectedCategory === oldName) selectedCategory = newName;
		await loadLibrary();
		await recordActivity(currentSettings.language === 'en' ? 'Renamed category' : 'Đổi tên danh mục', `${oldName} → ${newName}`);
		showToast(currentSettings.language === 'en' ? 'Category renamed.' : 'Đã đổi tên danh mục.');
	} catch (error) {
		showToast(error?.message || 'Không thể đổi tên danh mục.', true);
	}
}

function isAllCategoryName(name) {
	const normalized = name.trim().toLocaleLowerCase();
	return normalized === 'all' || normalized === 'tất cả';
}

function confirmInApp(message, acceptLabel = t('delete')) {
	return new Promise((resolve) => {
		let settled = false;
		const acceptButton = document.querySelector('#confirm-accept');
		acceptButton.textContent = acceptLabel;
		const finish = (accepted) => {
			if (settled) return;
			settled = true;
			confirmDialog.oncancel = null;
			confirmDialog.onclick = null;
			document.querySelector('#confirm-cancel').onclick = null;
			acceptButton.onclick = null;
			confirmDialog.close();
			resolve(accepted);
		};
		document.querySelector('#confirm-message').textContent = message;
		confirmDialog.oncancel = (event) => {
			event.preventDefault();
			finish(false);
		};
		confirmDialog.onclick = (event) => {
			if (event.target === confirmDialog) finish(false);
		};
		document.querySelector('#confirm-cancel').onclick = () => finish(false);
		acceptButton.onclick = () => finish(true);
		confirmDialog.showModal();
	});
}

async function removeCategory(category) {
	const message = currentSettings.language === 'en' ? `Delete category “${category}”? Items will remain in All.` : `Xóa danh mục “${category}”? Các mục sẽ vẫn được giữ trong Tất cả.`;
	if (!await confirmInApp(message)) return;
	try {
		if (appApi?.DeleteCategory) await appApi.DeleteCategory(category);
		else {
			currentLibrary.categories = currentLibrary.categories.filter((entry) => entry !== category);
			currentLibrary.items = currentLibrary.items.map((item) => item.category === category ? { ...item, category: '' } : item);
			saveFallbackLibrary();
		}
		if (selectedCategory === category) selectedCategory = '';
		selectedCategoryNames.delete(category);
		categoryError.textContent = '';
		await loadLibrary();
		await recordActivity(t('deleteAction'), category);
	} catch (error) {
		categoryError.textContent = error?.message || 'Không thể xoá danh mục.';
	}
}

function showToast(message, isError = false) {
	const toast = document.querySelector('#app-toast');
	toast.textContent = message;
	toast.dataset.state = isError ? 'error' : 'success';
	toast.classList.add('visible');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}

async function recordActivity(action, item) {
	try {
		if (appApi?.RecordHistory) {
			await appApi.RecordHistory(action, item);
			return;
		}
		const entries = JSON.parse(localStorage.getItem('2t-launcher-history') || '[]');
		entries.push({ timestamp: new Date().toISOString(), user: 'Local user', action, item });
		localStorage.setItem('2t-launcher-history', JSON.stringify(entries.slice(-1000)));
	} catch (error) {
		showToast(error?.message || 'Không thể ghi lịch sử.', true);
	}
}

async function loadHistory() {
	const timeFrame = document.querySelector('#history-range').value;
	let entries = [];
	try {
		if (appApi?.GetHistory) entries = await appApi.GetHistory(timeFrame);
		else {
			const cutoff = timeFrame === '24h' ? Date.now() - 86400000 : timeFrame === '7d' ? Date.now() - 604800000 : timeFrame === '30d' ? Date.now() - 2592000000 : 0;
			entries = JSON.parse(localStorage.getItem('2t-launcher-history') || '[]').filter((entry) => !cutoff || new Date(entry.timestamp).getTime() >= cutoff);
		}
	} catch (error) {
		showToast(error?.message || 'Không thể tải lịch sử.', true);
	}
	renderHistory(entries);
}

function renderHistory(entries) {
	const list = document.querySelector('#history-list');
	list.replaceChildren();
	if (!entries.length) {
		const empty = document.createElement('div');
		empty.className = 'history-empty';
		empty.textContent = t('noHistory');
		list.append(empty);
		return;
	}
	entries.forEach((entry) => {
		const row = document.createElement('div');
		row.className = 'history-entry';
		const date = document.createElement('time');
		date.dateTime = entry.timestamp;
		date.textContent = new Date(entry.timestamp).toLocaleString(currentSettings.language === 'en' ? 'en-US' : 'vi-VN');
		const action = document.createElement('strong');
		action.textContent = entry.action;
		const detail = document.createElement('span');
		detail.textContent = `${entry.item} · ${entry.user}`;
		row.append(date, action, detail);
		list.append(row);
	});
}

function setMetric(id, value) {
	const element = document.querySelector(id);
	const numericValue = Number(value);
	if (!Number.isFinite(numericValue) || numericValue < 0) {
		element.querySelector('strong').textContent = '--%';
		element.removeAttribute('data-level');
		return;
	}
	const rounded = Math.round(numericValue);
	element.querySelector('strong').textContent = `${rounded}%`;
	element.dataset.level = rounded >= 90 ? 'critical' : rounded >= 75 ? 'warning' : 'normal';
}

async function refreshSystemMetrics() {
	if (!appApi?.GetSystemMetrics) return;
	try {
		const metrics = await appApi.GetSystemMetrics();
		setMetric('#cpu-metric', metrics.cpuPercent);
		setMetric('#memory-metric', metrics.memoryPercent);
		setMetric('#gpu-metric', metrics.gpuPercent);
	} catch {
		setMetric('#cpu-metric', -1);
		setMetric('#memory-metric', -1);
		setMetric('#gpu-metric', -1);
	}
}

async function refreshAHKStatus() {
	if (!appApi?.GetAHKStatus) {
		const ready = Boolean(currentSettings.ahkExePath);
		document.querySelector('#ahk-footer-status').dataset.state = ready ? 'idle' : 'not-ready';
		document.querySelector('#ahk-status-label').textContent = ready ? t('ahkIdle') : t('ahkNotReady');
		return;
	}
	try {
		const status = await appApi.GetAHKStatus();
		const footerStatus = document.querySelector('#ahk-footer-status');
		footerStatus.dataset.state = status.state;
		const label = status.state === 'not-ready' ? t('ahkNotReady') : status.state === 'error' ? t('ahkError') : status.state === 'paused' ? t('ahkPaused') : status.state === 'running' ? t('ahkRunning') : t('ahkIdle');
		document.querySelector('#ahk-status-label').textContent = label;
		document.querySelector('#ahk-status-detail').textContent = status.detail ? `(${status.detail})` : '';
	} catch {
		document.querySelector('#ahk-footer-status').dataset.state = 'error';
		document.querySelector('#ahk-status-label').textContent = t('ahkError');
	}
}

async function loadAppInfo() {
	try {
		const info = appApi?.GetAppInfo ? await appApi.GetAppInfo() : { version: '1.0.0', author: 'Tam Truong' };
		document.querySelector('#app-version').textContent = `v${info.version}`;
	} catch {
		document.querySelector('#app-version').textContent = 'v1.0.0';
	}
}

async function checkForUpdates(automatic = false) {
	const message = document.querySelector('#update-message');
	const checkButton = document.querySelector('#check-updates-button');
	checkButton.disabled = true;
	message.textContent = currentSettings.language === 'en' ? 'Checking GitHub Releases…' : 'Đang kiểm tra GitHub Releases…';
	try {
		const result = appApi?.CheckForUpdates ? await appApi.CheckForUpdates() : null;
		if (!result) throw new Error(currentSettings.language === 'en' ? 'Available in the desktop app.' : 'Chỉ khả dụng trong ứng dụng desktop.');
		message.textContent = result.updateAvailable
			? `${t('updateAvailable')}: ${result.latestVersion} (đang dùng ${result.currentVersion})`
			: `${t('latestVersion')} (${result.currentVersion})`;
		const releaseButton = document.querySelector('#open-release-button');
		releaseButton.hidden = !result.updateAvailable;
		releaseButton.dataset.url = result.releaseUrl;
		if (result.updateAvailable && automatic) {
			showToast(`${t('updateAvailable')}: ${result.latestVersion}`);
		}
	} catch (error) {
		message.textContent = `${t('updateFailed')}: ${error?.message || ''}`;
		message.dataset.state = 'error';
	} finally {
		checkButton.disabled = false;
	}
}

function openLatestRelease() {
	const url = document.querySelector('#open-release-button').dataset.url;
	if (!url) return;
	if (window.runtime?.BrowserOpenURL) window.runtime.BrowserOpenURL(url);
	else window.open(url, '_blank', 'noopener');
}

async function saveSettings() {
	const nextSettings = collectSettings();
	try {
		if (appApi?.SaveSettings) {
			await appApi.SaveSettings(nextSettings);
		} else {
			localStorage.setItem('2t-launcher-settings', JSON.stringify(nextSettings));
		}
		currentSettings = nextSettings;
		applySettingsToForm();
		applyTheme();
		applyCategoryDisplay();
		applyLanguage();
		renderLibrary();
		showMessage(t('settingsSaved'));
	} catch (error) {
		showMessage(error?.message || 'Không thể lưu cài đặt.', true);
	}
}

async function browseForFolder() {
	try {
		if (appApi?.PickScriptFolder) {
			const selectedFolder = await appApi.PickScriptFolder();
			if (selectedFolder) folderInput.value = selectedFolder;
		} else {
			const selectedFolder = window.prompt('Nhập đường dẫn thư mục script:', folderInput.value);
			if (selectedFolder !== null) folderInput.value = selectedFolder;
		}
	} catch (error) {
		showMessage(error?.message || 'Không thể mở hộp thoại chọn thư mục.', true);
	}
}

async function browseForAHK() {
	try {
		if (appApi?.PickAHKExecutable) {
			const path = await appApi.PickAHKExecutable();
			if (path) ahkExeInput.value = path;
		} else {
			const path = window.prompt('Nhập đường dẫn tới AutoHotkey executable:', ahkExeInput.value);
			if (path !== null) ahkExeInput.value = path;
		}
	} catch (error) {
		showMessage(error?.message || 'Không thể chọn AutoHotkey executable.', true);
	}
}

async function resetSettings() {
	if (!await confirmInApp(t('confirmResetSettings'), t('restoreDefaults'))) return;
	try {
		if (appApi?.ResetSettings) {
			await appApi.ResetSettings();
			currentSettings = { ...defaults, ...(await appApi.GetSettings()) };
		} else {
			currentSettings = { ...defaults };
			localStorage.setItem('2t-launcher-settings', JSON.stringify(currentSettings));
		}
		applySettingsToForm();
		applyTheme();
		applyCategoryDisplay();
		applyLanguage();
		renderLibrary();
		showMessage(currentSettings.language === 'en' ? 'Settings restored to defaults.' : 'Đã khôi phục cài đặt mặc định.');
	} catch (error) {
		showMessage(error?.message || 'Không thể đặt lại cài đặt.', true);
	}
}

document.querySelector('#settings-button').addEventListener('click', (event) => {
	if (settingsDialog.open) settingsDialog.close();
	else settingsDialog.showModal();
	const button = event.currentTarget;
	button.setAttribute('aria-pressed', String(settingsDialog.open));
	button.classList.toggle('active', settingsDialog.open);
});
document.querySelector('#settings-close').addEventListener('click', () => settingsDialog.close());
settingsDialog.addEventListener('close', () => {
	const button = document.querySelector('#settings-button');
	button.setAttribute('aria-pressed', 'false');
	button.classList.remove('active');
});
settingsDialog.addEventListener('cancel', (event) => {
	event.preventDefault();
	settingsDialog.close();
});
settingsDialog.addEventListener('click', (event) => {
	if (event.target === settingsDialog) settingsDialog.close();
});
document.querySelector('#save-settings-button').addEventListener('click', saveSettings);
document.querySelector('#browse-folder-button').addEventListener('click', browseForFolder);
document.querySelector('#browse-ahk-button').addEventListener('click', browseForAHK);
document.querySelector('#reset-settings-button').addEventListener('click', resetSettings);
document.querySelector('#check-updates-button').addEventListener('click', checkForUpdates);
document.querySelector('#open-release-button').addEventListener('click', openLatestRelease);
document.querySelector('#history-button').addEventListener('click', async () => {
	historyDialog.showModal();
	await loadHistory();
});
document.querySelector('#history-range').addEventListener('change', loadHistory);
document.querySelector('#add-item-button').addEventListener('click', () => openItemDialog());
document.querySelector('#empty-add-button').addEventListener('click', () => openItemDialog());
document.querySelector('#manage-categories-button').addEventListener('click', () => {
	categoryError.textContent = '';
	categoryDialog.showModal();
});
document.querySelector('#select-all-items').addEventListener('change', (event) => {
	for (const id of visibleItemIds) {
		if (event.currentTarget.checked) selectedItemIds.add(id);
		else selectedItemIds.delete(id);
	}
	renderItems();
});
document.querySelector('#bulk-delete-items').addEventListener('click', deleteSelectedItems);
document.querySelector('#select-all-categories').addEventListener('change', (event) => {
	selectedCategoryNames.clear();
	if (event.currentTarget.checked) currentLibrary.categories.forEach((category) => selectedCategoryNames.add(category));
	renderCategoryManager();
});
document.querySelector('#bulk-delete-categories').addEventListener('click', deleteSelectedCategories);
document.querySelector('#download-ahk-button').addEventListener('click', () => {
	if (window.runtime?.BrowserOpenURL) window.runtime.BrowserOpenURL('https://www.autohotkey.com/');
	else window.open('https://www.autohotkey.com/', '_blank', 'noopener');
});
document.querySelector('#pick-item-file').addEventListener('click', () => chooseItemPath('PickItemFile'));
document.querySelector('#pick-item-folder').addEventListener('click', () => chooseItemPath('PickItemFolder'));
document.querySelector('#library-search').addEventListener('input', renderItems);
categoryDropdown.addEventListener('change', () => selectCategory(categoryDropdown.value));
categoryDisplayInput.addEventListener('change', () => {
	currentSettings.categoryDisplay = categoryDisplayInput.value;
	applyCategoryDisplay();
});
languageInput.addEventListener('change', () => {
	currentSettings.language = languageInput.value;
	applyLanguage();
	renderLibrary();
});
document.querySelector('#category-sort-toggle').addEventListener('click', async (event) => {
	currentSettings.categorySortingEnabled = event.currentTarget.getAttribute('aria-pressed') !== 'true';
	event.currentTarget.setAttribute('aria-pressed', String(currentSettings.categorySortingEnabled));
	event.currentTarget.classList.toggle('enabled', currentSettings.categorySortingEnabled);
	renderCategories();
	await saveSettings();
});
document.addEventListener('keydown', (event) => {
	if (event.ctrlKey && event.key.toLowerCase() === 'k') {
		event.preventDefault();
		document.querySelector('#library-search').focus();
	}
});
itemForm.addEventListener('submit', submitItem);
categoryForm.addEventListener('submit', addCategory);
document.querySelectorAll('[data-close-dialog]').forEach((button) => {
	button.addEventListener('click', () => button.closest('dialog').close());
});
document.querySelectorAll('input[name="theme-setting"]').forEach((input) => {
	input.addEventListener('change', () => {
		currentSettings.theme = input.value;
		applyTheme();
	});
});
darkModeInput.addEventListener('change', () => {
	currentSettings.mode = darkModeInput.checked ? 'dark' : 'light';
	applyTheme();
	saveSettings();
});

void loadSettings();
void loadLibrary();
void loadAppInfo().then(() => checkForUpdates(true));
void refreshSystemMetrics();
void refreshAHKStatus();
window.setInterval(refreshSystemMetrics, 5000);
window.setInterval(refreshAHKStatus, 1500);
window.runtime?.EventsOn?.('library:changed', () => {
	void loadLibrary();
	void refreshAHKStatus();
});
