import { app } from "./index.js";

export class CustomElements {
    static init() {
        this.radioList();
        this.checkBoxList();
        this.radioOnly();
    }

    static async radioList() {
        const lists = document.querySelectorAll("mdui-list[radio-list]");

        const updateListIcons = (list) => {
            list.querySelectorAll("mdui-list-item").forEach((item) => {
                const value = item.getAttribute("value");

                item.setAttribute(
                    "icon",
                    value === list.value
                        ? "radio_button_checked"
                        : "radio_button_unchecked"
                );
            });
        }

        for (const list of lists) {
            list.value = list.getAttribute("value");

            updateListIcons(list);

            list.addEventListener("click", (event) => {
                const item = event.target.closest("mdui-list-item");
                if (!item) return;

                list.value = item.getAttribute("value");

                list.setAttribute("value", list.value);
                updateListIcons(list);

                list.dispatchEvent(new CustomEvent("change", {
                    bubbles: true
                }));
            });
        }
    }

    static async checkBoxList() {
        const lists = document.querySelectorAll("mdui-list[checbox-list]");

        const updateListIcons = (list) => {
            list.querySelectorAll("mdui-list-item").forEach((item) => {
                const value = item.getAttribute("value");

                item.setAttribute(
                    "icon",
                    list.value.includes(value)
                        ? "check_box"
                        : "check_box_outline_blank"
                );
            });
        }

        for (const list of lists) {
            list.value = list.getAttribute("value").split(",");

            updateListIcons(list);

            list.addEventListener("click", (event) => {
                const item = event.target.closest("mdui-list-item");
                if (!item) return;

                const value = item.getAttribute("value");

                if (list.value.includes(value)) {
                    list.value.splice(list.value.indexOf(value), 1);
                } else {
                    list.value.push(value);
                }

                list.setAttribute("value", list.value.join(","));
                updateListIcons(list);

                list.dispatchEvent(new CustomEvent("change", {
                    bubbles: true
                }));
            });
        }
    }

    static async radioOnly() {
        const elements = document.querySelectorAll("[radio-only]");

        for (const element of elements) {
            element.setAttribute("disabled", !app.isConnected);
        }
    }
}
