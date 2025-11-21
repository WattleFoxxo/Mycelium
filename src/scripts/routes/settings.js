import { app } from "../index.js";
import { setTheme, setColorScheme } from "../libs/mdui/mdui.js";

export default class Settings {
    static init() {
        this.createRadioSelections();

        document.getElementById("connectRadio").addEventListener("click", () => app.requestSerialConnection());
        document.getElementById("themeRadio").addEventListener("change", (event) => this.handleThemeChange(event.target.value));
        document.getElementById("colourScheme").addEventListener("change", (event) => this.handleColourSchemeChange(event.target.value));

        document.getElementById("themeRadio").value = app.theme ?? document.getElementById("themeRadio").value; // HACK
        document.getElementById("colourScheme").value = app.colourScheme ?? document.getElementById("colourScheme").value; // HACK
    }

    static handleThemeChange(value) {
        app.theme = value; // HACK
        setTheme(value);
    }

    static handleColourSchemeChange(value) {
        const colourSchemes = {
            "red": "#ffb3a9",
            "purple": "#f9aaff",
            "blue": "#9dc9ff",
            "green": "#77db76",
            "yellow": "#dac812"
        }

        app.colourScheme = value; // HACK
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
