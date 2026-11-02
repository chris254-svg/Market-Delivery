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
      border: "#789B75", chart: "#D9F56B", chartGrid: "#789B75"
    },
    radius: 16, borderWidth: 1.5, shadow: 24, chartType: "bar",
    chartLabels: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    chartValues: "35,62,48,80,55,92,70",
    heroTitle: "Freshness, delivered to your doorstep.",
    heroSubtitle: "Shop fresh groceries and everyday essentials, then get them delivered straight to your doorstep.",
    heroImage: "", heroPrimary: "Shop Now", heroSecondary: "Get Started",
    heroOverlay: 82, heroText: "#F4F2E9", themes: []
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
  let selectedThemeKey = "preset:market-fresh";
  const BUILT_IN_THEMES = {
    "preset:market-fresh": { name: "Market Fresh", colors: { ...DEFAULTS.colors } },
    "preset:forest": { name: "Forest Market", colors: { ...DEFAULTS.colors, background: "#071B15", navigation: "#123D2D", card: "#1B4A36", cardAlt: "#315C42", input: "#19372B", text: "#F4F2E9", muted: "#A8C4A5", primary: "#B9E8C5", secondary: "#789B75", border: "#78A88B", chart: "#B9E8C5", chartGrid: "#789B75" } },
    "preset:midnight": { name: "Midnight Lime", colors: { ...DEFAULTS.colors, background: "#050510", navigation: "#17172B", card: "#22223B", cardAlt: "#343451", input: "#191929", text: "#F5F4FF", muted: "#A5A4C4", primary: "#D9F56B", secondary: "#A4B85A", border: "#77779B", chart: "#D9F56B", chartGrid: "#77779B" } },
    "preset:light": { name: "Fresh Light", colors: { ...DEFAULTS.colors, background: "#F4F2E9", navigation: "#E4EBD9", card: "#F5F3DC", cardAlt: "#DDE8D5", input: "#FFFFFF", text: "#102A23", muted: "#526D55", primary: "#789B35", secondary: "#789B75", border: "#8A9D83", chart: "#789B35", chartGrid: "#A8B99E" } }
  };
  const THEME_FIELDS = ["colors", "radius", "borderWidth", "shadow", "chartType", "chartLabels", "chartValues", "heroTitle", "heroSubtitle", "heroImage", "heroPrimary", "heroSecondary", "heroOverlay", "heroText"];


  function themeSnapshot() {
    const snapshot = {};
    THEME_FIELDS.forEach((key) => { snapshot[key] = key === "colors" ? { ...config.colors } : config[key]; });
    return snapshot;
  }
  function refreshThemeOptions() {
    const select = $("themeSelect");
    if (!select) return;
    const previous = selectedThemeKey;
    select.replaceChildren();
    Object.entries(BUILT_IN_THEMES).forEach(([key, theme]) => {
      const option = document.createElement("option");
      option.value = key; option.textContent = theme.name + " · built in";
      select.append(option);
    });
    (config.themes || []).forEach((theme, index) => {
      const option = document.createElement("option");
      option.value = "saved:" + index; option.textContent = theme.name + " · saved";
      select.append(option);
    });
    if ([...select.options].some((option) => option.value === previous)) select.value = previous;
    else { selectedThemeKey = "preset:market-fresh"; select.value = selectedThemeKey; }
    $("deleteTheme").disabled = !selectedThemeKey.startsWith("saved:") || !canPublish;
  }
  function selectedTheme() {
    if (BUILT_IN_THEMES[selectedThemeKey]) return BUILT_IN_THEMES[selectedThemeKey];
    if (selectedThemeKey.startsWith("saved:")) return (config.themes || [])[Number(selectedThemeKey.slice(6))] || null;
    return null;
  }
  function applySelectedTheme() {
    const theme = selectedTheme();
    if (!theme) return;
    const savedThemes = config.themes || [];
    config = { ...DEFAULTS, ...theme, colors: { ...DEFAULTS.colors, ...(theme.colors || {}) }, themes: savedThemes };
    fillForm(); paintPreview(); animatePreview();
    notify('"' + theme.name + '" applied to the preview. Save appearance to publish it.');
    $("themeNotice").textContent = "Applied " + theme.name + ". Adjust any setting before saving.";
    refreshThemeOptions();
  }
  async function saveNamedTheme() {
    if (!canPublish) { notify("Your account cannot save platform themes.", true); return; }
    readForm();
    const name = String($("themeName").value || "").trim();
    if (!name) { $("themeName").focus(); $("themeNotice").textContent = "Enter a name for this theme first."; return; }
    const themes = [...(config.themes || [])];
    const existing = themes.findIndex((theme) => theme.name.toLowerCase() === name.toLowerCase());
    const entry = { name, ...themeSnapshot() };
    if (existing >= 0) themes[existing] = entry;
    else if (themes.length >= 12) { $("themeNotice").textContent = "You can save up to 12 named themes. Delete one before adding another."; return; }
    else themes.push(entry);
    config.themes = themes;
    selectedThemeKey = "saved:" + (existing >= 0 ? existing : themes.length - 1);
    refreshThemeOptions();
    $("themeSelect").value = selectedThemeKey;
    const saved = await save();
    $("themeNotice").textContent = saved
      ? "Saved theme: " + name + ". It is available in this library."
      : "The theme could not be saved. Check the message above and try again.";
  }
  async function deleteSelectedTheme() {
    if (!selectedThemeKey.startsWith("saved:")) return;
    const index = Number(selectedThemeKey.slice(6));
    const themes = [...(config.themes || [])];
    const removed = themes[index];
    if (!removed) return;
    themes.splice(index, 1);
    config.themes = themes;
    selectedThemeKey = "preset:market-fresh";
    refreshThemeOptions();
    const saved = await save();
    $("themeNotice").textContent = saved
      ? "Deleted saved theme: " + removed.name + "."
      : "The theme could not be deleted. Check the message above and try again.";
  }

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
    ["radius", "borderWidth", "shadow", "heroOverlay"].forEach((id) => {
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
    ["radius", "borderWidth", "shadow", "heroOverlay", "chartType", "chartLabels", "chartValues",
      "heroTitle", "heroSubtitle", "heroImage", "heroPrimary", "heroSecondary", "heroText"]
      .forEach((id) => { if ($(id)) $(id).value = config[id]; });
  }

  function relativeLuminance(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(String(hex || ""))) return 1;
    const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
      .map((value) => value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  function contrastRatio(a, b) {
    const x = relativeLuminance(a), y = relativeLuminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function readableInk(background) {
    return contrastRatio("#102A23", background) >= contrastRatio("#F4F2E9", background)
      ? "#102A23" : "#F4F2E9";
  }
  function readableText(preferred, backgrounds) {
    if (/^#[0-9a-f]{6}$/i.test(String(preferred || "")) &&
      backgrounds.every((background) => contrastRatio(preferred, background) >= 4.5)) return preferred;
    const choices = ["#102A23", "#F4F2E9"];
    return choices.sort((a, b) =>
      Math.min(...backgrounds.map((background) => contrastRatio(a, background))) -
      Math.min(...backgrounds.map((background) => contrastRatio(b, background)))
    ).reverse()[0];
  }

  function paintPreview() {
    const root = document.documentElement;
    const c = config.colors;
    const readable = readableText(c.text, [c.background, c.navigation, c.card, c.cardAlt]);
    const mutedReadable = readableText(c.muted, [c.background, c.navigation, c.card, c.cardAlt]);
    const setVar = (name, value) => root.style.setProperty(name, value);
    setVar("--studio-bg", c.background);
    setVar("--studio-panel", c.navigation);
    setVar("--studio-card", c.card);
    setVar("--studio-text", readable);
    setVar("--studio-muted", mutedReadable);
    setVar("--studio-accent", c.primary);
    setVar("--studio-chart", c.chart);
    setVar("--background", c.background);
    setVar("--surface", c.navigation);
    setVar("--white", readable);
    setVar("--text", readable);
    setVar("--text-light", mutedReadable);
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
    setVar("--preview-bg", c.background);
    setVar("--preview-card", c.card);
    setVar("--preview-border", c.border);
    setVar("--preview-input", c.input);
    setVar("--preview-text", readable);
    setVar("--preview-primary", c.primary);
    setVar("--preview-radius", config.radius + "px");
    setVar("--md-border-width", config.borderWidth + "px");
    setVar("--preview-border-width", config.borderWidth + "px");
    setVar("--preview-shadow", "0 12px 30px rgba(0,0,0," + (Number(config.shadow) / 100) + ")");
    const previewNav = $("previewNav");
    if (previewNav) { previewNav.style.background = c.navigation; previewNav.style.color = readable; previewNav.style.borderBottom = config.borderWidth + "px solid " + c.border; }
    const palette = $("previewPalette");
    if (palette) {
      palette.replaceChildren();
      Object.values(c).forEach((color) => {
        const chip = document.createElement("span");
        chip.style.background = color;
        chip.title = color;
        palette.append(chip);
      });
    }
    document.querySelectorAll(".preview-component,.preview-product,.preview-chart").forEach((node) => {
      node.style.backgroundColor = c.card;
      node.style.color = readable;
      node.style.borderColor = c.border;
      node.style.borderStyle = "solid";
      node.style.borderWidth = config.borderWidth + "px";
      node.style.borderRadius = config.radius + "px";
      node.style.boxShadow = "0 12px 30px rgba(0,0,0," + (Number(config.shadow) / 100) + ")";
    });
    document.querySelectorAll(".preview-component input").forEach((input) => {
      input.style.background = c.input; input.style.color = c.text; input.style.borderColor = c.border; input.style.borderStyle = "solid"; input.style.borderWidth = config.borderWidth + "px";
    });
    document.querySelectorAll(".preview-component button").forEach((button, index) => {
      button.style.background = index === 0 ? c.primary : c.secondary;
      button.style.color = readableInk(index === 0 ? c.primary : c.secondary);
      button.style.border = config.borderWidth + "px solid " + c.border;
    });

    const hero = $("heroPreview");
    if (hero) {
      const fallback = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80";
      const image = config.heroImage || fallback;
      hero.style.backgroundImage = "linear-gradient(90deg,rgba(5,5,5," +
        (Number(config.heroOverlay) / 100) + "),rgba(5,5,5,.18)),url('" +
        image.replace(/['\\]/g, "") + "')";
      hero.style.color = readableText(config.heroText, [c.background]);
      hero.style.borderRadius = config.radius + "px"; hero.style.border = config.borderWidth + "px solid " + c.border;
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
  function animatePreview(button) {
    const card = document.querySelector(".preview-card");
    const hero = $("heroPreview");
    [card, hero].filter(Boolean).forEach((node) => {
      node.classList.remove("is-updating");
      void node.offsetWidth;
      node.classList.add("is-updating");
    });
    if (button) {
      button.classList.remove("is-done");
      void button.offsetWidth;
      button.classList.add("is-done");
      window.setTimeout(() => button.classList.remove("is-done"), 550);
    }
  }
  function preview() {
    readForm();
    paintPreview();
    animatePreview();
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
    button.classList.add("is-busy");
    button.textContent = "Saving…";
    try {
      const result = await API.request("/admins/appearance", {
        method: "PUT", body: config, authenticated: true
      });
      paintPreview();
      animatePreview(button);
      notify(result?.message || "Appearance saved successfully across Market Delivery.");
      return true;
    } catch (error) {
      notify(error.message || "Could not save appearance settings.", true);
      return false;
    } finally {
      button.disabled = false;
      button.classList.remove("is-busy");
      button.textContent = "Save appearance";
    }
  }
  async function reset() {
    const button = $("reset");
    button.disabled = true;
    button.classList.add("is-busy");
    const savedThemes = config.themes || [];
    config = { ...cloneDefaults(), themes: savedThemes };
    fillForm();
    paintPreview();
    animatePreview(button);
    notify("Brand defaults restored in the preview. Saving…");
    try { await save(); } finally {
      button.disabled = !canPublish;
      button.classList.remove("is-busy");
    }
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
      canPublish = ["admin", "super_admin"].includes(String(admin?.role || "").trim().toLowerCase());
      const appearance = saved?.appearance || saved?.data?.appearance || null;
      if (appearance) {
        config = { ...DEFAULTS, ...appearance, colors: { ...DEFAULTS.colors, ...(appearance.colors || {}) },
          themes: Array.isArray(appearance.themes) ? appearance.themes : [] };
      }
      refreshThemeOptions();
      fillForm();
      paintPreview();
      $("saveTheme").disabled = !canPublish;
      if (!canPublish) {
        $("save").disabled = true;
        $("reset").disabled = true;
        notify("You can preview and publish appearance changes for the whole platform.");
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
    $("themeSelect")?.addEventListener("change", (event) => {
      selectedThemeKey = event.target.value;
      $("deleteTheme").disabled = !canPublish || !selectedThemeKey.startsWith("saved:");
    });
    $("applyTheme")?.addEventListener("click", applySelectedTheme);
    $("saveTheme")?.addEventListener("click", saveNamedTheme);
    $("deleteTheme")?.addEventListener("click", deleteSelectedTheme);
    document.addEventListener("input", (event) => {
      if (event.target.closest(".studio") && !event.target.closest("#themeName")) preview();
    });
    document.addEventListener("change", (event) => {
      if (event.target.closest(".studio") && !event.target.closest("#themeSelect")) preview();
    });
    initialize().catch((error) => notify(error.message || "Could not initialize the editor.", true));
  });
})();