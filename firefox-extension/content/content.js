/**
 * Kolr Content Script - Extract colors from the current page
 * Injected on demand via browser.scripting.executeScript
 * Uses messaging to send results back (Firefox doesn't return values from files-based executeScript)
 */

(() => {
  const colorSet = new Set();
  const props = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor", "fill", "stroke"];

  function rgbToHex(str) {
    const match = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!match) return null;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    if (r > 255 || g > 255 || b > 255) return null;
    // Skip fully transparent
    const alphaMatch = str.match(/,\s*([\d.]+)\s*\)/);
    if (alphaMatch && parseFloat(alphaMatch[1]) === 0) return null;
    return `#${[r, g, b].map(c => c.toString(16).padStart(2, "0")).join("")}`;
  }

  // Scan all elements
  const elements = document.querySelectorAll("*");
  for (const el of elements) {
    let style;
    try {
      style = getComputedStyle(el);
    } catch {
      continue;
    }
    for (const prop of props) {
      const val = style[prop];
      if (!val || val === "transparent" || val === "rgba(0, 0, 0, 0)") continue;
      const hex = rgbToHex(val);
      if (hex) colorSet.add(hex);
    }
  }

  // Also scan <style> and inline styles for hex colors
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

  // Filter and rank
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

  // Send results back via messaging (Firefox doesn't support return values from files-based executeScript)
  browser.runtime.sendMessage({ action: "extract-result", colors: [...interesting, ...neutral] });
})();
