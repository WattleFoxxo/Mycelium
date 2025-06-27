import { Route } from "../modules/route.js";

export class SettingsRoute extends Route {
    constructor(settingsManager) {
        super("settings", "settings.html");
        this.settingsManager = settingsManager;
    }

    init() {
        this.refresh();
    }

    refresh() {
        this._cursedFunction();
        this._loadSettings();
    }

    // god forgive me for this - WattleFoxxo
    _cursedFunction() {
        const elements = document.querySelectorAll('.mdui-select-is-silly');
        elements.forEach((element) => {
            element.defaultValue = element.value;

            element.addEventListener("change", () => {
                if (element.value.length <= 0) {
                    element.value = element.defaultValue;
                    
                    setTimeout(() => {
                        Array.from(element.children).forEach((child) => {
                            if (child.value == element.value) child.setAttribute("selected", true); 
                        });
                    }, 0);

                    return false;
                }

                element.defaultValue = element.value;
            });
        });
    }

    _loadSettings() {
        const elements = document.querySelectorAll('.setting');
        elements.forEach((element) => {
            let key = element.id.substring(("settings.").length);

            element.addEventListener("change", () => {
                let value = document.getElementById(element.id).value;
                this.settingsManager.setItem(key, value);
            });

            element.addEventListener("click", () => {
                if (!this.settingsManager.settings.has(key)) return;
                this.settingsManager.settings.get(key).click();
            });

            if (!this.settingsManager.hasItem(key)) return;
            element.value = this.settingsManager.getItem(key);
        });
    }
}
