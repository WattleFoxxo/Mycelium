import { app } from "./index.js";
import { Helpers } from "./libs/helpers.js";
import { List as MDUIList } from "./libs/mdui/mdui.js";

export class CustomElements {
    static init() {
        this.updateRadioOnly();
    }

    static async updateRadioOnly() {
        const elements = document.querySelectorAll("[radio-only]");

        for (const element of elements) {
            element.setAttribute("disabled", !app.isConnected);
        }
    }
}
