import { WebBleConnection, WebSerialConnection } from "./libs/meshcore.js";
import { Enum } from "./utilities/enum.js";
import { Logging } from "./utilities/logging.js"

export const ConnectionType = new Enum({
    SERIAL: 0,
    BLUETOOTH: 1,
});

export const ConnectionStatus = new Enum({
    DISSCONNECTED: 0,
    CONNECTING: 1,
    CONNECTED: 2,
});

export const DefaultConnectionSettings = Object.freeze({
    SERIAL: {
        baud: 115200,
    },
    BLUETOOTH: {
        
    },
});

export class Radio {
    name = new String();
    uuid = new String();
    battery = new Number(); // Millivolts
    timeOffset = new Date(); // Local device time offset
    status = ConnectionStatus.DISSCONNECTED;

    _batteryIntervalId = null;

    constructor(connectionType, connectionSettings) {
        this.connectionType = connectionType;
        this.connectionSettings = connectionSettings;
        this.uuid = crypto.randomUUID();

        switch (this.connectionType) {
            case ConnectionType.SERIAL:
                this._connectSerial();
            case ConnectionType.BLUETOOTH:
                this._connectBluetooth();
        }
    }
    
    async _buildConnectors() {
        this.connection.on("connected", async () => {
            this.status = ConnectionStatus.CONNECTED;

            Logging.debug("radio connected :)");

            this.contacts = await this.connection.getContacts();
            this.channels = await this.connection.getChannels();
            this.selfInfo = await this.connection.getSelfInfo();

            this._updateBattery();

            const deviceTime = await this.connection.getDeviceTime();
            this.timeOffset = new Date(deviceTime.epochSecs * 1000) - Date.now();

            this.name = this.selfInfo.name;

            startBatteryMonitor();
        });
    }

    async _connectBluetooth() {
        Logging.NOT_IMPLEMENTED();
    }

    async _connectSerial() {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: this.connectionSettings.baud });

        this.connection = new WebSerialConnection(port);

        this._buildConnectors();

        this.status = ConnectionStatus.CONNECTING;
        await this.connection.connect();
    }

    async _updateBattery() {
        const batteryVoltage = await this.connection.getBatteryVoltage();
        this.battery = batteryVoltage.batteryMilliVolts;
    }

    startBatteryMonitor(timer=30000) {
        this._updateBattery();

        this._batteryIntervalId = setInterval(() => {
            this._updateBattery().catch(error => Logging.error("Battery monitor failed:", error));
        }, timer);
    }

    stopBatteryMonitor() {
        if (this._batteryIntervalId !== null) {
            clearInterval(this._batteryIntervalId);
            this._batteryIntervalId = null;
        }
    }
}

export class RadioManager {
    constructor() {
        this.radios = new Map();
    }

    addRadio(radio) {
        this.radios.set(radio.name, radio);
    }

    getRadio(name) {
        return this.radios.get(name);
    }

    removeRadio(name) {
        this.radios.delete(name);
    }
}