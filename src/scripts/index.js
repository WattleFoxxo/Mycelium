import "./libs/mdui/index.js";
import { WebBleConnection, WebSerialConnection, Constants } from "./libs/meshcore/index.js";
import { Router } from "./router.js";
import { Helpers } from "./libs/helpers.js";

class App {
    constructor() {
        document.getElementById("connectButton").addEventListener("click", () => this.requestSerialConnection());
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

        document.getElementById("radioIndercatorIcon").name = method;
        document.getElementById("radioIndercatorName").innerText = Helpers.limitText(this.info.name, 16);
        document.getElementById("radioIndercatorTooltip").content = this.info.name;
        document.getElementById("radioIndercator").removeAttribute("loading");
        document.getElementById("radioIndercator").removeAttribute("disabled");

        const contacts = await this.device.getContacts();

        console.log(contacts);

        for(const contact of contacts) {
            console.log(`Contact: ${contact.advName}`);
        }
    }

    async onDisconnected() {
        document.getElementById("radioIndercatorIcon").name = "signal_disconnected";
        document.getElementById("radioIndercatorName").innerText = "No device";
        document.getElementById("radioIndercatorTooltip").content = "No device connected";
        document.getElementById("radioIndercator").setAttribute("disabled", "true");
        document.getElementById("radioIndercator").removeAttribute("loading");
    }
}

new App();