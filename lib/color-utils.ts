export function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
  const c1 = 1 - r / 255, m1 = 1 - g / 255, y1 = 1 - b / 255;
  const k = Math.min(c1, m1, y1);
  return [
    Math.round(((c1 - k) / (1 - k)) * 100),
    Math.round(((m1 - k) / (1 - k)) * 100),
    Math.round(((y1 - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lin = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = lin(r / 255), gl = lin(g / 255), bl = lin(b / 255);
  const l_ = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m_ = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s_ = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
  const l1 = Math.cbrt(l_), m1 = Math.cbrt(m_), s1 = Math.cbrt(s_);
  const L = 0.2104542553 * l1 + 0.7936177850 * m1 - 0.0040720468 * s1;
  const a = 1.9779984951 * l1 - 2.4285922050 * m1 + 0.4505937099 * s1;
  const b2 = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.8086757660 * s1;
  const C = Math.sqrt(a * a + b2 * b2);
  let H = Math.atan2(b2, a) * 180 / Math.PI;
  if (H < 0) H += 360;
  return [parseFloat(L.toFixed(3)), parseFloat(C.toFixed(3)), Math.round(H)];
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function getColorName(h: number, s: number, l: number): string {
  if (l < 8) return "Black";
  if (l > 95) return "White";
  if (s < 8) return l < 40 ? "Dark Gray" : l < 70 ? "Gray" : "Light Gray";
  const prefix = l < 30 ? "Dark " : l > 75 ? "Light " : "";
  let name = "Red";
  if (h >= 10 && h < 40) name = "Orange";
  else if (h >= 40 && h < 70) name = "Yellow";
  else if (h >= 70 && h < 160) name = "Green";
  else if (h >= 160 && h < 200) name = "Cyan";
  else if (h >= 200 && h < 260) name = "Blue";
  else if (h >= 260 && h < 310) name = "Purple";
  else if (h >= 310 && h < 350) name = "Pink";
  return prefix + name;
}

export function getContrastColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#ffffff";
}

export function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function getColorFamily(h: number, s: number, l: number): string {
  if (l < 8) return "black";
  if (l > 95) return "white";
  if (s < 8) return "gray";
  if (h >= 0 && h < 10) return "red";
  if (h >= 10 && h < 40) return "orange";
  if (h >= 40 && h < 70) return "yellow";
  if (h >= 70 && h < 160) return "green";
  if (h >= 160 && h < 200) return "cyan";
  if (h >= 200 && h < 260) return "blue";
  if (h >= 260 && h < 310) return "purple";
  if (h >= 310 && h < 350) return "pink";
  return "red";
}

export function getPsychologyKey(family: string): string {
  const map: Record<string, string> = {
    red: "psychRed", orange: "psychOrange", yellow: "psychYellow",
    green: "psychGreen", cyan: "psychCyan", blue: "psychBlue",
    purple: "psychPurple", pink: "psychPink",
    black: "psychNeutral", white: "psychNeutral", gray: "psychNeutral",
  };
  return map[family] || "psychNeutral";
}

export function getSaturationDesc(s: number): string {
  if (s > 70) return "descVibrant";
  if (s < 30) return "descMuted";
  return "descMid";
}

export function getLightnessDesc(l: number): string {
  if (l > 75) return "descLight";
  if (l < 30) return "descDark";
  return "descMidLight";
}

export function getUsageSuggestions(l: number, s: number): string[] {
  const suggestions: string[] = [];
  if (l > 70) suggestions.push("usageWebBg");
  if (l < 35) suggestions.push("usageWebText");
  if (s > 50 && l > 25 && l < 75) suggestions.push("usageWebAccent");
  if (s < 30) suggestions.push("usageWebBorder");
  if (s > 40 && l > 30 && l < 80) suggestions.push("usageWebHero");
  if (suggestions.length === 0) suggestions.push("usageWebAccent", "usageWebBorder");
  return suggestions;
}
