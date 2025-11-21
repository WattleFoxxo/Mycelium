import { setColorScheme, setTheme } from "./libs/mdui/mdui.js";
import { WebBleConnection, WebSerialConnection, Constants } from "./libs/meshcore/index.js";
import { Router } from "./router.js";
import { Helpers } from "./libs/helpers.js";

setTheme("auto"); // HACK
setColorScheme("#9dc9ff"); // HACK

class App {
    constructor() {
        // document.getElementById("connectButton").addEventListener("click", () => this.requestSerialConnection());
        document.getElementById("refreshButton").addEventListener("click", () => Router.handleRoute());
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
        // document.getElementById("radioIndercatorIcon").name = "signal_disconnected";
        document.getElementById("radioIndercatorName").innerText = "Disconnected";
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").setAttribute("disabled", "true");
    }
}

export const app = new App();
