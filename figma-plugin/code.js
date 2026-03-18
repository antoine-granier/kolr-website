/**
 * Kolr Figma Plugin - Sandbox Code
 * Has access to Figma API, no DOM access
 */

// ── Color utilities (minimal, needed for Figma color conversion) ──

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map(c => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

function figmaColorToHex(color) {
  return rgbToHex(color.r * 255, color.g * 255, color.b * 255);
}

function hexToFigmaColor(hex) {
  const [r, g, b] = hexToRgb(hex);
  return { r: r / 255, g: g / 255, b: b / 255 };
}

// ── Show UI ──

figma.showUI(__html__, { width: 400, height: 540, themeColors: false });

// ── Message handler ──

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "extract-colors":
      extractColors();
      break;
    case "apply-color":
      applyColor(msg.hex);
      break;
    case "create-styles":
      createStyles(msg.name, msg.colors);
      break;
    case "create-variables":
      createVariables(msg.name, msg.colors);
      break;
    case "get-local-styles":
      getLocalStyles();
      break;
    case "close":
      figma.closePlugin();
      break;
  }
};

// ── Extract colors from selection ──

function extractColors() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Please select at least one element");
    figma.ui.postMessage({ type: "extracted-colors", colors: [] });
    return;
  }

  const colorSet = new Set();

  function walkNode(node) {
    if ("fills" in node && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill.type === "SOLID" && fill.visible !== false) {
          colorSet.add(figmaColorToHex(fill.color));
        }
      }
    }
    if ("strokes" in node && Array.isArray(node.strokes)) {
      for (const stroke of node.strokes) {
        if (stroke.type === "SOLID" && stroke.visible !== false) {
          colorSet.add(figmaColorToHex(stroke.color));
        }
      }
    }
    if ("children" in node) {
      for (const child of node.children) {
        walkNode(child);
      }
    }
  }

  for (const node of selection) {
    walkNode(node);
  }

  const colors = Array.from(colorSet);
  figma.notify(`Found ${colors.length} color${colors.length !== 1 ? "s" : ""}`);
  figma.ui.postMessage({ type: "extracted-colors", colors });
}

// ── Apply color to selection ──

function applyColor(hex) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("Please select at least one element");
    return;
  }

  const color = hexToFigmaColor(hex);
  let count = 0;

  for (const node of selection) {
    if ("fills" in node) {
      node.fills = [{ type: "SOLID", color }];
      count++;
    }
  }

  figma.notify(`Applied ${hex.toUpperCase()} to ${count} element${count !== 1 ? "s" : ""}`);
}

// ── Create paint styles ──

function createStyles(name, colors) {
  const prefix = name || "Kolr Palette";

  for (let i = 0; i < colors.length; i++) {
    const hex = colors[i];
    const color = hexToFigmaColor(hex);
    const style = figma.createPaintStyle();
    style.name = `${prefix}/color-${i + 1}`;
    style.paints = [{ type: "SOLID", color }];
  }

  figma.notify(`Created ${colors.length} color style${colors.length !== 1 ? "s" : ""}`);
}

// ── Create variables ──

function createVariables(name, colors) {
  if (!figma.variables) {
    figma.notify("Variables API not available in this Figma version");
    return;
  }

  try {
    const collection = figma.variables.createVariableCollection(name || "Kolr Palette");

    for (let i = 0; i < colors.length; i++) {
      const hex = colors[i];
      const [r, g, b] = hexToRgb(hex);
      const variable = figma.variables.createVariable(
        `color-${i + 1}`,
        collection,
        "COLOR"
      );
      variable.setValueForMode(collection.defaultModeId, {
        r: r / 255,
        g: g / 255,
        b: b / 255,
        a: 1,
      });
    }

    figma.notify(`Created ${colors.length} color variable${colors.length !== 1 ? "s" : ""}`);
  } catch (err) {
    figma.notify("Failed to create variables: " + err.message);
  }
}

// ── Get local paint styles ──

async function getLocalStyles() {
  const styles = await figma.getLocalPaintStylesAsync();
  const colors = styles
    .filter(s => s.paints.length >= 1 && s.paints[0].type === "SOLID")
    .map(s => ({
      name: s.name,
      hex: figmaColorToHex(s.paints[0].color),
    }));

  figma.ui.postMessage({ type: "local-styles", colors });
  figma.notify(`Loaded ${colors.length} paint style${colors.length !== 1 ? "s" : ""}`);
}
