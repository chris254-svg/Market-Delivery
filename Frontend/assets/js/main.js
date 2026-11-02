(() => {
"use strict";
// ============================================
//                 ADMIN GLOBAL
// ============================================

const adminSidebar = document.getElementById("adminSidebar");
const adminMenuButton = document.getElementById("adminMenuButton");

const adminCloseMenuButton = document.getElementById(
    "adminCloseMenuButton",
);

if (adminSidebar && adminMenuButton) {
    adminMenuButton.addEventListener("click", () => {
        adminSidebar.classList.toggle("open");

        const isOpen =
            adminSidebar.classList.contains("open");

        adminMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen),
        );
    });
}

if (adminSidebar && adminCloseMenuButton) {
    adminCloseMenuButton.addEventListener("click", () => {
        adminSidebar.classList.remove("open");

        adminMenuButton?.setAttribute(
            "aria-expanded",
            "false",
        );
    });
}


// Close admin sidebar when clicking outside it.

document.addEventListener("click", (event) => {
    if (!adminSidebar || !adminMenuButton) {
        return;
    }

    const target = event.target;

    const clickedInsideSidebar =
        adminSidebar.contains(target);

    const clickedMenuButton =
        adminMenuButton.contains(target);

    const sidebarIsOpen =
        adminSidebar.classList.contains("open");

    if (
        sidebarIsOpen &&
        !clickedInsideSidebar &&
        !clickedMenuButton
    ) {
        adminSidebar.classList.remove("open");

        adminMenuButton.setAttribute(
            "aria-expanded",
            "false",
        );
    }
});


// Customer mobile navigation is handled by customer/mobile-navigation.js.


// ============================================
//                RIDER GLOBAL
// ============================================

const riderSidebar =
    document.getElementById("riderSidebar");

const riderMenuButton =
    document.getElementById("riderMenuButton");

if (riderMenuButton && riderSidebar) {
    riderMenuButton.addEventListener("click", () => {
        riderSidebar.classList.toggle("open");

        const isOpen =
            riderSidebar.classList.contains("open");

        riderMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen),
        );
    });

    document.addEventListener("click", (event) => {
        const target = event.target;

        const clickedInsideSidebar =
            riderSidebar.contains(target);

        const clickedMenuButton =
            riderMenuButton.contains(target);

        const sidebarIsOpen =
            riderSidebar.classList.contains("open");

        if (
            sidebarIsOpen &&
            !clickedInsideSidebar &&
            !clickedMenuButton
        ) {
            riderSidebar.classList.remove("open");

            riderMenuButton.setAttribute(
                "aria-expanded",
                "false",
            );
        }
    });
}


// ============================================
//              RESTAURANT GLOBAL
// ============================================

const restaurantSidebar =
    document.getElementById("restaurantSidebar");

const restaurantMenuButton =
    document.getElementById(
        "restaurantMenuButton",
    );

if (
    restaurantMenuButton &&
    restaurantSidebar
) {
    restaurantMenuButton.addEventListener(
        "click",
        () => {
            restaurantSidebar.classList.toggle(
                "open",
            );

            const isOpen =
                restaurantSidebar.classList.contains(
                    "open",
                );

            restaurantMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen),
            );
        },
    );

    document.addEventListener("click", (event) => {
        const target = event.target;

        const clickedInsideSidebar =
            restaurantSidebar.contains(target);

        const clickedMenuButton =
            restaurantMenuButton.contains(target);

        const sidebarIsOpen =
            restaurantSidebar.classList.contains(
                "open",
            );

        if (
            sidebarIsOpen &&
            !clickedInsideSidebar &&
            !clickedMenuButton
        ) {
            restaurantSidebar.classList.remove(
                "open",
            );

            restaurantMenuButton.setAttribute(
                "aria-expanded",
                "false",
            );
        }
    });
}

// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const api = window.FoodDeliveryAuthApi;
    document.querySelectorAll('.admin-sidebar-footer a[href="../../index.html"]').forEach((link) => {
        link.addEventListener("click", () => api?.clearSession?.());
    });
});


/* MARKET DELIVERY APPEARANCE SETTINGS — loaded from the shared database. */
async function applyMarketDeliveryAppearance() {
    try {
        const base = window.FOOD_DELIVERY_API_BASE || "https://market-delivery.onrender.com/api";
        const response = await fetch(base.replace(/\\/+$/, "") + "/public/settings", { headers: { Accept: "application/json" }, cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json();
        const config = result?.data?.appearance;
        if (!config) return;
        const c = config.colors || {}, root = document.documentElement;
        const vars = {"--background":c.background,"--surface":c.navigation,"--white":c.text,"--text":c.text,"--text-light":c.muted,"--primary":c.primary,"--primary-hover":c.primary,"--border":c.border,"--success":c.success,"--warning":c.promotion,"--md-navigation":c.navigation,"--md-card":c.card,"--md-card-alt":c.cardAlt,"--md-input":c.input,"--md-chart":c.chart,"--md-chart-grid":c.chartGrid,"--radius":Number(config.radius??16)+"px","--shadow":"0 18px 50px rgba(0,0,0,"+(Number(config.shadow??24)/100)+")"};
        Object.entries(vars).forEach(([k,v])=>{if(v)root.style.setProperty(k,v)});
        document.querySelectorAll(".admin-sidebar,.admin-topbar,.admin-content-card,.admin-stat-card,.admin-action,.dashboard-card,.stat-card,.product-card,.content-card,.panel").forEach(el=>{if(c.navigation)el.style.setProperty("background-color",c.navigation,"important");if(c.text)el.style.setProperty("color",c.text,"important");if(c.border)el.style.setProperty("border-color",c.border,"important");if(config.radius!==undefined)el.style.setProperty("border-radius",Number(config.radius)+"px")});
        document.querySelectorAll("input,select,textarea").forEach(el=>{if(c.input)el.style.setProperty("background-color",c.input,"important");if(c.text)el.style.setProperty("color",c.text,"important")});
        document.querySelectorAll(".admin-bar,.chart-bar,.chart-fill").forEach(el=>{if(c.chart)el.style.setProperty("background-color",c.chart,"important")});
        document.querySelectorAll(".admin-chart-grid-line,.chart-grid-line").forEach(el=>{if(c.chartGrid)el.style.setProperty("border-color",c.chartGrid,"important")});
        const hero=document.querySelector(".hero");
        if(hero){const image=config.heroImage||"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85";const overlay=Math.max(0,Math.min(95,Number(config.heroOverlay??82)))/100;hero.style.backgroundImage="linear-gradient(90deg,rgba(5,5,5,"+overlay+") 0%,rgba(5,5,5,.2) 100%),url('"+image.replace(/['"\\\\]/g,"")+"')";const h=hero.querySelector("h1"),p=hero.querySelector("p"),buttons=hero.querySelectorAll(".hero-actions a");if(h&&config.heroTitle){h.textContent=config.heroTitle;h.style.color=config.heroText||c.text||""}if(p&&config.heroSubtitle)p.textContent=config.heroSubtitle;if(buttons[0]&&config.heroPrimary)buttons[0].textContent=config.heroPrimary;if(buttons[1]&&config.heroSecondary)buttons[1].textContent=config.heroSecondary}
    } catch(error){console.warn("Market Delivery appearance settings could not be loaded.",error)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",applyMarketDeliveryAppearance,{once:true});else applyMarketDeliveryAppearance();
})();
