// CSS named colors lookup table
const CSS_NAMED_COLORS: Record<string, string> = {
  aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4",
  azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000",
  blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a",
  burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e",
  coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c",
  cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc",
  darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3",
  deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969",
  dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22",
  fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700",
  goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f",
  grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c",
  indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa",
  lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6",
  lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3",
  lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a",
  lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899",
  lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32",
  linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6",
  olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500",
  orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee",
  palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f",
  pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080",
  rebeccapurple: "#663399", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1",
  saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57",
  seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb",
  slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa",
  springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080",
  thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee",
  wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

const SKIP_VALUES = new Set(["none", "transparent", "currentcolor", "inherit", "initial", "unset", "url"]);
const COLOR_ATTRIBUTES = ["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"];
const STYLE_COLOR_PROPS = ["fill", "stroke", "color", "stop-color", "background", "background-color"];

/**
 * Normalize any CSS color string to a 6-digit lowercase hex, or null if not editable.
 */
export function normalizeColor(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();

  if (!trimmed || SKIP_VALUES.has(trimmed) || trimmed.startsWith("url")) return null;

  // Named color
  if (CSS_NAMED_COLORS[trimmed]) return CSS_NAMED_COLORS[trimmed];

  // Hex
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    if (hex.length === 4) return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`; // ignore alpha
    if (hex.length === 6) return `#${hex}`;
    if (hex.length === 8) return `#${hex.slice(0, 6)}`; // ignore alpha
    return null;
  }

  // rgb() / rgba()
  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = Math.min(255, parseInt(rgbMatch[1])).toString(16).padStart(2, "0");
    const g = Math.min(255, parseInt(rgbMatch[2])).toString(16).padStart(2, "0");
    const b = Math.min(255, parseInt(rgbMatch[3])).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  return null;
}

/**
 * Extract all unique colors from an SVG string.
 * Returns a map of canonical hex -> array of original text forms found.
 */
export function extractColors(svgString: string): Map<string, Set<string>> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const colorMap = new Map<string, Set<string>>();

  const addColor = (raw: string) => {
    const normalized = normalizeColor(raw);
    if (!normalized) return;
    if (!colorMap.has(normalized)) colorMap.set(normalized, new Set());
    colorMap.get(normalized)!.add(raw.trim());
  };

  // Walk all elements
  const elements = doc.querySelectorAll("*");
  elements.forEach((el) => {
    // Check color attributes
    for (const attr of COLOR_ATTRIBUTES) {
      const val = el.getAttribute(attr);
      if (val) addColor(val);
    }

    // Check inline style
    const style = el.getAttribute("style");
    if (style) {
      const declarations = style.split(";");
      for (const decl of declarations) {
        const [prop, value] = decl.split(":").map((s) => s.trim());
        if (prop && value && STYLE_COLOR_PROPS.includes(prop.toLowerCase())) {
          addColor(value);
        }
      }
    }
  });

  // Check <style> blocks
  const styleEls = doc.querySelectorAll("style");
  styleEls.forEach((styleEl) => {
    const text = styleEl.textContent || "";
    // Match hex colors
    const hexMatches = text.match(/#(?:[0-9a-fA-F]{3,8})\b/g);
    if (hexMatches) hexMatches.forEach(addColor);
    // Match rgb/rgba
    const rgbMatches = text.match(/rgba?\([^)]+\)/g);
    if (rgbMatches) rgbMatches.forEach(addColor);
    // Match named colors in property values
    const propMatches = text.match(/:\s*([a-zA-Z]+)\s*[;}\n]/g);
    if (propMatches) {
      propMatches.forEach((m) => {
        const name = m.replace(/[:;}\n]/g, "").trim().toLowerCase();
        if (CSS_NAMED_COLORS[name]) addColor(name);
      });
    }
  });

  return colorMap;
}

/**
 * Apply color replacements to an SVG string using atomic string replacement.
 * replacements maps canonical hex (lowercase) -> new hex.
 */
export function applyReplacements(svgString: string, replacements: Record<string, string>): string {
  // Build a map of all original text forms -> new color
  const textMap = new Map<string, string>();
  for (const [canonical, newColor] of Object.entries(replacements)) {
    if (canonical === newColor) continue;
    const upper = newColor.toUpperCase();
    // Add lowercase and uppercase hex forms
    textMap.set(canonical, upper);
    textMap.set(canonical.toUpperCase(), upper);
    // Add short hex form if applicable
    if (
      canonical.length === 7 &&
      canonical[1] === canonical[2] &&
      canonical[3] === canonical[4] &&
      canonical[5] === canonical[6]
    ) {
      const short = `#${canonical[1]}${canonical[3]}${canonical[5]}`;
      textMap.set(short, upper);
      textMap.set(short.toUpperCase(), upper);
    }
  }

  if (textMap.size === 0) return svgString;

  // Build a single regex matching all original forms (longest first to avoid partial matches)
  const sortedKeys = Array.from(textMap.keys()).sort((a, b) => b.length - a.length);
  const escaped = sortedKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(escaped.join("|"), "gi");

  // Replace all occurrences atomically
  return svgString.replace(regex, (match) => {
    return textMap.get(match) || textMap.get(match.toLowerCase()) || textMap.get(match.toUpperCase()) || match;
  });
}

/**
 * Sanitize SVG string for safe rendering (string-based to avoid DOMParser altering the SVG).
 */
export function sanitizeSvg(svgString: string): string {
  return svgString
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "");
}
