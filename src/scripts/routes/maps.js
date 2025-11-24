import { app } from "../index.js";
import { Helpers } from "../libs/helpers.js";

export default class Maps {
    static map;
    static markerGroup;

    static async init(parameters) {
        this.map = L.map("map").setView([0, 0], 0);
        this.markerGroup = L.layerGroup().addTo(this.map);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(this.map);

        // Use GeoLocation API
        
        
        if ("lat" in parameters && "lon" in parameters) {
            this.map.setView([
                Number(parameters.lat),
                Number(parameters.lon)
            ], 16);
        } else {
            this.map.locate({setView: true, maxZoom: 12});
        }


        document.getElementById("filterList").addEventListener("change", () => this.populateMap());

        this.populateMap();
    }

    static async populateMap() {
        if (!app.isConnected) return;

        let contacts = await app.device.getContacts();
        const nodeMarkerTemplate = document.getElementById("nodeMarkerTemplate");

        const filter = document.getElementById("filterList").value;
        contacts = this.filterContacts(contacts, filter);

        this.markerGroup.clearLayers();

        for(const contact of contacts) {
            if (contact.advLat === 0 && contact.advLon === 0) continue;

            const nodeLat = Helpers.toSigned32(contact.advLat) / 1e6;
            const nodeLon = Helpers.toSigned32(contact.advLon) / 1e6;
            const nodeMarker = nodeMarkerTemplate.content.cloneNode(true);
            const nodeTypeIcons = {
                0: "question_mark",
                1: "person",
                2: "cell_tower",
                3: "forum",
            }
            
            nodeMarker.getElementById("nodeMarkerAvatar").innerText = Helpers.getLastEmoji(contact.advName) ?? contact.advName[0];
            nodeMarker.getElementById("nodeMarkerAvatar").style.backgroundColor = (contact.type === 2) ? "rgb(var(--mdui-color-on-secondary-dark))" : Helpers.stringToColour(contact.advName);
            nodeMarker.getElementById("nodeMarkerLabel").innerText = contact.advName;
            nodeMarker.getElementById("nodeMarkerIcon").setAttribute("name", nodeTypeIcons[contact.type] ?? nodeTypeIcons[0]);
            
            const nodeIcon = L.divIcon({
                className: "node-marker",
                html: nodeMarker.firstElementChild.outerHTML,
                iconSize: [40, 40]
            });
    
            const marker = L.marker([
                nodeLat,
                nodeLon
            ], {icon: nodeIcon})

            marker.on("click", () => {
                window.location = `#maps?lat=${nodeLat}&lon=${nodeLon}`; // Add the node to history
                window.location = `#details?id=${contact.publicKey.toHex()}`;
            })
            
            marker.addTo(this.markerGroup);
        }
    }

    static filterContacts(contacts, filter) {
        // Filter Contacts
        const filterMap = {
            "pinned": -1,
            "users": 1,
            "repeaters": 2,
            "roomservers": 3
        }

        if (filter.length === 0) return [];

        for (const rule of filter) {
            contacts = contacts.filter(item => filter.some(rule => item.type === filterMap[rule]));
        }

        return contacts;
    }

    static cleanup() {
        this.map == null;
    }
}
