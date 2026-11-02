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



function applyMarketDeliveryThemeElements(c, radius, borderWidth, shadowStrength, ink) {
    const paint = (selector, styles) => document.querySelectorAll(selector).forEach((element) => {
        Object.entries(styles).forEach(([property, value]) => {
            if (value !== undefined && value !== null && value !== "") element.style.setProperty(property, String(value), "important");
        });
    });
    paint(".admin-sidebar,.super-admin-sidebar,.sidebar,.dashboard-sidebar,.rider-sidebar,.restaurant-sidebar,.admin-topbar,.customer-header,.restaurant-header,.rider-header,.customer-navigation,.mobile-navigation", {
        "background-color": c.navigation, color: ink(c.navigation), "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px"
    });
    paint(".admin-content-card,.admin-stat-card,.admin-action,.dashboard-card,.stat-card,.product-card,.content-card,.panel,.card,.auth-card,.customer-card,.restaurant-card,.menu-item-card,.cart-summary,.order-card,.table-container,.modal-content,.profile-card,.address-card,.payment-card,.restaurant-item,.feature-card", {
        "background-color": c.card, color: ink(c.card), "border-color": c.border,
        "border-radius": radius + "px", "border-style": "solid", "border-width": borderWidth + "px", "box-shadow": "0 12px 32px rgba(0,0,0," + shadowStrength + ")"
    });
    paint("input,select,textarea,.form-control,.admin-period-select,.food-search,.search-box,.filter-control", {
        "background-color": c.input, color: ink(c.input), "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px"
    });
    paint(".admin-bar,.chart-bar,.chart-fill,.progress-bar", { "background-color": c.chart });
    paint(".admin-chart-grid-line,.chart-grid-line", { "border-color": c.chartGrid });
    paint('.primary-button,.auth-button,.nav-button,.promotion-button,.food-search button,.admin-btn-primary,.btn-primary,button:not(.secondary):not(.btn-secondary):not(.button-secondary):not(.danger):not(.btn-danger):not(.delete):not([class*="danger"]):not([class*="delete"]):not(.btn-outline):not(.button-outline):not(.icon-button):not(.admin-close-menu-button):not(.admin-mobile-menu-button):not(.mobile-menu-button),[type=submit]', {
        "background-color": c.primary, color: ink(c.primary), "border-color": c.primary
    });
    paint(".secondary-button,.btn-secondary,.button-secondary,button.secondary", {
        "background-color": c.secondary, color: ink(c.secondary), "border-color": c.secondary
    });
    paint(".admin-status-total,.admin-table th,.table thead th,.secondary-panel,.card-secondary,.stat-card-secondary,.order-summary,.filter-panel,.customer-promotion,.promotion-card", {
        "background-color": c.cardAlt, color: ink(c.cardAlt), "border-color": c.border
    });
    paint(".light-card,.light-panel,.product-card.light,.category-card", {
        "background-color": c.lightCard, color: ink(c.lightCard), "border-color": c.border
    });
    paint("h1,h2,h3,h4,h5,h6,.admin-nav-link,.customer-navigation a,.mobile-navigation a,.navigation a", { color: "inherit" });
    paint("p,small,.muted,.text-muted,.admin-card-header p,.admin-stat-content small,.form-help,.helper-text,.field-hint,.empty-state,label,li,td", { color: "inherit" });
    paint("a,.admin-card-link,.view-all,.password-label a,.auth-footer a,.customer-logo span,.logo span", { color: ink(c.secondary) });
    paint(".promotion,.discount,.promotion-badge,.badge-warning,.status-warning", {
        "background-color": c.promotion, color: ink(c.promotion), "border-color": c.promotion
    });
    paint(".badge-success,.status-available,.in-stock,.status-completed,.success-message", {
        "background-color": c.success, color: ink(c.success), "border-color": c.success
    });
    paint("th,.admin-table th,.table th", { "background-color": c.cardAlt, color: ink(c.cardAlt), "border-color": c.border });
    paint("td,.admin-table td,.table td,tr,.admin-table tr", { "border-color": c.border });
    paint(".admin-chart,.chart-container,.chart-card", { "background-color": c.card, color: ink(c.card), "border-color": c.border });
    paint('div[class*="card"]:not(.light-card):not(.category-card):not(.product-card.light),section[class*="card"]:not(.light-card):not(.category-card),article[class*="card"],li[class*="card"],aside[class*="card"],[class*="Panel"],[class*="tile"],[class*="Tile"],[class*="widget"],[class*="Widget"],[class*="modal"],[class*="Modal"],article', {
        "background-color": c.card, color: ink(c.card), "border-color": c.border,
        "border-style": "solid", "border-width": borderWidth + "px",
        "border-radius": radius + "px", "box-shadow": "0 12px 32px rgba(0,0,0," + shadowStrength + ")"
    });
    paint('a[class*="btn"],a[class*="button"],[role="button"]', {
        "background-color": c.primary, color: ink(c.primary), "border-color": c.border,
        "border-style": "solid", "border-width": borderWidth + "px"
    });
}

/* MARKET DELIVERY APPEARANCE SETTINGS — loaded from the shared database. */
async function applyMarketDeliveryAppearance() {
    try {
        const base = window.FOOD_DELIVERY_API_BASE || "https://market-delivery.onrender.com/api";
        const response = await fetch(base.replace(/\/+$/, "") + "/public/settings", { headers: { Accept: "application/json" }, cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json();
        const config = result?.data?.appearance;
        if (!config) return;
        const c = config.colors || {}, root = document.documentElement;
        const radius = Math.max(0, Math.min(40, Number(config.radius ?? 16)));
        const borderWidth = Math.max(0, Math.min(4, Number(config.borderWidth ?? 1.5)));
        const shadowStrength = Math.max(0, Math.min(80, Number(config.shadow ?? 24))) / 100;
        const vars = {
            "--background": c.background, "--surface": c.navigation, "--white": c.text,
            "--text": c.text, "--text-light": c.muted, "--primary": c.primary,
            "--primary-dark": c.primary, "--primary-hover": c.primary,
            "--border": c.border, "--success": c.success, "--warning": c.promotion,
            "--md-navigation": c.navigation, "--md-card": c.card, "--md-card-alt": c.cardAlt,
            "--md-input": c.input, "--md-chart": c.chart, "--md-chart-grid": c.chartGrid,
            "--md-secondary": c.secondary, "--md-promotion": c.promotion,
            "--md-light-card": c.lightCard, "--md-muted": c.muted,
            "--radius": radius + "px",
            "--shadow": "0 18px 50px rgba(0,0,0," + shadowStrength + ")"
        };
        Object.entries(vars).forEach(([key, value]) => {
            if (value) root.style.setProperty(key, value);
        });
        const luminance = (hex) => {
            if (!/^#[0-9a-f]{6}$/i.test(String(hex || ""))) return 1;
            const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
                .map((value) => value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const contrastRatio = (foreground, background) => {
            const a = luminance(foreground), b = luminance(background);
            return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        };
        const bestReadableText = (preferred, surfaces) => {
            const valid = /^#[0-9a-f]{6}$/i.test(String(preferred || ""));
            if (valid && surfaces.every((surface) => /^#[0-9a-f]{6}$/i.test(String(surface || "")) && contrastRatio(preferred, surface) >= 4.5)) return preferred;
            const candidates = ["#F4F2E9", "#102A23"];
            return candidates.sort((a, b) =>
                Math.min(...surfaces.map((surface) => contrastRatio(a, surface))) -
                Math.min(...surfaces.map((surface) => contrastRatio(b, surface)))
            ).reverse()[0];
        };
        const ink = (color) => luminance(color) > 0.42 ? "#102A23" : "#F4F2E9";
        c.textReadable = bestReadableText(c.text, [c.background, c.navigation, c.card, c.cardAlt]);
        c.mutedReadable = bestReadableText(c.muted, [c.background, c.navigation, c.card, c.cardAlt]);
        root.style.setProperty("--white", c.textReadable);
        root.style.setProperty("--text", c.textReadable);
        root.style.setProperty("--text-light", c.mutedReadable);
        root.style.setProperty("--md-border", c.border);
        root.style.setProperty("--md-border-width", borderWidth + "px");
        const paint = (selector, styles) => {
            document.querySelectorAll(selector).forEach((element) => {
                Object.entries(styles).forEach(([property, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        element.style.setProperty(property, String(value), "important");
                    }
                });
            });
        };
        root.style.colorScheme = luminance(c.background) > 0.42 ? "light" : "dark";

        // Page canvas, content regions and all primary navigation variants.
        paint("body,.admin-main,.admin-content,.dashboard-content,.main-content,.page-content,.customer-main,.restaurant-main,.rider-main,.auth-page", {
            "background-color": c.background, color: ink(c.background)
        });
        paint(".header,.customer-header,.restaurant-header,.rider-header,.admin-sidebar,.super-admin-sidebar,.sidebar,.dashboard-sidebar,.rider-sidebar,.restaurant-sidebar,.admin-topbar,.customer-navigation,.mobile-navigation", {
            "background-color": c.navigation, color: ink(c.navigation), "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px"
        });
        paint(".admin-sidebar-header,.admin-sidebar-bottom,.admin-profile,.admin-topbar-profile,.customer-footer,.footer,.restaurant-footer,.rider-footer", {
            "background-color": c.navigation, color: "inherit", "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px"
        });

        // Cards, panels, product tiles, forms, modals and summary surfaces.
        paint(".admin-content-card,.admin-stat-card,.admin-action,.admin-quick-actions-card,.dashboard-card,.stat-card,.product-card,.content-card,.panel,.card,.auth-card,.customer-card,.restaurant-card,.menu-item-card,.cart-summary,.order-card,.table-container,.modal-content,.profile-card,.address-card,.payment-card,.restaurant-item,.feature-card,.preview-component", {
            "background-color": c.card, color: ink(c.card), "border-color": c.border,
            "border-radius": radius + "px", "box-shadow": "0 12px 32px rgba(0,0,0," + shadowStrength + ")"
        });
        paint(".admin-status-total,.admin-table th,.table thead th,.secondary-panel,.card-secondary,.stat-card-secondary,.order-summary,.filter-panel,.customer-promotion,.promotion-card", {
            "background-color": c.cardAlt, color: ink(c.cardAlt), "border-color": c.border
        });
        paint(".light-card,.light-panel,.product-card.light,.category-card", {
            "background-color": c.lightCard, color: ink(c.lightCard), "border-color": c.border
        });

        // Typography and accent links, including labels that older CSS hard-coded.
        paint("h1,h2,h3,h4,h5,h6,.admin-topbar h1,.admin-page-heading h1,.admin-card-header h3,.section-heading h2,.customer-section h2,.auth-header h1,.form-group label,.admin-table td,.admin-nav-link,.customer-navigation a,.mobile-navigation a,.navigation a", {
            color: "inherit"
        });
        paint("p,small,.muted,.text-muted,.admin-card-header p,.admin-stat-content small,.section-heading p,.feature-card p,.auth-header p,.auth-footer p,.form-help,.helper-text,.field-hint,.empty-state", {
            color: "inherit"
        });
        paint("a,.admin-card-link,.view-all,.password-label a,.auth-footer a,.customer-logo span,.logo span", { color: ink(c.secondary) });
        paint(".logo span,.admin-logo span,.admin-page-header h2,.section-label,.hero-label", { color: ink(c.background) });

        // Primary, secondary, destructive and promotional controls.
        paint(".primary-button,.auth-button,.nav-button,.promotion-button,.food-search button,.admin-btn-primary,.btn-primary,.button-primary,button.primary,button:not(.secondary):not(.danger):not(.delete):not(.icon-button):not(.admin-close-menu-button):not(.admin-mobile-menu-button):not(.mobile-menu-button),[type=submit]", {
            "background-color": c.primary, color: ink(c.primary), "border-color": c.primary, "border-radius": Math.min(radius, 18) + "px"
        });
        paint(".secondary-button,.btn-secondary,.button-secondary,button.secondary,.admin-btn-secondary", {
            "background-color": c.secondary, color: ink(c.secondary), "border-color": c.secondary
        });
        paint(".admin-nav-link:hover,.admin-nav-link.active,.customer-navigation a:hover,.mobile-navigation a:hover,.navigation a:hover", {
            "background-color": c.cardAlt, color: c.primary
        });
        paint(".promotion,.discount,.promotion-badge,.badge-warning,.status-warning", {
            "background-color": c.promotion, color: ink(c.promotion), "border-color": c.promotion
        });
        paint(".badge-success,.status-available,.in-stock,.status-completed,.success-message", {
            "background-color": c.success, color: ink(c.success), "border-color": c.success
        });

        // Inputs, tables, chart surfaces, grid lines and chart marks.
        paint("input,select,textarea,.form-control,.admin-period-select,.food-search,.search-box,.filter-control", {
            "background-color": c.input, color: ink(c.input), "border-color": c.border,
            "border-radius": Math.min(radius, 14) + "px", "border-style": "solid", "border-width": borderWidth + "px"
        });
        root.style.setProperty("--md-placeholder-color", c.mutedReadable || c.muted);
        paint("table,.admin-table,.table", { color: ink(c.card), "border-color": c.border });
        paint("th,.admin-table th,.table th", { "background-color": c.cardAlt, color: ink(c.cardAlt), "border-color": c.border });
        paint("td,.admin-table td,.table td,tr,.admin-table tr", { "border-color": c.border });
        paint(".admin-bar,.chart-bar,.chart-fill,.progress-bar,.preview-bars i", { "background-color": c.chart });
        paint(".admin-chart-grid-line,.chart-grid-line,.admin-chart-grid,.chart-grid", { "border-color": c.chartGrid });
        paint(".admin-chart,.chart-container,.chart-card,.preview-chart", { "background-color": c.card, color: ink(c.card), "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px" });
        // Catch page-specific component names used across the 39 HTML pages.
        paint('div[class*="card"]:not(.light-card):not(.category-card):not(.product-card.light),section[class*="card"]:not(.light-card):not(.category-card),article[class*="card"],li[class*="card"],aside[class*="card"],[class*="Panel"],[class*="tile"],[class*="Tile"],[class*="summary"],[class*="Summary"],[class*="widget"],[class*="Widget"],[class*="modal"],[class*="Modal"],article', {
            "background-color": c.card, color: ink(c.card), "border-color": c.border,
            "border-style": "solid", "border-width": borderWidth + "px",
            "border-radius": radius + "px", "box-shadow": "0 12px 32px rgba(0,0,0," + shadowStrength + ")"
        });
        paint('[class*="secondary"],[class*="Secondary"],[class*="filter"],[class*="Filter"],[class*="toolbar"],[class*="Toolbar"],[class*="summary"],[class*="Summary"]', {
            "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px"
        });
        paint('button,a[class*="btn"],a[class*="button"],[role="button"]', {
            "border-color": c.border, "border-style": "solid", "border-width": borderWidth + "px"
        });
        paint('button:not(.secondary):not(.btn-secondary):not(.button-secondary):not(.danger):not(.btn-danger):not(.delete):not([class*="danger"]):not([class*="delete"]):not(.btn-outline):not(.button-outline):not(.icon-button):not(.admin-close-menu-button):not(.admin-mobile-menu-button):not(.mobile-menu-button)', {
            "background-color": c.primary, color: ink(c.primary), "border-radius": Math.min(radius, 18) + "px"
        });
        paint('button.secondary,button.btn-secondary,button.button-secondary,.secondary-button,.btn-secondary,.button-secondary', {
            "background-color": c.secondary, color: ink(c.secondary)
        });
        paint('a[class*="btn"],a[class*="button"],[role="button"]', {
            "background-color": c.primary, color: ink(c.primary), "border-color": c.border,
            "border-style": "solid", "border-width": borderWidth + "px"
        });
        paint('body,main,section,article,aside,header,footer,nav,div', { "border-color": c.border });

        paint(".admin-stat-icon,.feature-icon,.icon-tile", { "background-color": c.cardAlt, color: c.secondary });

        // Apply the same surface treatment to elements inserted after initial page load.
        if (!window.__marketDeliveryThemeObserver && document.body && window.MutationObserver) {
            let queued = false;
            window.__marketDeliveryThemeObserver = new MutationObserver(() => {
                if (queued) return;
                queued = true;
                Promise.resolve().then(() => {
                    queued = false;
                    applyMarketDeliveryThemeElements(c, radius, borderWidth, shadowStrength, ink);
                });
            });
            window.__marketDeliveryThemeObserver.observe(document.body, { childList: true, subtree: true });
        }
        applyMarketDeliveryThemeElements(c, radius, borderWidth, shadowStrength, ink);
        const hero=document.querySelector(".hero");
        if(hero){const image=config.heroImage||"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85";const overlay=Math.max(0,Math.min(95,Number(config.heroOverlay??82)))/100;hero.style.backgroundImage="linear-gradient(90deg,rgba(5,5,5,"+overlay+") 0%,rgba(5,5,5,.2) 100%),url('"+image.replace(/['"\\\\]/g,"")+"')";const h=hero.querySelector("h1"),p=hero.querySelector("p"),buttons=hero.querySelectorAll(".hero-actions a");if(h&&config.heroTitle){h.textContent=config.heroTitle;h.style.color=config.heroText||c.text||""}if(p&&config.heroSubtitle)p.textContent=config.heroSubtitle;if(buttons[0]&&config.heroPrimary)buttons[0].textContent=config.heroPrimary;if(buttons[1]&&config.heroSecondary)buttons[1].textContent=config.heroSecondary}
    } catch(error){console.warn("Market Delivery appearance settings could not be loaded.",error)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",applyMarketDeliveryAppearance,{once:true});else applyMarketDeliveryAppearance();
})();
