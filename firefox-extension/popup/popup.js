/**
 * Kolr Popup - Main logic (Firefox)
 */

(async () => {

  // ── SVG Icons (Lucide) ──
  const ICONS = {
    palette: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.7 1.7-1.5 0-.4-.2-.7-.4-1-.2-.3-.3-.6-.3-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"/></svg>`,
    pipette: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3L15 6"/></svg>`,
    image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>`,
    contrast: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`,
    blend: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="7"/><circle cx="15" cy="15" r="7"/></svg>`,
    eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.1 12a10.6 10.6 0 0 1 19.8 0 10.6 10.6 0 0 1-19.8 0Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    repeat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`,
    globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    columns: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>`,
    paintbrush: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.4 2.6a2.2 2.2 0 0 1 3 3L16 11l-4-4Z"/><path d="m12 7-1.8 1.8a3 3 0 0 0 0 4.2l.8.8a3 3 0 0 0 4.2 0L17 12"/><path d="M9 15 3.3 20.7a1 1 0 0 0 1.4 1.4L10.4 16.4"/></svg>`,
    fileCode: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/></svg>`,
    monitor: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="m9 17 3 4 3-4"/><path d="m9 13 2-2 2 2"/></svg>`,
  };

  // ── Safe HTML helper (avoids innerHTML for Mozilla review) ──
  const domParser = new DOMParser();
  function parseSVG(svgString) {
    const doc = domParser.parseFromString(svgString, "image/svg+xml");
    return doc.documentElement.cloneNode(true);
  }

  function setChildNodes(el, ...nodes) {
    while (el.firstChild) el.removeChild(el.firstChild);
    for (const node of nodes) {
      if (typeof node === "string") {
        el.appendChild(document.createTextNode(node));
      } else {
        el.appendChild(node);
      }
    }
  }

  // ── Tab switching ──
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  // ── Toast ──
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1500);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showToast("Copied!");
  }

  // ── Helper: create swatch element ──
  function createSwatch(hex, opts = {}) {
    const div = document.createElement("div");
    div.className = `swatch ${opts.small ? "swatch-small" : ""}`;
    div.style.backgroundColor = hex;
    div.title = hex;
    div.addEventListener("click", () => copyToClipboard(hex));
    return div;
  }

  // ── PICK TAB ──
  let pickedColor = null;

  // Show last picked color if any
  const lastPicked = await browser.storage.local.get("kolr_last_picked");
  if (lastPicked.kolr_last_picked) {
    pickedColor = lastPicked.kolr_last_picked;
    showPickResult(pickedColor);
  }

  document.getElementById("btn-pick").addEventListener("click", async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    if (tab.url && (tab.url.startsWith("about") || tab.url.startsWith("moz-extension"))) {
      showToast("Cannot pick on this page");
      return;
    }

    const btn = document.getElementById("btn-pick");
    btn.textContent = "Click on any color...";
    btn.disabled = true;

    // Send to background: capture screenshot + show picker overlay
    browser.runtime.sendMessage({ action: "pick-color", tabId: tab.id });
    window.close();
  });

  function showPickResult(hex) {
    document.getElementById("pick-result").style.display = "block";
    document.getElementById("pick-swatch").style.backgroundColor = hex;
    document.getElementById("pick-hex").textContent = hex.toUpperCase();
    document.getElementById("pick-hex").style.color = hex;

    const [r, g, b] = KolrColors.hexToRgb(hex);
    const [h, s, l] = KolrColors.hexToHsl(hex);
    document.getElementById("pick-formats").textContent = `RGB(${r}, ${g}, ${b}) · HSL(${h}, ${s}%, ${l}%)`;
  }

  document.getElementById("btn-copy-pick").addEventListener("click", () => {
    if (pickedColor) copyToClipboard(pickedColor.toUpperCase());
  });

  // ── Building Palette ──
  let buildingColors = [];

  // Load persisted building palette
  const buildingData = await browser.storage.local.get("kolr_building_palette");
  if (buildingData.kolr_building_palette?.length) {
    buildingColors = buildingData.kolr_building_palette;
    renderBuildingPalette();
  }

  document.getElementById("btn-add-to-palette").addEventListener("click", () => {
    if (!pickedColor) return;
    if (!buildingColors.includes(pickedColor)) {
      buildingColors.push(pickedColor);
      browser.storage.local.set({ kolr_building_palette: buildingColors });
      renderBuildingPalette();
      showToast("Added to palette!");
    } else {
      showToast("Already in palette");
    }
  });

  document.getElementById("btn-save-building").addEventListener("click", async () => {
    if (buildingColors.length === 0) return;
    const palette = {
      id: KolrStorage.generateId(),
      name: `Palette (${buildingColors.length} colors)`,
      colors: [...buildingColors],
      createdAt: Date.now(),
    };
    await KolrStorage.savePalette(palette);
    buildingColors = [];
    browser.storage.local.remove("kolr_building_palette");
    renderBuildingPalette();
    loadPalettes();
    showToast("Palette saved!");
  });

  document.getElementById("btn-clear-building").addEventListener("click", () => {
    buildingColors = [];
    browser.storage.local.remove("kolr_building_palette");
    renderBuildingPalette();
  });

  function renderBuildingPalette() {
    const container = document.getElementById("building-colors");
    const wrapper = document.getElementById("building-palette");
    setChildNodes(container);
    if (buildingColors.length === 0) {
      wrapper.style.display = "none";
      return;
    }
    wrapper.style.display = "block";
    buildingColors.forEach((hex, i) => {
      const c = document.createElement("div");
      c.className = "palette-color";
      c.style.backgroundColor = hex;
      c.title = `${hex} — click to remove`;
      c.addEventListener("click", () => {
        buildingColors.splice(i, 1);
        browser.storage.local.set({ kolr_building_palette: buildingColors });
        renderBuildingPalette();
      });
      container.appendChild(c);
    });
  }

  // ── Recent Colors ──
  async function loadRecentColors() {
    const colors = await KolrStorage.getRecentColors();
    const container = document.getElementById("recent-colors");
    const label = document.getElementById("recent-label");
    setChildNodes(container);
    if (colors.length === 0) {
      label.style.display = "none";
      return;
    }
    label.style.display = "block";
    colors.forEach(hex => container.appendChild(createSwatch(hex, { small: true })));
  }

  // ── EXTRACT TAB ──
  let extractedColors = [];

  // Inline extraction function (Firefox doesn't return values from files-based executeScript)
  function extractColorsFromPage() {
    const colorSet = new Set();
    const props = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor", "fill", "stroke"];

    function rgbToHex(str) {
      const match = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (!match) return null;
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      if (r > 255 || g > 255 || b > 255) return null;
      const alphaMatch = str.match(/,\s*([\d.]+)\s*\)/);
      if (alphaMatch && parseFloat(alphaMatch[1]) === 0) return null;
      return `#${[r, g, b].map(c => c.toString(16).padStart(2, "0")).join("")}`;
    }

    const elements = document.querySelectorAll("*");
    for (const el of elements) {
      let style;
      try { style = getComputedStyle(el); } catch { continue; }
      for (const prop of props) {
        const val = style[prop];
        if (!val || val === "transparent" || val === "rgba(0, 0, 0, 0)") continue;
        const hex = rgbToHex(val);
        if (hex) colorSet.add(hex);
      }
    }

    const styleSheets = document.querySelectorAll("style");
    for (const s of styleSheets) {
      const text = s.textContent || "";
      const hexMatches = text.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g);
      if (hexMatches) {
        for (const h of hexMatches) {
          let hex = h.slice(1);
          if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
          if (hex.length === 6) colorSet.add(`#${hex.toLowerCase()}`);
        }
      }
    }

    const boring = new Set([
      "#000000", "#ffffff", "#111111", "#222222", "#333333", "#444444",
      "#555555", "#666666", "#777777", "#888888", "#999999", "#aaaaaa",
      "#bbbbbb", "#cccccc", "#dddddd", "#eeeeee", "#f5f5f5", "#f8f8f8",
      "#fafafa", "#f0f0f0", "#e0e0e0", "#d0d0d0", "#808080", "#c0c0c0",
    ]);

    const interesting = [];
    const neutral = [];
    for (const color of colorSet) {
      const hex = color.toLowerCase();
      if (boring.has(hex)) { neutral.push(hex); continue; }
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
      if (sat < 0.08) neutral.push(hex);
      else interesting.push(hex);
    }
    return [...interesting, ...neutral];
  }

  document.getElementById("btn-extract").addEventListener("click", async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const btn = document.getElementById("btn-extract");
    btn.textContent = "Extracting...";
    btn.disabled = true;

    try {
      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractColorsFromPage,
      });

      if (results?.[0]?.result) {
        extractedColors = results[0].result;
        showExtractResult();
      }
    } catch (err) {
      console.error("Extract error:", err);
    } finally {
      setChildNodes(btn, parseSVG(ICONS.globe), " Extract Page Colors");
      btn.disabled = false;
    }
  });

  function showExtractResult() {
    const container = document.getElementById("extracted-colors");
    setChildNodes(container);
    if (extractedColors.length === 0) {
      document.getElementById("extract-count").textContent = "No colors found on this page.";
      document.getElementById("extract-result").style.display = "block";
      document.getElementById("btn-save-extracted").style.display = "none";
      return;
    }
    extractedColors.forEach(hex => container.appendChild(createSwatch(hex)));
    document.getElementById("extract-count").textContent = `${extractedColors.length} color${extractedColors.length > 1 ? "s" : ""} found`;
    document.getElementById("extract-result").style.display = "block";
    document.getElementById("btn-save-extracted").style.display = "block";
  }

  document.getElementById("btn-save-extracted").addEventListener("click", async () => {
    if (extractedColors.length === 0) return;
    const palette = {
      id: KolrStorage.generateId(),
      name: `Page Extract (${extractedColors.length} colors)`,
      colors: extractedColors.slice(0, 20),
      createdAt: Date.now(),
    };
    await KolrStorage.savePalette(palette);
    showToast("Palette saved!");
    loadPalettes();
  });

  // ── PALETTES TAB ──
  async function loadPalettes() {
    const palettes = await KolrStorage.getPalettes();
    const list = document.getElementById("palettes-list");
    const empty = document.getElementById("palettes-empty");
    setChildNodes(list);

    if (palettes.length === 0) {
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";

    palettes.forEach(palette => {
      const card = document.createElement("div");
      card.className = "palette-card";

      // Header
      const header = document.createElement("div");
      header.className = "palette-header";
      const nameInput = document.createElement("input");
      nameInput.className = "palette-name";
      nameInput.value = palette.name;
      nameInput.addEventListener("change", async () => {
        palette.name = nameInput.value;
        await KolrStorage.savePalette(palette);
      });
      header.appendChild(nameInput);

      const delBtn = document.createElement("button");
      delBtn.className = "btn-icon btn-danger";
      delBtn.title = "Delete";
      delBtn.appendChild(parseSVG(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`));
      delBtn.addEventListener("click", async () => {
        await KolrStorage.deletePalette(palette.id);
        loadPalettes();
      });
      header.appendChild(delBtn);
      card.appendChild(header);

      // Colors strip
      const colorsDiv = document.createElement("div");
      colorsDiv.className = "palette-colors";
      palette.colors.forEach(hex => {
        const c = document.createElement("div");
        c.className = "palette-color";
        c.style.backgroundColor = hex;
        c.title = hex;
        c.addEventListener("click", () => copyToClipboard(hex));
        colorsDiv.appendChild(c);
      });
      card.appendChild(colorsDiv);

      // Actions
      const actions = document.createElement("div");
      actions.className = "palette-actions";

      // Export dropdown
      const exportWrapper = document.createElement("div");
      exportWrapper.className = "export-dropdown";
      const exportBtn = document.createElement("button");
      exportBtn.className = "btn btn-secondary btn-small";
      exportBtn.textContent = "Export";
      let menuOpen = false;
      let menu = null;

      exportBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".export-menu").forEach(m => m.remove());
        if (menuOpen) {
          menuOpen = false;
          return;
        }
        menu = document.createElement("div");
        menu.className = "export-menu";
        const rect = exportBtn.getBoundingClientRect();
        menu.style.left = rect.left + "px";
        menu.style.top = (rect.bottom + 4) + "px";
        KolrExport.formats.forEach(fmt => {
          const btn = document.createElement("button");
          btn.textContent = fmt.label;
          btn.addEventListener("click", () => {
            const code = KolrExport.generate(palette.colors, fmt.id);
            copyToClipboard(code);
            showToast(`${fmt.label} copied!`);
            menu.remove();
            menuOpen = false;
          });
          menu.appendChild(btn);
        });
        document.body.appendChild(menu);
        menuOpen = true;
      });

      exportWrapper.appendChild(exportBtn);
      actions.appendChild(exportWrapper);

      const copyAllBtn = document.createElement("button");
      copyAllBtn.className = "btn btn-secondary btn-small";
      copyAllBtn.textContent = "Copy HEX";
      copyAllBtn.addEventListener("click", () => {
        copyToClipboard(palette.colors.join(", "));
        showToast("HEX codes copied!");
      });
      actions.appendChild(copyAllBtn);

      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  // Close export menus on click outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".export-menu").forEach(m => m.remove());
  });

  // ── TOOLS TAB ──
  const tools = [
    { name: "Random Palette", path: "random", icon: ICONS.palette, bg: "#00f2ff" },
    { name: "Color Extract", path: "color-extract", icon: ICONS.pipette, bg: "#bf5af2" },
    { name: "Image Extract", path: "image-extract", icon: ICONS.image, bg: "#2effb0" },
    { name: "Contrast Checker", path: "contrast-checker", icon: ICONS.contrast, bg: "#ff9f68" },
    { name: "Gradient", path: "gradient", icon: ICONS.blend, bg: "#ff4d4d" },
    { name: "Colorblind Sim", path: "colorblind", icon: ICONS.eye, bg: "#00f2ff" },
    { name: "Colorblind Web", path: "colorblind-url", icon: ICONS.monitor, bg: "#2effb0" },
    { name: "Converter", path: "color-converter", icon: ICONS.repeat, bg: "#bf5af2" },
    { name: "URL Extract", path: "url-extract", icon: ICONS.globe, bg: "#2effb0" },
    { name: "Dark Theme", path: "dark-theme", icon: ICONS.moon, bg: "#ff9f68" },
    { name: "Compare", path: "palette-compare", icon: ICONS.columns, bg: "#ff4d4d" },
    { name: "Tailwind Colors", path: "tailwind-colors", icon: ICONS.paintbrush, bg: "#00f2ff" },
    { name: "SVG Editor", path: "svg-color-editor", icon: ICONS.fileCode, bg: "#bf5af2" },
  ];

  const toolsGrid = document.getElementById("tools-grid");
  tools.forEach(tool => {
    const a = document.createElement("a");
    a.className = "tool-link";
    a.href = `https://kolr-app.vercel.app/en/tools/${tool.path}`;
    a.target = "_blank";
    const iconDiv = document.createElement("div");
    iconDiv.className = "tool-icon";
    iconDiv.style.background = `${tool.bg}20`;
    iconDiv.style.color = tool.bg;
    iconDiv.appendChild(parseSVG(tool.icon));
    a.appendChild(iconDiv);
    a.appendChild(document.createTextNode(tool.name));
    toolsGrid.appendChild(a);
  });

  // ── A11Y TAB ──
  const defaultA11y = {
    fontSize: 100,
    highContrast: false,
    invertColors: false,
    saturation: 100,
    dyslexiaFont: false,
    letterSpacing: 0,
    lineHeight: 0,
    wordSpacing: 0,
    readingGuide: false,
    highlightLinks: false,
    focusIndicators: false,
    bigCursor: false,
    hideImages: false,
    stopAnimations: false,
  };

  let a11ySettings = { ...defaultA11y };

  // Load saved settings
  const a11yData = await browser.storage.local.get("kolr_a11y");
  if (a11yData.kolr_a11y) {
    a11ySettings = { ...defaultA11y, ...a11yData.kolr_a11y };
  }

  function updateA11yUI() {
    document.getElementById("a11y-font-value").textContent = a11ySettings.fontSize + "%";
    document.getElementById("a11y-high-contrast").checked = a11ySettings.highContrast;
    document.getElementById("a11y-invert").checked = a11ySettings.invertColors;
    document.getElementById("a11y-saturation").value = a11ySettings.saturation;
    document.getElementById("a11y-dyslexia").checked = a11ySettings.dyslexiaFont;
    document.getElementById("a11y-letter-spacing").value = a11ySettings.letterSpacing;
    document.getElementById("a11y-line-height").value = a11ySettings.lineHeight;
    document.getElementById("a11y-word-spacing").value = a11ySettings.wordSpacing;
    document.getElementById("a11y-reading-guide").checked = a11ySettings.readingGuide;
    document.getElementById("a11y-highlight-links").checked = a11ySettings.highlightLinks;
    document.getElementById("a11y-focus-indicators").checked = a11ySettings.focusIndicators;
    document.getElementById("a11y-big-cursor").checked = a11ySettings.bigCursor;
    document.getElementById("a11y-hide-images").checked = a11ySettings.hideImages;
    document.getElementById("a11y-stop-animations").checked = a11ySettings.stopAnimations;
  }

  // Inline a11y function injected directly into page (avoids message-passing issues in Firefox)
  function applyA11yInPage(s) {
    const STYLE_ID = "kolr-a11y-styles";
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);

    const rules = [];

    if (s.fontSize && s.fontSize !== 100) {
      rules.push(`html { font-size: ${s.fontSize}% !important; }`);
    }
    if (s.highContrast) {
      rules.push(`* { color: #ffffff !important; background-color: #000000 !important; border-color: #ffffff !important; }`);
      rules.push(`a, a * { color: #ffff00 !important; }`);
      rules.push(`img, video, canvas, svg { filter: contrast(1.5) !important; }`);
    }
    if (s.invertColors) {
      rules.push(`html { filter: invert(1) hue-rotate(180deg) !important; }`);
      rules.push(`img, video, canvas, [style*="background-image"] { filter: invert(1) hue-rotate(180deg) !important; }`);
    }
    if (s.dyslexiaFont) {
      rules.push(`@font-face { font-family: 'OpenDyslexic'; src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff'); font-weight: normal; }`);
      rules.push(`@font-face { font-family: 'OpenDyslexic'; src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Bold.woff') format('woff'); font-weight: bold; }`);
      rules.push(`* { font-family: 'OpenDyslexic', sans-serif !important; }`);
    }
    if (s.letterSpacing && s.letterSpacing !== 0) {
      rules.push(`* { letter-spacing: ${s.letterSpacing}px !important; }`);
    }
    if (s.lineHeight && s.lineHeight !== 0) {
      rules.push(`* { line-height: ${1.5 + s.lineHeight * 0.25}em !important; }`);
    }
    if (s.wordSpacing && s.wordSpacing !== 0) {
      rules.push(`* { word-spacing: ${s.wordSpacing}px !important; }`);
    }
    if (s.highlightLinks) {
      rules.push(`a, a * { text-decoration: underline !important; text-decoration-thickness: 2px !important; text-underline-offset: 3px !important; outline: 2px solid #ffff00 !important; outline-offset: 2px !important; background-color: rgba(255, 255, 0, 0.15) !important; }`);
    }
    if (s.bigCursor) {
      rules.push(`* { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M8 4 L8 36 L16 28 L26 42 L30 40 L20 26 L32 26 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 4 4, auto !important; }`);
      rules.push(`a, button, [role="button"], input, select, textarea { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M16 4 v36 M4 24 h24' stroke='black' stroke-width='4'/%3E%3Cpath d='M16 4 v36 M4 24 h24' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 16 24, pointer !important; }`);
    }
    if (s.hideImages) {
      rules.push(`img, svg, video, canvas, [role="img"] { opacity: 0.05 !important; }`);
      rules.push(`[style*="background-image"] { background-image: none !important; }`);
    }
    if (s.focusIndicators) {
      rules.push(`*:focus, *:focus-visible { outline: 3px solid #ff6600 !important; outline-offset: 3px !important; box-shadow: 0 0 0 6px rgba(255, 102, 0, 0.3) !important; }`);
    }
    if (s.stopAnimations) {
      rules.push(`*, *::before, *::after { animation: none !important; transition: none !important; }`);
    }
    if (s.saturation !== undefined && s.saturation !== 100) {
      rules.push(`html { filter: saturate(${s.saturation / 100}) !important; }`);
    }

    style.textContent = rules.join("\n");

    // Reading guide
    const guideId = "kolr-reading-guide";
    let guide = document.getElementById(guideId);
    if (s.readingGuide) {
      if (!guide) {
        guide = document.createElement("div");
        guide.id = guideId;
        Object.assign(guide.style, {
          position: "fixed", left: "0", width: "100%", height: "4px",
          background: "rgba(255, 102, 0, 0.6)", pointerEvents: "none",
          zIndex: "2147483647", top: "0", transition: "top 0.05s linear",
          boxShadow: "0 0 12px rgba(255, 102, 0, 0.3)",
        });
        document.body.appendChild(guide);
        document.addEventListener("mousemove", (e) => {
          const g = document.getElementById(guideId);
          if (g) g.style.top = e.clientY + "px";
        });
      }
    } else if (guide) {
      guide.remove();
    }
  }

  async function applyA11y() {
    // Save settings
    await browser.storage.local.set({ kolr_a11y: a11ySettings });

    // Inject a11y directly into the page via func + args
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    if (tab.url && (tab.url.startsWith("about") || tab.url.startsWith("moz-extension"))) return;

    try {
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: applyA11yInPage,
        args: [{ ...a11ySettings }],
      });
    } catch (e) {
      console.error("A11y inject error:", e);
    }
  }

  // Font size controls
  document.getElementById("a11y-font-down").addEventListener("click", () => {
    a11ySettings.fontSize = Math.max(50, a11ySettings.fontSize - 10);
    updateA11yUI();
    applyA11y();
  });

  document.getElementById("a11y-font-up").addEventListener("click", () => {
    a11ySettings.fontSize = Math.min(200, a11ySettings.fontSize + 10);
    updateA11yUI();
    applyA11y();
  });

  // Toggle checkboxes
  const toggleMap = {
    "a11y-high-contrast": "highContrast",
    "a11y-invert": "invertColors",
    "a11y-dyslexia": "dyslexiaFont",
    "a11y-reading-guide": "readingGuide",
    "a11y-highlight-links": "highlightLinks",
    "a11y-focus-indicators": "focusIndicators",
    "a11y-big-cursor": "bigCursor",
    "a11y-hide-images": "hideImages",
    "a11y-stop-animations": "stopAnimations",
  };

  Object.entries(toggleMap).forEach(([id, key]) => {
    document.getElementById(id).addEventListener("change", (e) => {
      a11ySettings[key] = e.target.checked;
      applyA11y();
    });
  });

  // Sliders
  const sliderMap = {
    "a11y-saturation": "saturation",
    "a11y-letter-spacing": "letterSpacing",
    "a11y-line-height": "lineHeight",
    "a11y-word-spacing": "wordSpacing",
  };

  Object.entries(sliderMap).forEach(([id, key]) => {
    document.getElementById(id).addEventListener("input", (e) => {
      a11ySettings[key] = parseInt(e.target.value, 10);
      applyA11y();
    });
  });

  // Reset
  document.getElementById("a11y-reset").addEventListener("click", () => {
    a11ySettings = { ...defaultA11y };
    updateA11yUI();
    applyA11y();
    showToast("Accessibility reset");
  });

  updateA11yUI();

  // ── Init ──
  loadRecentColors();
  loadPalettes();

})();
