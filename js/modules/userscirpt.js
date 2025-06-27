import { AppStorage } from "./utils/storage.js";

export class UserscriptManager {
    constructor(app, settingsManager) {
        this.app = app;
        this.settingsManager = settingsManager;
    }

    init() {
        if (!this.settingsManager.hasItem("debug.userscript")) return;
        
        let script = this.settingsManager.getItem("debug.userscript");
        this._loadUserScript(script);
    }

    async _loadUserScript(script) {
        const blob = new Blob([script], { type: 'application/javascript' });
        let url = URL.createObjectURL(blob);

        try {
            const module = await import(url);
            if (module && typeof module.main === "function") {
                module.main(this.app);
            } else {
                console.error("Userscript does not export a \"main\" function");
            }
        } catch (error) {
            console.error("Error loading userscript:", error);
        }
    }
}