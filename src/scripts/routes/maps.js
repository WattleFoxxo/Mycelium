import { app } from "../index.js";
import { Helpers } from "../libs/helpers.js";

export default class Maps {
    static async init() {
        this.map = L.map("map").setView([-35.28346, 149.12807], 10);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(this.map);

        const contacts = await app.device.getContacts();
        const nodeMarkerTemplate = document.getElementById("nodeMarkerTemplate");

        for(const contact of contacts) {
            if (contact.advLat === 0 && contact.advLon === 0) continue;

            const nodeMarker = nodeMarkerTemplate.content.cloneNode(true);
            const nodeTypeIcons = {
                0: "question_mark",
                1: "person",
                2: "cell_tower",
                3: "forum",
            }
            
            nodeMarker.getElementById("nodeMarkerAvatar").innerText = Helpers.getLastEmoji(contact.advName) ?? contact.advName[0];
            nodeMarker.getElementById("nodeMarkerAvatar").style = `background-color: ${Helpers.stringToColour(contact.advName)};`;
            nodeMarker.getElementById("nodeMarkerLabel").innerText = contact.advName;
            nodeMarker.getElementById("nodeMarkerIcon").setAttribute("name", nodeTypeIcons[contact.type] ?? nodeTypeIcons[0]);
            
            let nodeIcon = L.divIcon({
                className: "node-marker",
                html: nodeMarker.firstElementChild.outerHTML,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20],
            });

            console.log(contact);
    
            let marker = L.marker([
                Helpers.toSigned32(contact.advLat) / 1e6,
                Helpers.toSigned32(contact.advLon) / 1e6
            ], {icon: nodeIcon}).addTo(this.map);
        }
    }

    static cleanup() {
        this.map == null;
    }
}


function intToFloat(intVal) {
    const buffer = new ArrayBuffer(4); // 32-bit float
    const view = new DataView(buffer);
    view.setUint32(0, intVal);
    return view.getFloat32(0);
}