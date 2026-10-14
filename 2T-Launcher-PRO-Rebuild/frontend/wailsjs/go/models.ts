export namespace main {
	
	export class AHKStatus {
	    state: string;
	    runningCount: number;
	    pausedCount: number;
	    errorCount: number;
	    detail: string;
	
	    static createFrom(source: any = {}) {
	        return new AHKStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.state = source["state"];
	        this.runningCount = source["runningCount"];
	        this.pausedCount = source["pausedCount"];
	        this.errorCount = source["errorCount"];
	        this.detail = source["detail"];
	    }
	}
	export class AppInfo {
	    version: string;
	    author: string;
	
	    static createFrom(source: any = {}) {
	        return new AppInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.author = source["author"];
	    }
	}
	export class HistoryEntry {
	    timestamp: string;
	    user: string;
	    action: string;
	    item: string;
	
	    static createFrom(source: any = {}) {
	        return new HistoryEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.timestamp = source["timestamp"];
	        this.user = source["user"];
	        this.action = source["action"];
	        this.item = source["item"];
	    }
	}
	export class LauncherItem {
	    id: string;
	    name: string;
	    description: string;
	    category: string;
	    path: string;
	    status?: string;
	    processId?: number;
	
	    static createFrom(source: any = {}) {
	        return new LauncherItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.description = source["description"];
	        this.category = source["category"];
	        this.path = source["path"];
	        this.status = source["status"];
	        this.processId = source["processId"];
	    }
	}
	export class LibraryData {
	    items: LauncherItem[];
	    categories: string[];
	
	    static createFrom(source: any = {}) {
	        return new LibraryData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], LauncherItem);
	        this.categories = source["categories"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Settings {
	    hotkey: string;
	    theme: string;
	    mode: string;
	    scriptFolder: string;
	    ahkExePath: string;
	    categoryDisplay: string;
	    language: string;
	    categorySortingEnabled: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hotkey = source["hotkey"];
	        this.theme = source["theme"];
	        this.mode = source["mode"];
	        this.scriptFolder = source["scriptFolder"];
	        this.ahkExePath = source["ahkExePath"];
	        this.categoryDisplay = source["categoryDisplay"];
	        this.language = source["language"];
	        this.categorySortingEnabled = source["categorySortingEnabled"];
	    }
	}
	export class SystemMetrics {
	    cpuPercent: number;
	    memoryPercent: number;
	    gpuPercent: number;
	
	    static createFrom(source: any = {}) {
	        return new SystemMetrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cpuPercent = source["cpuPercent"];
	        this.memoryPercent = source["memoryPercent"];
	        this.gpuPercent = source["gpuPercent"];
	    }
	}
	export class UpdateInfo {
	    currentVersion: string;
	    latestVersion: string;
	    releaseUrl: string;
	    updateAvailable: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UpdateInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentVersion = source["currentVersion"];
	        this.latestVersion = source["latestVersion"];
	        this.releaseUrl = source["releaseUrl"];
	        this.updateAvailable = source["updateAvailable"];
	    }
	}

}

