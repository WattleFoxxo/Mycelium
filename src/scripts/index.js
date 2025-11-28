import { setColorScheme, setTheme, snackbar } from "./libs/mdui/mdui.js";
import { WebSerialConnection, Constants } from "./libs/meshcore/index.js";
import { Router } from "./router.js";
import { SimpleDB } from "./storage.js";
import { CustomElements } from "./customElements.js";

class App {
    db;

    device;
    info;
    contacts;

    isConnected = false;

    constructor() {
        this.db = new SimpleDB("appData", 1, {
            settings: {
                keyPath: "key",
                indexes: []
            },
            contacts: {
                keyPath: "publicKey",
                indexes: []
            },
            messages: {
                keyPath: "id",
                autoIncrement: true,
                indexes: [
                    { name: "publicKey", keyPath: "publicKey" }
                ]
            },
        });

        document.getElementById("backButton").addEventListener("click", () => {
            if (document.getElementById("backButton").href) return;

            Router.navagateBack();
        });

        document.getElementById("refreshButton").addEventListener("click", () => {
            if (this.isConnected) async () => this.contacts = await this.device.getContacts();

            Router.handleRoute()
        });

        document.getElementById("advertZeroHopButton").addEventListener("click", () => this.device?.sendZeroHopAdvert());
        document.getElementById("advertFloodButton").addEventListener("click", () => this.device?.sendFloodAdvert());
        document.getElementById("advertClipboardButton").addEventListener("click", () => {});

        this.setupSettings();
        this.device = null;
    }

    async setupSettings() {
        const colourSchemes = {
            "red": "#ffb3a9",
            "purple": "#f9aaff",
            "blue": "#9dc9ff",
            "green": "#77db76",
            "yellow": "#dac812"
        }
        
        // Set the defaults if needed
        if (!await this.db.has("settings", "theme")) {
            await this.db.add("settings", { key: "theme", value: "auto" });
        }

        if (!await this.db.has("settings", "scheme")) {
            await this.db.add("settings", { key: "scheme", value: "blue" });
        }

        if (!await this.db.has("settings", "contactsSort")) {
            await this.db.add("settings", { key: "contactsSort", value: "Recent" });
        }

        if (!await this.db.has("settings", "contactsFilter")) {
            await this.db.add("settings", { key: "contactsFilter", value: ["pinned", "users", "roomservers", "repeaters"] });
        }

        const theme = await this.db.get("settings", "theme");
        const scheme = await this.db.get("settings", "scheme");
        
        setTheme(theme.value);
        setColorScheme(colourSchemes[scheme.value]);
    }

    async requestSerialConnection() {
        document.getElementById("radioIndercator").setAttribute("loading", "true");

        try {
            this.device = await WebSerialConnection.open();

            this.device.on("connected", () => this.onConnected());
            this.device.on("disconnected", () => this.onDisconnected());
            this.device.on(Constants.PushCodes.MsgWaiting, () => this.handleMessage());
        } catch {
            this.device = null;

            document.getElementById("radioIndercator").removeAttribute("loading");
        }
    }

    async disconnect() {
        this.device.close();
        this.device.emit("disconnected", {});;
    }

    async onConnected() {
        this.isConnected = true;
        this.info = await this.device.getSelfInfo();
        this.contacts = await this.device.getContacts();

        console.log(this);

        document.getElementById("radioIndercatorName").innerText = `Connected`;
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").removeAttribute("disabled");
        
        Router.handleRoute();
        CustomElements.radioOnly();
    }

    async onDisconnected() {
        this.isConnected = false;
        this.device = null;

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

    async handleMessage() {
        const waitingMessages = await this.device.getWaitingMessages();

        for (const message of waitingMessages){
            console.log(message);
            
            if (message.contactMessage) {
                const contact = await this.device.findContactByPublicKeyPrefix(message.contactMessage.pubKeyPrefix);

                await this.db.add("messages", {
                    publicKey: contact.publicKey,
                    message: message.contactMessage,
                    timestamp: Date.now()
                });

            } else if (message.channelMessage) {

            }
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