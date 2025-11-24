import { app } from "../index.js";
import { setTheme, setColorScheme } from "../libs/mdui/mdui.js";
import { SimpleDB } from "../storage.js";

export default class Settings {
    static settingsStore;

    static async init() {
        this.settingsStore = new SimpleDB("settings");

        console.log(app);
        this.handleConnectionChange();

        document.getElementById("connectRadio").addEventListener("click", () => this.connectDissconnectRadio());

        document.getElementById("theme").addEventListener("change", (event) => this.handleThemeChange(event.target.value));
        document.getElementById("colourScheme").addEventListener("change", (event) => this.handleColourSchemeChange(event.target.value));

        document.getElementById("theme").value = await this.settingsStore.get("theme");
        document.getElementById("colourScheme").value = await this.settingsStore.get("colourScheme");

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
        await this.settingsStore.set("theme", value);
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
        
        await this.settingsStore.set("colourScheme", value);
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

    static cleanup() {

    }
}
