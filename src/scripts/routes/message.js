import { app } from "../index.js";
import { Helpers } from "../libs/helpers.js";

export default class Contacts {
    static async init(parameters) {
        console.log(parameters);

        const publicKey = Uint8Array.fromHex(parameters.id);
        const contact = await app.device.findContactByPublicKeyPrefix(publicKey);
        const messages = await app.db.getByIndex("messages", "publicKey", contact.publicKey);

        console.log(messages);

        if (!messages) return;

        const messageTemplate = document.getElementById("messageTemplate");
        const messageList = document.getElementById("messageList");

        messageList.classList.remove("hidden");
        document.getElementById("emptyMessage").classList.add("hidden");
        
        const newItems = [];
        for(const message of messages) {
            const messageItem = messageTemplate.content.cloneNode(true);
            const sentTime = new Date(message.timestamp);

            messageItem.getElementById("contactAvatar").innerText = Helpers.getLastEmoji(contact.advName) ?? contact.advName[0];
            messageItem.getElementById("contactAvatar").style.backgroundColor = (contact.type === 2) ? "rgb(var(--mdui-color-on-secondary-dark))" : Helpers.stringToColour(contact.advName);
            messageItem.getElementById("contactName").innerText = contact.advName;
            messageItem.getElementById("messageTimeStamp").innerText = sentTime.toLocaleString();
            messageItem.getElementById("messageContent").innerText = message.message.text;

            newItems.push(messageItem);
        }

        messageList.replaceChildren(...newItems);
    }

    static cleanup() {

    }
}
