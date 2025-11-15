export class Router {
    static handleRoute(event) {
        Router.loadPage(location.hash.slice(1));
    }

    static async loadPage(route) {
        const responcse = await fetch(`/routes/${route}.html`);

        location.hash = `#${route}`;

        if (!responcse.ok) {
            if (route == "error") throw new Error("/routes/error.html is missing!", );

            Router.panic(`Fetch error: 404 Not found\nCould not fetch "/routes/${route}.html"`);
            return;
        }
        
        document.getElementById("appContent").innerHTML = await responcse.text();
        
        const routeSettings = document.querySelector("route-settings");
        
        document.getElementById("backButton").href = routeSettings.getAttribute("backbutton");
        document.getElementById("appTitle").innerText = routeSettings.getAttribute("title");

        document.getElementById("navBar").style = "";
        document.getElementById("titleBar").style = "";
        document.getElementById("backButton").style = "";

        if (routeSettings.getAttribute("navbar") == "false") document.getElementById("navBar").style = "display: none;";
        if (routeSettings.getAttribute("titlebar") == "false") document.getElementById("titleBar").style = "display: none;";
        if (routeSettings.getAttribute("backbutton") == "false") document.getElementById("backButton").style = "display: none;";

        document.getElementById("navBar").value = route;
    }

    static async panic(error) {
        try {
            await Router.loadPage("error");

            document.getElementById("errorLog").innerText = error;
        } catch (error) {
            console.log(error);
        }
    }
}

window.addEventListener("hashchange", Router.handleRoute, true);
Router.loadPage("messages");
