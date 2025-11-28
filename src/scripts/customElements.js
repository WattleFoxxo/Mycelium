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

            Object.defineProperty(list, "value", {
                get() {
                    return this._value;
                },
                set(value) {
                    this._value = value;
                    this.setAttribute("value", value);
                    updateListIcons(this);

                    this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
                }
            });

            updateListIcons(list);

            list.addEventListener("click", (event) => {
                const item = event.target.closest("mdui-list-item");
                if (!item) return;

                list.value = item.getAttribute("value");
            });
        }
    }

    static async checkBoxList() {
        const lists = document.querySelectorAll("mdui-list[checkbox-list]");

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
            list._value = list.getAttribute("value")?.split(",") || [];

            Object.defineProperty(list, "value", {
                get() {
                    return this._value;
                },
                set(value) {
                    this._value = value;
                    this.setAttribute("value", value.join(","));
                    updateListIcons(this);

                    this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
                }
            });

            updateListIcons(list);

            list.addEventListener("click", (event) => {
                const item = event.target.closest("mdui-list-item");
                if (!item) return;
                
                const value = item.getAttribute("value");

                if (list.value.includes(value)) {
                    list.value = list.value.filter(v => v !== value);
                } else {
                    list.value = [...list.value, value];
                }
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
