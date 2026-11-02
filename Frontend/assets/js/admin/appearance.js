(function () {
  "use strict";

  const API = window.FoodDeliveryAuthApi;
  const $ = (id) => document.getElementById(id);
  const DEFAULTS = {
    colors: {
      background: "#050505", navigation: "#102A23", card: "#102A23",
      cardAlt: "#465B32", input: "#242824", text: "#F4F2E9",
      muted: "#789B75", primary: "#D9F56B", secondary: "#789B75",
      success: "#B9E8C5", promotion: "#F2C94C", lightCard: "#F5F3DC",
      border: "#465B32", chart: "#D9F56B", chartGrid: "#789B75"
    },
    radius: 16, shadow: 24, chartType: "bar",
    chartLabels: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    chartValues: "35,62,48,80,55,92,70",
    heroTitle: "Freshness, delivered to your doorstep.",
    heroSubtitle: "Shop fresh groceries and everyday essentials, then get them delivered straight to your doorstep.",
    heroImage: "", heroPrimary: "Shop Now", heroSecondary: "Get Started",
    heroOverlay: 82, heroText: "#F4F2E9"
  };
  const COLOR_LABELS = {
    background: "Page background", navigation: "Navigation", card: "Main cards",
    cardAlt: "Secondary panels", input: "Input fields", text: "Main text",
    muted: "Muted text", primary: "Primary buttons", secondary: "Secondary accents",
    success: "Success status", promotion: "Promotions", lightCard: "Light cards",
    border: "Borders", chart: "Chart bars", chartGrid: "Chart grid"
  };
  let config = cloneDefaults();
  let canPublish = false;

  function cloneDefaults() {
    return { ...DEFAULTS, colors: { ...DEFAULTS.colors } };
  }
  function notify(message, isError) {
    const notice = $("notice");
    if (!notice) return;
    notice.textContent = message;
    notice.style.color = isError ? "#ff9b9b" : "";
  }
  function mountColorInputs() {
    const container = $("swatches");
    if (!container) throw new Error("The theme colour editor could not be found.");
    container.replaceChildren();
    Object.entries(COLOR_LABELS).forEach(([key, label]) => {
      const wrap = document.createElement("label");
      wrap.className = "studio-swatch";
      const input = document.createElement("input");
      input.type = "color";
      input.value = config.colors[key];
      input.dataset.color = key;
      input.setAttribute("aria-label", label);
      const caption = document.createElement("span");
      caption.textContent = label;
      wrap.append(input, caption);
      container.append(wrap);
    });
  }
  function readForm() {
    document.querySelectorAll("[data-color]").forEach((input) => {
      config.colors[input.dataset.color] = input.value;
    });
    const chartGrid = $("chartGrid");
    if (chartGrid) config.colors.chartGrid = chartGrid.value;
    ["radius", "shadow", "heroOverlay"].forEach((id) => {
      const el = $(id);
      if (el) config[id] = Number(el.value);
    });
    ["chartType", "chartLabels", "chartValues", "heroTitle", "heroSubtitle",
      "heroImage", "heroPrimary", "heroSecondary", "heroText"].forEach((id) => {
      const el = $(id);
      if (el) config[id] = el.value;
    });
  }
  function fillForm() {
    Object.entries(config.colors).forEach(([key, value]) => {
      const el = document.querySelector('[data-color="' + key + '"]');
      if (el) el.value = value;
    });
    const chartGrid = $("chartGrid");
    if (chartGrid) chartGrid.value = config.colors.chartGrid;
    ["radius", "shadow", "heroOverlay", "chartType", "chartLabels", "chartValues",
      "heroTitle", "heroSubtitle", "heroImage", "heroPrimary", "heroSecondary", "heroText"]
      .forEach((id) => { if ($(id)) $(id).value = config[id]; });
  }
  function paintPreview() {
    const root = document.documentElement;
    const c = config.colors;
    const setVar = (name, value) => root.style.setProperty(name, value);
    setVar("--studio-bg", c.background);
    setVar("--studio-panel", c.navigation);
    setVar("--studio-card", c.card);
    setVar("--studio-text", c.text);
    setVar("--studio-muted", c.muted);
    setVar("--studio-accent", c.primary);
    setVar("--studio-chart", c.chart);
    setVar("--background", c.background);
    setVar("--surface", c.navigation);
    setVar("--white", c.text);
    setVar("--text", c.text);
    setVar("--text-light", c.muted);
    setVar("--primary", c.primary);
    setVar("--primary-hover", c.primary);
    setVar("--border", c.border);
    setVar("--success", c.success);
    setVar("--warning", c.promotion);
    setVar("--card-background", c.card);
    setVar("--input-background", c.input);
    setVar("--secondary", c.secondary);
    setVar("--radius", config.radius + "px");
    setVar("--shadow", "0 18px 50px rgba(0,0,0," + (Number(config.shadow) / 100) + ")");
    setVar("--md-navigation", c.navigation);
    setVar("--md-card", c.card);
    setVar("--md-card-alt", c.cardAlt);
    setVar("--md-input", c.input);
    setVar("--md-chart", c.chart);
    setVar("--md-chart-grid", c.chartGrid);

    const hero = $("heroPreview");
    if (hero) {
      const fallback = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
      const image = config.heroImage || fallback;
      hero.style.backgroundImage = "linear-gradient(90deg,rgba(5,5,5," +
        (Number(config.heroOverlay) / 100) + "),rgba(5,5,5,.18)),url('" +
        image.replace(/['\\]/g, "") + "')";
      hero.style.color = config.heroText;
      hero.style.borderRadius = config.radius + "px";
    }
    if ($("heroPreviewTitle")) $("heroPreviewTitle").textContent = config.heroTitle;
    if ($("heroPreviewSubtitle")) $("heroPreviewSubtitle").textContent = config.heroSubtitle;
    if ($("heroPreviewButton")) {
      $("heroPreviewButton").textContent = config.heroPrimary;
      $("heroPreviewButton").style.background = c.primary;
      $("heroPreviewButton").style.color = c.background;
    }
    const values = String(config.chartValues).split(",")
      .map((v) => Number(v.trim())).filter((v) => Number.isFinite(v) && v >= 0).slice(0, 12);
    const max = Math.max(1, ...values);
    const bars = $("bars");
    if (bars) {
      bars.replaceChildren();
      values.forEach((value) => {
        const bar = document.createElement("i");
        bar.style.height = Math.max(4, value / max * 100) + "%";
        bar.style.background = c.chart;
        bar.style.borderRadius = config.chartType === "line" ? "999px" : "5px 5px 0 0";
        bars.append(bar);
      });
      bars.style.borderColor = c.chartGrid;
    }
    if ($("chartCaption")) {
      $("chartCaption").textContent =
        String(config.chartLabels).split(",").slice(0, values.length).join(" · ") +
        " | " + values.join(", ");
    }
  }
  function preview() {
    readForm();
    paintPreview();
    notify("Preview updated. These changes are not public until you select Save appearance.");
  }
  async function save() {
    if (!canPublish) {
      notify("Only the super admin can publish platform-wide appearance changes.", true);
      return;
    }
    if (!API || typeof API.request !== "function") {
      notify("The admin API is unavailable. Refresh the page and sign in again.", true);
      return;
    }
    readForm();
    const button = $("save");
    button.disabled = true;
    button.textContent = "Saving…";
    try {
      const result = await API.request("/admins/appearance", {
        method: "PUT", body: config, authenticated: true
      });
      paintPreview();
      notify(result?.message || "Appearance saved successfully across Market Delivery.");
    } catch (error) {
      notify(error.message || "Could not save appearance settings.", true);
    } finally {
      button.disabled = false;
      button.textContent = "Save appearance";
    }
  }
  async function reset() {
    config = cloneDefaults();
    fillForm();
    paintPreview();
    notify("Brand defaults restored in the preview. Saving…");
    await save();
  }
  async function initialize() {
    mountColorInputs();
    fillForm();
    paintPreview();
    if (!API || typeof API.request !== "function") {
      notify("Editor loaded, but the admin API is unavailable. Please refresh and sign in again.", true);
      return;
    }
    try {
      const [profile, saved] = await Promise.all([
        API.request("/admins/me", { authenticated: true }),
        API.request("/admins/appearance", { authenticated: true })
      ]);
      const admin = profile?.admin || profile?.data?.admin || profile;
      canPublish = String(admin?.role || "").trim().toLowerCase() === "super_admin";
      const appearance = saved?.appearance || saved?.data?.appearance || null;
      if (appearance) {
        config = { ...DEFAULTS, ...appearance, colors: { ...DEFAULTS.colors, ...(appearance.colors || {}) } };
      }
      fillForm();
      paintPreview();
      if (!canPublish) {
        $("save").disabled = true;
        $("reset").disabled = true;
        notify("Preview is available. Only the super admin can save platform-wide changes.");
      } else {
        notify("Appearance editor ready. Change a setting, preview it, then save.");
      }
    } catch (error) {
      $("save").disabled = true;
      $("reset").disabled = true;
      notify("Editor loaded, but settings could not be loaded: " +
        (error.message || "Please sign in again."), true);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("apply")?.addEventListener("click", preview);
    $("save")?.addEventListener("click", save);
    $("reset")?.addEventListener("click", reset);
    document.addEventListener("input", (event) => {
      if (event.target.closest(".studio")) preview();
    });
    document.addEventListener("change", (event) => {
      if (event.target.closest(".studio")) preview();
    });
    initialize().catch((error) => notify(error.message || "Could not initialize the editor.", true));
  });
})();