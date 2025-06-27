// import { MeshDevice } from "./modules/device.js";
// import { MessageManager } from "./modules/message.js";
// import { Router } from "./modules/router.js";
// import { NotificationManager } from "./modules/notifications.js";
// import { AppStorage } from "./modules/utils/storage.js";
// import { SettingsManager, Setting } from "./modules/settings.js";
// import { DebugManager } from "./modules/debug.js";
// import { UserscriptManager } from "./modules/userscirpt.js";

// import { NodesRoute } from "./routes/nodes.js";
// import { ChannelsRoute } from "./routes/channels.js";
// import { MessageRoute } from "./routes/message.js";
// import { MapsRoute } from "./routes/maps.js";
// import { SettingsRoute } from "./routes/settings.js";
// import { DebugRoute } from "./routes/settings/debug.js";

// import { ThemeSetting } from "./modules/settings/mduiSettings.js";
// import { ColourThemeSetting } from "./modules/settings/mduiSettings.js";
// import { AboutSetting, DebugSetting } from "./modules/settings/otherSettings.js";
// import { RadioConnectSetting } from "./modules/settings/radioConnectSetting.js";

// let meshDevice = new MeshDevice();
// let messageManager = new MessageManager(meshDevice);
// let pageRouter = new Router();
// let notificationManager = new NotificationManager(meshDevice);
// let settingsManager = new SettingsManager("settings");
// let debugManager = new DebugManager();

// let userscriptManager = new UserscriptManager({ // LOAD USERSCRIPTS LAST!
//     "meshDevice": meshDevice,
//     "messageManager": messageManager,
//     "pageRouter": pageRouter,
//     "notificationManager": notificationManager,
//     "settingsManager": settingsManager
// }, settingsManager);

// debugManager.init();
// meshDevice.init();

// pageRouter.registerRoute(new NodesRoute(meshDevice));
// pageRouter.registerRoute(new ChannelsRoute(meshDevice));
// pageRouter.registerRoute(new MapsRoute(meshDevice, pageRouter));
// pageRouter.registerRoute(new MessageRoute(meshDevice, pageRouter, messageManager));
// pageRouter.registerRoute(new SettingsRoute(settingsManager));
// pageRouter.registerRoute(new DebugRoute(settingsManager, userscriptManager));

// settingsManager.registerSetting(new ThemeSetting());
// settingsManager.registerSetting(new ColourThemeSetting());
// settingsManager.registerSetting(new AboutSetting());
// settingsManager.registerSetting(new DebugSetting());
// settingsManager.registerSetting(new RadioConnectSetting(meshDevice, settingsManager));

// document.getElementById("index.quick-menu.refresh").addEventListener("click", () => pageRouter.refreshPage());

// settingsManager.init();
// pageRouter.navigateTo("messages");

// notificationManager.requestPermission();

// let hasHost = settingsManager.hasItem("device.hostname");
// let hasTLS = settingsManager.hasItem("device.tls");
// if (hasHost && hasTLS) {
//     let hostname = settingsManager.getItem("device.hostname");
//     let tls = settingsManager.getItem("device.tls");
//     meshDevice.connectHttp(hostname, 3000, false, tls);
// }

// userscriptManager.init()

// if ("serviceWorker" in navigator) {
//     await navigator.serviceWorker.register("service-worker.js", {
//         type: "module",
//     });
// }

import { RadioManager, Radio, ConnectionType, DefaultConnectionSettings } from "./radio.js";
import { Logging } from "./utilities/logging.js";

class Main {
    constructor() {
        this.radioManager = new RadioManager();
    }
    
    start() {
        this.connectMenuItems();
    }

    connectMenuItems() {
        document.getElementById("index.quick-menu.connect").addEventListener("click", async () => {
            const radio = new Radio(ConnectionType.SERIAL, DefaultConnectionSettings.SERIAL);

            this.radioManager.addRadio(radio);
        });
    }
}

const main = new Main();
main.start();
