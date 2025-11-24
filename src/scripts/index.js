import { setColorScheme, setTheme, snackbar } from "./libs/mdui/mdui.js";
import { WebSerialConnection } from "./libs/meshcore/index.js";
import { Router } from "./router.js";
import { SimpleDB } from "./storage.js";
import { CustomElements } from "./customElements.js";

class App {
    device = null;
    info = null;

    contacts = null;
    channels = null;
    messages = {};

    isConnected = false;

    constructor() {
        document.getElementById("backButton").addEventListener("click", () => {
            if (document.getElementById("backButton").href) return;

            Router.navagateBack();
        });

        document.getElementById("refreshButton").addEventListener("click", () => Router.handleRoute());
        document.getElementById("advertZeroHopButton").addEventListener("click", () => this.device?.sendZeroHopAdvert());
        document.getElementById("advertFloodButton").addEventListener("click", () => this.device?.sendFloodAdvert());
        document.getElementById("advertClipboardButton").addEventListener("click", () => {});

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
            this.device = null;

            document.getElementById("radioIndercator").removeAttribute("loading");
        }
    }

    async disconnect() {
        this.device.close();
        this.device.emit("disconnected", {});;
    }

    async onConnected(method) {
        this.isConnected = true;
        this.info = await this.device.getSelfInfo();
        this.contacts = await this.device.getContacts();

        console.log(this);

        // document.getElementById("radioIndercatorIcon").name = method;
        document.getElementById("radioIndercatorName").innerText = `Connected`;
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").removeAttribute("disabled");
        
        Router.handleRoute();
        CustomElements.radioOnly();
    }

    async onDisconnected() {
        this.isConnected = false;
        this.device = null;

        // const elements = document.querySelectorAll("[radio-only]");
        // const isConnected = !!this.device;
        // for (const element of elements) {
        //     elements.setAttribute("disabled", isConnected.toString());
        // }

        // document.getElementById("radioIndercatorIcon").name = "signal_disconnected";
        document.getElementById("radioIndercatorName").innerText = "Disconnected";
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").setAttribute("disabled", "true");

        CustomElements.radioOnly();
    }

    async trace(path) {
        snackbar({
            message: `Sent ping`,
            autoCloseDelay: 1000,
            closeOnOutsideClick: true
        });

        const start = performance.now();

        try {
            const result = await this.device?.tracePath(path);
            const latency = Math.round(performance.now() - start);

            const hexString = new Uint8Array(result.pathHashes).toHex();
            const resultPath = (hexString.match(/.{1,2}/g) || []).map(x => `(${x})`);

            snackbar({
                message: `Ping Successful: (${latency}ms) You (${new Uint8Array([app.info.publicKey[0]]).toHex()}) -> ${resultPath.join(" -> ")} -> You (${new Uint8Array([app.info.publicKey[0]]).toHex()})`,
                closeOnOutsideClick: true
            });
        } catch (e) {
            snackbar({
                message: `Ping Failed: Timeout`,
                closeOnOutsideClick: true
            });
        }
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