import { app } from "../index.js";
import { setTheme, setColorScheme, confirm } from "../libs/mdui/mdui.js";
import { Router } from "../router.js";

export default class Settings {
    static async init(parameters) {
        this.handleConnectionChange();

        document.getElementById("connectRadio").addEventListener("click", () => this.connectDissconnectRadio());

        document.getElementById("theme").addEventListener("change", (event) => this.handleThemeChange(event.target.value));
        document.getElementById("colourScheme").addEventListener("change", (event) => this.handleColourSchemeChange(event.target.value));

        document.getElementById("theme").value = (await app.db.get("settings", "theme")).value;
        document.getElementById("colourScheme").value = (await app.db.get("settings", "scheme")).value;

        document.getElementById("deleteAllMessages").addEventListener("click", () => this.deleteAllMessages());
        document.getElementById("deleteAllData").addEventListener("click", () => this.deleteAllData());


        app.device?.on("connected", () => this.handleConnectionChange());
        app.device?.on("disconnected", () => this.handleConnectionChange());
    }

    static async connectDissconnectRadio() {
        if (app.isConnected) {
            app.disconnect();
            
            return;
        }

        app.requestSerialConnection();
    }

    static async handleConnectionChange() {
        document.getElementById("connectRadioIcon").setAttribute("name", app.isConnected ? "signal_disconnected" : "bigtop_updates");
        document.getElementById("connectRadioTitle").innerText = app.isConnected ? "Disonnect Device" : "Connect Device";
    }


    static async handleThemeChange(value) {
        await app.db.put("settings", { key: "theme", value: value });

        setTheme(value);
    }

    static async handleColourSchemeChange(value) {
        const colourSchemes = {
            "red": "#ffb3a9",
            "purple": "#f9aaff",
            "blue": "#9dc9ff",
            "green": "#77db76",
            "yellow": "#dac812"
        }

        await app.db.put("settings", { key: "scheme", value: value });
        
        setColorScheme(colourSchemes[value]);
    }

    static createRadioSelections() {
        const elements = document.querySelectorAll("mdui-select[radio]");

        for (const element of elements) {
            element.defaultValue = element.value;
            
            element.addEventListener("change", async () => {

                // Restore default if empty choice selected
                if (!element.value) {
                    element.value = element.defaultValue;
                    
                    await new Promise(resolve => requestAnimationFrame(resolve));

                    for (const child of element.children) {
                        child.toggleAttribute("selected", child.value === element.value);
                    }
                }

                element.defaultValue = element.value;
            });
        }
    }

    static deleteAllMessages() {
        confirm({
            headline: "Are you sure?",
            description: "This will delete all your messages.",
            confirmText: "Delete Everything",
            cancelText: "Cancel",
            onConfirm: async () => {
                try {
                    await app.db.clear("messages");
                } catch (error) {
                    console.warn(error);
                }
            }
        });
    }

    static deleteAllData() {
        confirm({
            headline: "Are you sure?",
            description: "This will delete everything. Data stored on your radio wont be lost.",
            confirmText: "Delete Everything",
            cancelText: "Cancel",
            onConfirm: async () => {
                try {
                    await app.db.clear("settings");
                    await app.db.clear("contacts");
                    await app.db.clear("messages");
                } catch (error) {
                    console.warn(error);
                }

                window.location.reload();
            }
        });
    }

    static cleanup() {

    }
}
