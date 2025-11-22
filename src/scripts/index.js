import { Dropdown, setColorScheme, setTheme } from "./libs/mdui/mdui.js";
import { WebBleConnection, WebSerialConnection, Constants } from "./libs/meshcore/index.js";
import { Router } from "./router.js";
import { Helpers } from "./libs/helpers.js";
import { SimpleDB } from "./storage.js";

class App {
    device = null;
    
    constructor() {
        // document.getElementById("connectButton").addEventListener("click", () => this.requestSerialConnection());
        document.getElementById("refreshButton").addEventListener("click", () => Router.handleRoute());

        this.setupSettings();
        this.device = null;
    }

    async setupSettings() {
        const settings = new SimpleDB("settings");
        const colourSchemes = {
            "red": "#ffb3a9",
            "purple": "#f9aaff",
            "blue": "#9dc9ff",
            "green": "#77db76",
            "yellow": "#dac812"
        }
        
        // Set the defaults if needed
        if (!await settings.has("theme")) await settings.set("theme", "auto");
        if (!await settings.has("colourScheme")) await settings.set("colourScheme", "blue");

        setTheme(await settings.get("theme"));
        setColorScheme(colourSchemes[await settings.get("colourScheme")]);
    }

    async requestSerialConnection() {
        document.getElementById("radioIndercator").setAttribute("loading", "true");

        try {
            this.device = await WebSerialConnection.open();

            this.device.on("connected", () => this.onConnected("usb"));
            this.device.on("disconnected", () => this.onDisconnected());
        } catch {
            document.getElementById("radioIndercator").removeAttribute("loading");
        }
    }

    async onConnected(method) {
        this.info = await this.device.getSelfInfo();
        console.log(this.info);
        console.log(this.device);

        // document.getElementById("radioIndercatorIcon").name = method;
        document.getElementById("radioIndercatorName").innerText = `Connected`;
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").removeAttribute("disabled");

        const contacts = await this.device.getContacts();

        console.log(contacts);

        for(const contact of contacts) {
            console.log(`Contact: ${contact.advName}`);
        }

        Router.handleRoute();
    }

    async onDisconnected() {
        this.device = null;

        // document.getElementById("radioIndercatorIcon").name = "signal_disconnected";
        document.getElementById("radioIndercatorName").innerText = "Disconnected";
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").setAttribute("disabled", "true");
    }
}

export const app = new App();

function createRadioSelections() {
    const elements = document.querySelectorAll("mdui-dropdown");

    elements.forEach(element => {
        element._lastClickedItem = null;

        element.addEventListener("pointerdown", async (event) => {
            const item = event.target.closest("mdui-menu-item:not([submenu])");            
            element.stayOpenOnClick = !item;
        });
    });
}

createRadioSelections();