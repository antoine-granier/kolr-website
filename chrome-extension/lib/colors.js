/**
 * Kolr Color Utilities
 * Ported from the Kolr website codebase
 */

const KolrColors = (() => {

  const CSS_NAMED_COLORS = {
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

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];
  }

  function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(c => c.toString(16).padStart(2, "0")).join("")}`;
  }

  function hexToHsl(hex) {
    const [r, g, b] = hexToRgb(hex).map(c => c / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, Math.round(l * 100)];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function hexToHsv(hex) {
    hex = hex.replace("#", "");
    if (hex.length < 6) return [0, 0, 0];
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, v * 100];
  }

  function hsvToHex(h, s, v) {
    h /= 360; s /= 100; v /= 100;
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return `#${[r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, "0")).join("")}`;
  }

  function getContrastColor(hex) {
    const [r, g, b] = hexToRgb(hex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  }

  function normalizeColor(raw) {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed || ["none", "transparent", "currentcolor", "inherit", "initial", "unset"].includes(trimmed)) return null;
    if (trimmed.startsWith("url")) return null;
    if (CSS_NAMED_COLORS[trimmed]) return CSS_NAMED_COLORS[trimmed];
    if (trimmed.startsWith("#")) {
      const hex = trimmed.slice(1);
      if (hex.length === 3) return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
      if (hex.length === 4) return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
      if (hex.length === 6) return `#${hex}`;
      if (hex.length === 8) return `#${hex.slice(0, 6)}`;
      return null;
    }
    const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgbMatch) {
      const r = Math.min(255, parseInt(rgbMatch[1])).toString(16).padStart(2, "0");
      const g = Math.min(255, parseInt(rgbMatch[2])).toString(16).padStart(2, "0");
      const b = Math.min(255, parseInt(rgbMatch[3])).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    return null;
  }

  function filterAndRankColors(colors) {
    const boring = new Set([
      "#000000", "#ffffff", "#111111", "#222222", "#333333", "#444444",
      "#555555", "#666666", "#777777", "#888888", "#999999", "#aaaaaa",
      "#bbbbbb", "#cccccc", "#dddddd", "#eeeeee", "#f5f5f5", "#f8f8f8",
      "#fafafa", "#f0f0f0", "#e0e0e0", "#d0d0d0", "#808080", "#c0c0c0",
    ]);
    const interesting = [];
    const neutral = [];
    for (const color of colors) {
      const hex = color.toLowerCase();
      if (boring.has(hex)) {
        neutral.push(color);
        continue;
      }
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
      if (saturation < 0.08) {
        neutral.push(color);
      } else {
        interesting.push(color);
      }
    }
    return [...interesting, ...neutral];
  }

  return {
    CSS_NAMED_COLORS,
    hexToRgb,
    rgbToHex,
    hexToHsl,
    hslToHex,
    hexToHsv,
    hsvToHex,
    getContrastColor,
    normalizeColor,
    filterAndRankColors,
  };

})();
