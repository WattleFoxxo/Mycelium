import { Route } from "./route.js";

export class Router {
    constructor() {
        this.routes = new Map();

        window.addEventListener("hashchange", (event) => this._handelHashChange());
    }

    registerRoute(route) {
        let newInfo = {
            file: route.file,
            init: () => route.init(),
            refresh: () => route.refresh(),
        }

        this.routes.set(route.route, newInfo);
    }

    refreshPage() {
        let routeInfo = this._tryGetRoute(this._getRoute());
        if (!routeInfo) return; // This should never happen

        routeInfo.refresh();
    }

    setTitle(title) {
        document.getElementById("index.titlebar.title").innerText = title;
    }

    setBackUrl(url) {
        document.getElementById("index.titlebar.back-button").href = url;
    }

    getParameters() {
        let query = window.location.hash.slice(1).split("?")[1];
        let params = new URLSearchParams(query);
        let queryParams = {};
        
        params.forEach((value, key) => queryParams[key] = value);
        
        return queryParams;
    }

    async navigateTo(route) {
        let routeInfo = this._tryGetRoute(route);
        if (!routeInfo) return this.navigateTo("nodes");

        let routeContent = await this._fetchHtmlContent(routeInfo.file);

        let container = document.getElementById("index.page-container");
        let navbar = document.getElementById("index.navbar");

        container.innerHTML = routeContent;
        navbar.value = route;

        this._setRoute(route);
        this._updateUserInterface();

        routeInfo.init();
    }

    async _fetchHtmlContent(file) {
        let response = await fetch(`routes/${file}`);

        if (!response.ok) {
            console.error("Failed to fetch HTML content.");
            return "<h2>Failed to load, try restarting or reinstalling the app.</h2>";
        }

        return await response.text();
    }

    _getRoute() {
        return window.location.hash.slice(1).split("?")[0];
    }

    _setRoute(route) {
        let hash = window.location.hash.slice(1).split("?");
        hash[0] = route;
        window.location.hash = `#${hash.join("?")}`;
    }

    _tryGetRoute(route) {
        if (this.routes.has(route))
            return this.routes.get(route);
        
        return null;
    }

    _updateUserInterface() {
        let title = document.getElementById("index.titlebar.title");
        let navbar = document.getElementById("index.navbar");
        let backButton = document.getElementById("index.titlebar.back-button");
        let pageSettings = document.getElementById("index.page-settings");

        let hasNavbar = pageSettings.hasAttribute("has-navbar");
        let hasBackButton = pageSettings.hasAttribute("has-back-button");

        navbar.style = "";
        backButton.style = "";

        if (!hasNavbar) navbar.style = "display: none;";
        if (!hasBackButton) backButton.style = "display: none;";

        backButton.href = pageSettings.getAttribute("back-button-url");
        title.innerText = pageSettings.getAttribute("page-title");
    }

    _handelHashChange() {
        this.navigateTo(this._getRoute());
    }
}
