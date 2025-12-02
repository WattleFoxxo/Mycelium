import { Helpers } from "./helpers.js";

class TimeStampElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        const span = document.createElement("span");
        this.shadowRoot.appendChild(span);
    }

    get value() {
        return Number(this.getAttribute("value") || 0);
    }

    set value(newValue) {
        this.setAttribute("value", String(newValue));
        this.updateTime();
        this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    }

    connectedCallback() {
        this.span = this.shadowRoot.querySelector("span");

        this.interval = setInterval(() => this.updateTime(), 1000);
        this.updateTime();
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }

    updateTime() {
        const time = this.getAttribute("type") === "datetime"
            ? Helpers.formatDate(this.value)
            : Helpers.timeSince(this.value);

        if (this.span.innerText === time) return;
        this.span.innerText = time;
    }
}

class RadioListElement extends HTMLElement {
    constructor() {
        super();
    }

    get value() {
        return this.getAttribute("value") || "";
    }

    set value(newValue) {
        this.setAttribute("value", newValue);
        this.updateIcons();
        
        this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    }

    connectedCallback() {
        this.updateIcons();

        this.addEventListener("click", (event) => {
            const target = event.target.closest("mdui-list-item");
            if (!target || !this.contains(target)) return;

            this.value = target.getAttribute("value");
        });
    }

    disconnectedCallback() {

    }

    updateIcons() {
        for (const child of this.children) {
            if (child.tagName.toLowerCase() !== "mdui-list-item") continue;

            const icon = child.getAttribute("value") === this.value 
                ? "radio_button_checked" 
                : "radio_button_unchecked";
            
            child.setAttribute("icon", icon);
        }
    }
}

class CheckListElement extends HTMLElement {
    constructor() {
        super();
    }

    get value() {
        return this.getAttribute("value").split(",").filter(v => v !== "");
    }

    set value(newValue) {
        this.setAttribute("value", newValue.join(","));
        this.updateIcons();

        this.dispatchEvent(new CustomEvent("change", { bubbles: true }));
    }

    connectedCallback() {
        this.updateIcons();

        this.addEventListener("click", (event) => {
            const target = event.target.closest("mdui-list-item");
            if (!target || !this.contains(target)) return;

            const value = target.getAttribute("value");
            const currentValue = this.value;

            if (currentValue.includes(value)) {
                this.value = currentValue.filter(x => x !== value);
            } else {
                this.value = [...this.value, value];
            }
        });
    }

    disconnectedCallback() {

    }

    updateIcons() {
        for (const child of this.children) {
            if (child.tagName.toLowerCase() !== "mdui-list-item") continue;

            const icon = this.value.includes(child.getAttribute("value"))
                ? "check_box" 
                : "check_box_outline_blank";
            
            child.setAttribute("icon", icon);
        }
    }
}

customElements.define("time-stamp", TimeStampElement);
customElements.define("radio-list", RadioListElement);
customElements.define("check-list", CheckListElement);
