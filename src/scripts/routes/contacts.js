import { app } from "../index.js";
import { Helpers } from "../libs/helpers.js";

export default class Contacts {
    static sortByList;
    static filterList;

    static async init() {
        this.sortByList = document.getElementById("sortByList");
        this.filterList = document.getElementById("filterList");

        this.sortByList.value = (await app.db.get("settings", "contactsSort")).value;
        this.filterList.value = (await app.db.get("settings", "contactsFilter")).value;

        this.sortByList.addEventListener("change", () => this.updateList());
        this.filterList.addEventListener("change", () => this.updateList());

        await new Promise(resolve => requestAnimationFrame(resolve)); // Wait until everything is renderd

        this.updateList();
    }

    static async updateList() {
        let contacts = app.contacts;

        const contactTemplate = document.getElementById("contactTemplate");
        const contactList = document.getElementById("contactList");

        await app.db.put("settings", { key: "contactsSort", value: this.sortByList.value });
        await app.db.put("settings", { key: "contactsFilter", value: this.filterList.value });

        if (!app.isConnected) {
            document.getElementById("emptyMessage").classList.remove("hidden");
            contactList.classList.add("hidden");

            return;
        }

        contacts = this.filterContacts(contacts);

        if (contacts.length === 0) return;

        document.getElementById("emptyMessage").classList.add("hidden");
        contactList.classList.remove("hidden");

        const newItems = [];
        for(const contact of contacts) {            
            const contactItem = contactTemplate.content.cloneNode(true);
            const publicKeyHex = contact.publicKey.toHex();
            const lastHeard = new Date(Number(contact.lastAdvert) * 1e3);

            const nodeTypeIcons = {
                0: "question_mark",
                1: "person",
                2: "cell_tower",
                3: "forum",
            }
            
            contactItem.getElementById("contactAvatar").innerText = Helpers.getLastEmoji(contact.advName) ?? contact.advName[0];
            contactItem.getElementById("contactAvatar").style.backgroundColor = (contact.type === 2) ? "rgb(var(--mdui-color-on-secondary-dark))" : Helpers.stringToColour(contact.advName);
            contactItem.getElementById("contactName").innerText = contact.advName;
            contactItem.getElementById("contactSubText").innerText = `<${publicKeyHex.slice(0, 8)}...${publicKeyHex.slice(-8)}>\n${lastHeard.toLocaleString()}`;

            contactItem.getElementById("contactTypeIcon").setAttribute("name", nodeTypeIcons[contact.type] ?? nodeTypeIcons[0]);

            this.setupContactButtons(contact, contactItem);

            newItems.push(contactItem);
        }

        contactList.replaceChildren(...newItems);
    }

    static filterContacts(contacts) {
        // Filter Contacts
        const filter = this.filterList.value;
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

        // Sort Contacts
        const sortMode = this.sortByList.value;
        switch (sortMode) {
            case "name":
                contacts.sort((a, b) => a.advName.toLowerCase().localeCompare(b.advName.toLowerCase()));
                break;

            case "recent":
                contacts.sort((a, b) => Number(b.lastMod) - Number(a.lastMod));
                break;
            
            case "advert":
                contacts.sort((a, b) => Number(b.lastAdvert) - Number(a.lastAdvert));
                break;
        }

        return contacts;
    }

    static setupContactButtons(contact, contactItem) {
        const lat = Helpers.toSigned32(contact.advLat) / 1e6;
        const lon = Helpers.toSigned32(contact.advLon) / 1e6;

        contactItem.getElementById("pingButton").disabled = (contact.type !== 2 && contact.type !== 3);
        contactItem.getElementById("viewOnMapButton").disabled = (lat === 0 && lon === 0);        
        contactItem.getElementById("detailsButton").href = `#details?id=${contact.publicKey.toHex()}`;
        contactItem.getElementById("pingButton").addEventListener("click", () => app.trace([new Uint8Array(contact.publicKey)[0]]));
        contactItem.getElementById("moreButton").addEventListener("click", (event) => event.stopPropagation());

        contactItem.getElementById("listItem").addEventListener("click", (event) => {
            window.location = (contact.type === 1) ?
            `#message?id=${contact.publicKey.toHex()}`
            : `#details?id=${contact.publicKey.toHex()}`;
        });

        contactItem.getElementById("viewOnMapButton").addEventListener("click", () => {
            window.location = `#maps?lat=${lat}&lon=${lon}`;
        });
    }

    static cleanup() {

    }
}
