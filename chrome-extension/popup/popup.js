/**
 * Kolr Popup - Main logic
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
  const lastPicked = await chrome.storage.local.get("kolr_last_picked");
  if (lastPicked.kolr_last_picked) {
    pickedColor = lastPicked.kolr_last_picked;
    showPickResult(pickedColor);
  }

  document.getElementById("btn-pick").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    if (tab.url && (tab.url.startsWith("chrome") || tab.url.startsWith("edge") || tab.url.startsWith("about"))) {
      showToast("Cannot pick on this page");
      return;
    }

    const btn = document.getElementById("btn-pick");
    btn.textContent = "Click on any color...";
    btn.disabled = true;

    // Send to background: capture screenshot + show picker overlay
    chrome.runtime.sendMessage({ action: "pick-color", tabId: tab.id });
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
  const buildingData = await chrome.storage.local.get("kolr_building_palette");
  if (buildingData.kolr_building_palette?.length) {
    buildingColors = buildingData.kolr_building_palette;
    renderBuildingPalette();
  }

  document.getElementById("btn-add-to-palette").addEventListener("click", () => {
    if (!pickedColor) return;
    if (!buildingColors.includes(pickedColor)) {
      buildingColors.push(pickedColor);
      chrome.storage.local.set({ kolr_building_palette: buildingColors });
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
    chrome.storage.local.remove("kolr_building_palette");
    renderBuildingPalette();
    loadPalettes();
    showToast("Palette saved!");
  });

  document.getElementById("btn-clear-building").addEventListener("click", () => {
    buildingColors = [];
    chrome.storage.local.remove("kolr_building_palette");
    renderBuildingPalette();
  });

  function renderBuildingPalette() {
    const container = document.getElementById("building-colors");
    const wrapper = document.getElementById("building-palette");
    container.innerHTML = "";
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
        chrome.storage.local.set({ kolr_building_palette: buildingColors });
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
    container.innerHTML = "";
    if (colors.length === 0) {
      label.style.display = "none";
      return;
    }
    label.style.display = "block";
    colors.forEach(hex => container.appendChild(createSwatch(hex, { small: true })));
  }

  // ── EXTRACT TAB ──
  let extractedColors = [];

  document.getElementById("btn-extract").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const btn = document.getElementById("btn-extract");
    btn.textContent = "Extracting...";
    btn.disabled = true;

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content/content.js"],
      });

      if (results?.[0]?.result) {
        extractedColors = results[0].result;
        showExtractResult();
      }
    } catch (err) {
      console.error("Extract error:", err);
    } finally {
      btn.innerHTML = `${ICONS.globe} Extract Page Colors`;
      btn.disabled = false;
    }
  });

  function showExtractResult() {
    const container = document.getElementById("extracted-colors");
    container.innerHTML = "";
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
    list.innerHTML = "";

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
      delBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;
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
    a.innerHTML = `
      <div class="tool-icon" style="background:${tool.bg}20;color:${tool.bg}">${tool.icon}</div>
      ${tool.name}
    `;
    toolsGrid.appendChild(a);
  });

  // ── Init ──
  loadRecentColors();
  loadPalettes();

})();
