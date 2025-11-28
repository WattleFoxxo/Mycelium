import { CustomElements } from "./customElements.js";

export class Router {
    static homeLocation;
    static basePath;

    static init(homeLocation) {
        this.homeLocation = homeLocation
        this.basePath = window.location.pathname;

        window.addEventListener("hashchange", () => Router.handleRoute(), true);
        this.handleRoute();
    }

    static handleRoute() {
        const hash = location.hash.slice(1);
        const [route, queryString] = hash.split("?");
        const params = this.parseQuery(queryString);

        this.loadPage(route, params);
    }

    static navagateTo(route, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        location.hash = `#${route}${queryString ? "?" + queryString : ""}`;

        this.handleRoute();
    }

    static parseQuery(queryString) {
        if (!queryString) return {};
        return Object.fromEntries(new URLSearchParams(queryString));
    }

    static async loadPage(route, params = {}) {
        if (this.currentRouteModule?.cleanup) {
            this.currentRouteModule.cleanup();
        }

        const responcse = await fetch(`${this.basePath}routes/${route}.html`);
        if (!responcse.ok) {
            if (route == "error") throw new Error("/routes/error.html is missing!", );
            this.panic(`Fetch error: 404 Not found\nCould not fetch "/routes/${route}.html"`);
            return;
        }

        const htmlString = await responcse.text();
        const appContent = document.getElementById("appContent");
        appContent.innerHTML = htmlString;
        
        // Apply route settings
        const routeSettings = document.querySelector("route-settings");
        
        if (routeSettings) {
            const backButton = document.getElementById("backButton");
            const navBar = document.getElementById("navBar");
            const titleBar = document.getElementById("titleBar");

            this.setTitle(routeSettings.getAttribute("title") || "");

            if (navBar) navBar.style = routeSettings.getAttribute("navbar") === "false" ? "display: none;" : "";
            if (titleBar) titleBar.style = routeSettings.getAttribute("titlebar") === "false" ? "display: none;" : "";
            
            if (routeSettings.getAttribute("backbutton") === "false") {
                backButton.classList.add("hidden");
            } else if (routeSettings.getAttribute("backbutton") === "true") {
                // Normal back button
                backButton.classList.remove("hidden");
                backButton.href = null;
            } else {
                // Custom back button
                backButton.classList.remove("hidden");
                backButton.href = routeSettings.getAttribute("backbutton") || homeLocation;
            }
        }

        try {
            const module = await import(`${this.basePath}scripts/routes/${route}.js`);
            this.currentPageModule = module.default;
            this.currentPageModule.init?.(params);
        } catch (error) {
            console.warn(`No JS module for ${route}`, error);
        }

        const navBar = document.getElementById("navBar");
        if (navBar) navBar.value = route;

        CustomElements.init();
    }

    static navagateBack() {
        window.history.back();
    }

    static setTitle(title) {
        document.getElementById("appTitle").innerText = title;
    }

    static async panic(log) {

        try {
            await this.loadPage("error");

            console.error(log);

            document.getElementById("errorLog").innerText = log;
        } catch (error) {
            console.error(error);
        }
    }
}

Router.init("#contacts");
