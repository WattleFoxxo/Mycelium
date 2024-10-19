import { Setting } from "../settings.js";

export class RadioConnectSetting extends Setting {
    constructor(device, settingsManager) {
        super("radio.connect", null);

        this.device = device;
        this.settingsManager = settingsManager;
    }

    click() {
        mdui.dialog({
            headline: "Connect to device",
            body: `
            <span>Select connection type<span><br><br>
            <mdui-radio-group id="connect_dialog_selection" value="http">
                <mdui-radio value="http">HTTP</mdui-radio><br>
                <mdui-radio ${navigator.bluetooth ? "" : "disabled"} value="bluetooth">Bluetooth</mdui-radio><br>
                <mdui-radio ${navigator.serial ? "" : "disabled"} value="serial">Serial</mdui-radio>
            </mdui-radio-group>
            `,
            id: "mdui-connect-to-device",
            actions: [
                {
                    text: "Cancel",
                },
                {
                    text: "Ok",
                    onClick: async () => {
                        switch (document.getElementById("connect_dialog_selection").value) {
                            case "http":
                                this._promptHttp();
                                break;
                            case "bluetooth":
                                await this.device.connectBluetooth();
                                this._waitUntillSynced();
                                break;
                            case "serial":
                                await this.device.connectSerial();
                                this._waitUntillSynced();
                                break;
                        }
                    },
                }
            ]
        });
    }

    _promptHttp() {
        let isSecure = (location.protocol === "https:");
        let savedHostname = "meshtastic.local";

        if (this.settingsManager.hasItem("device.hostname")) {
            savedHostname = this.settingsManager.getItem("device.hostname");
        }

        if (this.settingsManager.hasItem("device.tls")) {
            isSecure = (this.settingsManager.getItem("device.tls") === "true");
        }

        mdui.dialog({
            headline: "Connect to HTTP device",
            body: `
            <span>Enter the Hostname of the Device.<span><br><br>
            <mdui-text-field id="address_box" variant="outlined" label="Hostname" value="${savedHostname}"></mdui-text-field><br><br>
            <mdui-checkbox id="tls_checkbox" ${isSecure ? "checked" : ""}>TLS</mdui-checkbox><br>
            <span id="tls_warning" style="color: rgb(var(--mdui-color-error));" hidden>Disabling TLS while using a secure context might cause issues if your node doesn't have TLS enabled. <a href="https://github.com/WattleFoxxo/SlippyApp/blob/main/README.md">more info</a>.</span>
            `,
            actions: [
                {
                    text: "Cancel",
                },
                {
                    text: "Connect",
                    onClick: async () => {
                        let hostname = document.getElementById("address_box").value;
                        let tls = document.getElementById("tls_checkbox").checked;

                        this.settingsManager.setItem("device.hostname", hostname);
                        this.settingsManager.setItem("device.tls", tls);
                        await this.device.connectHttp(hostname, 3000, false, tls);

                        this._waitUntillSynced();
                    },
                }
            ]
        });

        let checkbox = document.getElementById("tls_checkbox");
        let warning = document.getElementById("tls_warning");

        checkbox.addEventListener("click", () => {
            warning.hidden = !(isSecure && checkbox.checked);
        });
    };
    
    _waitUntillSynced() {
        let connectingProgress;
        let syncingProgress;

        connectingProgress = mdui.dialog({
            headline: "Connecting",
            body: `<mdui-button loading variant="text" style="color: rgb(var(--mdui-color-on-surface));" full-width>Connecting to device.</mdui-button>`,
        });

        this.device.events.addEventListener("onStatus", (status) => {
            if (status == Meshtastic.Types.DeviceStatusEnum.DeviceConnected) {
                    console.log("checking device connection");
                    
                    if (connectingProgress.open == false) return;
                    
                    console.log("device not connected");
                    connectingProgress.open = false;
                    syncingProgress.open = false;


            }
        });
    };
}
