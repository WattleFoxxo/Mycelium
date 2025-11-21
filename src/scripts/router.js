export class Router {
    static handleRoute() {
        Router.loadPage(location.hash.slice(1));
    }

    static navagateTo(route) {
        location.hash = `#${route}`;

        Router.handleRoute();
    }

    static async loadPage(route) {
        if (Router.currentRouteModule?.cleanup) {
            Router.currentRouteModule.cleanup();
        }

        const responcse = await fetch(`/routes/${route}.html`);

        if (!responcse.ok) {
            if (route == "error") throw new Error("/routes/error.html is missing!", );

            Router.panic(`Fetch error: 404 Not found\nCould not fetch "/routes/${route}.html"`);
            return;
        }

        const htmlString = await responcse.text();
        const appContent = document.getElementById("appContent");
        
        appContent.innerHTML = htmlString;
        
        // Apply route settings
        const routeSettings = document.querySelector("route-settings");
        
        document.getElementById("backButton").href = routeSettings.getAttribute("backbutton");
        document.getElementById("appTitle").innerText = routeSettings.getAttribute("title");

        document.getElementById("navBar").style = "";
        document.getElementById("titleBar").style = "";
        document.getElementById("backButton").style = "";

        if (routeSettings.getAttribute("navbar") == "false") document.getElementById("navBar").style = "display: none;";
        if (routeSettings.getAttribute("titlebar") == "false") document.getElementById("titleBar").style = "display: none;";
        if (routeSettings.getAttribute("backbutton") == "false") document.getElementById("backButton").style = "display: none;";
        
        try {
            const module = await import(`/scripts/routes/${route}.js`);
            
            Router.currentPageModule = module.default;
            Router.currentPageModule.init();
        } catch (error) {
            console.warn(`No JS module for ${route}`, error);
        }

        document.getElementById("navBar").value = route;
    }

    static async panic(log) {

        try {
            await Router.loadPage("error");

            console.error(log);

            document.getElementById("errorLog").innerText = log;
        } catch (error) {
            console.error(error);
        }
    }
}

window.addEventListener("hashchange", Router.handleRoute, true);
Router.navagateTo("contacts");
