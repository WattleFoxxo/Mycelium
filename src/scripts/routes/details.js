import { app } from "../index.js";
import { SimpleDB } from "../storage.js";
import { Helpers } from "../libs/helpers.js";

export default class Details {
    static async init(parameters) {
        console.log(parameters);

        const publicKey = Uint8Array.fromHex(parameters.id);
        const contact = await app.device.findContactByPublicKeyPrefix(publicKey);

        if (!contact) return;

        document.getElementById("failedMessage").classList.add("hidden");
        document.getElementById("contactInfo").classList.remove("hidden");

        const publicKeyHex = contact.publicKey.toHex();
        const lastHeard = new Date(Number(contact.lastAdvert) * 1e3);
        const lat = Helpers.toSigned32(contact.advLat) / 1e6;
        const lon = Helpers.toSigned32(contact.advLon) / 1e6;

        const nodeTypeIcons = {
            0: "question_mark",
            1: "person",
            2: "cell_tower",
            3: "forum",
        }

        const nodeTypeNames = {
            0: "Unknown",
            1: "Compainion",
            2: "Repeater",
            3: "Room Server",
        }

        document.getElementById("contactAvatar").innerText = Helpers.getLastEmoji(contact.advName) ?? contact.advName[0];
        document.getElementById("contactAvatar").style.backgroundColor = (contact.type === 2) ? "rgb(var(--mdui-color-on-secondary-dark))" : Helpers.stringToColour(contact.advName);
        
        document.getElementById("contactName").innerText = contact.advName;
        document.getElementById("publicKeyText").innerText = `<${publicKeyHex.slice(0, 8)}...${publicKeyHex.slice(-8)}>`;

        document.getElementById("lastHeardFeild").innerText = lastHeard.toLocaleString();
        document.getElementById("positionFeild").innerText = (lat === 0 && lon === 0) ? "Unknown" : `${lat}, ${lon}`;
        document.getElementById("typeFeild").innerText = nodeTypeNames[contact.type] ?? nodeTypeNames[0];
        document.getElementById("radioTypeIcon").setAttribute("name", nodeTypeIcons[contact.type] ?? nodeTypeIcons[0]);

        document.getElementById("pingButton").disabled = (contact.type !== 2 && contact.type !== 3);
        document.getElementById("pingButton").addEventListener("click", () => app.trace([new Uint8Array(contact.publicKey)[0]]));

        document.getElementById("viewOnMapButton").disabled = (lat === 0 && lon === 0);
        document.getElementById("viewOnMapButton").addEventListener("click", () => {
            window.location = `#maps?lat=${lat}&lon=${lon}`;
        },);
    }

    static cleanup() {

    }
}
