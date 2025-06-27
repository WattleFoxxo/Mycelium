import { Route } from "../../modules/route.js";
import { XSSEncode } from "../../modules/utils/xss.js";

export class DebugRoute extends Route {
    constructor(settingsManager, userscriptManager) {
        super("settings.debug", "settings/debug.html");
        this.settingsManager = settingsManager;
        this.userscriptManager = userscriptManager;
        this._logsLen = 0;
    }

    init() {
        let dialog = document.getElementById("settings.debug.dialog");
        let dialogCloseButton = document.getElementById("settings.debug.dialog-close");
        let clearLogsButton = document.getElementById("settings.debug.clear-logs");
        let userscirptSaveButton = document.getElementById("settings.debug.save-userscript");
        let userscirptReloadButton = document.getElementById("settings.debug.reload-userscript");

        dialogCloseButton.addEventListener("click", () => dialog.open = false);
        clearLogsButton.addEventListener("click", () => console.logs = []);
        userscirptReloadButton.addEventListener("click", () => this.userscriptManager.init());
        userscirptSaveButton.addEventListener("click", () => {
            let userscirptBox = document.getElementById("settings.debug.userscript");
            this.settingsManager.setItem("debug.userscript", userscirptBox.value);
        });

        setInterval(this.readLogs, 100);
       
        this.refresh();
    }

    refresh() {
        let userscirptBox = document.getElementById("settings.debug.userscript");
        userscirptBox.placeholder = `eg. export function main(app) {\n    console.log("Hello, World!");\n}\n`

        if (this.settingsManager.hasItem("debug.userscript")) {
            userscirptBox.value = this.settingsManager.getItem("debug.userscript");
        }
    }

    // Dont use console.log, console.error or console.debug in this function, use console.defaultLog
    readLogs() {
        if (console.logs.length == this._logsLen) return;

        this._logsLen = console.logs.length;

        let consoleBox = document.getElementById("settings.debug.logs.list");
        let consoleScroll = document.getElementById("settings.debug.logs");
        let template = document.getElementById("settings.debug.logs.template");

        const circularReplacer = () => {
            let seen = new WeakSet();
            return (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        };

        let atBottom = ((consoleScroll.scrollHeight - consoleScroll.scrollTop) == consoleScroll.clientHeight);

        consoleBox.innerHTML = "";

        console.logs.forEach(log => {
            let newItem = template.content.cloneNode(true);
            let templateItem = newItem.getElementById("_template.item");

            log.value.forEach(value => {
                switch (typeof value) {
                    case "string":
                        templateItem.innerHTML += ansiHTML(XSSEncode(value));
                        break;             
                    default:
                        if (value instanceof Error)
                            templateItem.innerHTML += value.message;
                        else
                            templateItem.innerHTML += `<span style="display: inline; white-space: nowrap;">${XSSEncode(JSON.stringify(value, circularReplacer()))}</span>`;
                        break;
                }
                templateItem.innerHTML += `<br>`;
            });
            consoleBox.appendChild(newItem);
        });

        if (atBottom) consoleScroll.scrollTop = consoleScroll.scrollHeight;
    }
}
