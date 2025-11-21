import { app } from "../index.js";
import { Helpers } from "../libs/helpers.js";

export default class Messages {
    static async init() {
        const contacts = await app.device.getContacts();
        const contactTemplate = document.getElementById("contactTemplate");
        const contactList = document.getElementById("contactList");

        contacts.sort((a, b) => Number(b.lastAdvert) - Number(a.lastAdvert));

        for(const contact of contacts) {
            console.log(`Contact: ${contact.advName}`);
            
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
            contactItem.getElementById("contactAvatar").style = `background-color: ${Helpers.stringToColour(contact.advName)};`;
            contactItem.getElementById("contactName").innerText = contact.advName;
            contactItem.getElementById("contactSubText").innerText = `<${publicKeyHex.slice(0, 8)}...${publicKeyHex.slice(-8)}>\n${lastHeard.toLocaleString()}`;contact.advName;

            contactItem.getElementById("contactTypeIcon").setAttribute("name", nodeTypeIcons[contact.type] ?? nodeTypeIcons[0]);

            contactList.appendChild(contactItem);
        }
    }

    static cleanup() {

    }
}
