"use client";

import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { ArrowLeft, Copy, Check, Thermometer } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
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

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
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

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
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

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getColorName(h: number, s: number, l: number): string {
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

function getContrastColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#ffffff";
}

export default function ColorPage() {
  const params = useParams();
  const hexParam = (params.hex as string).toUpperCase();
  const hex = `#${hexParam}`;
  const locale = useLocale();
  const t = useTranslations("colorPage");
  const tNav = useTranslations("nav");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const valid = /^[0-9A-F]{3,8}$/i.test(hexParam);
  if (!valid) {
    return (
      <div className="bg-kolr-bg text-white min-h-screen flex items-center justify-center">
        <p className="text-kolr-text-muted text-lg">Invalid color code</p>
      </div>
    );
  }

  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [c, m, y, k] = rgbToCmyk(r, g, b);
  const [okL, okC, okH] = rgbToOklch(r, g, b);
  const colorName = getColorName(h, s, l);
  const isWarm = (h >= 0 && h < 70) || h >= 310;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const conversions = [
    { key: "hex", label: "HEX", value: hex },
    { key: "rgb", label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { key: "hsl", label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { key: "oklch", label: "OKLCH", value: `oklch(${okL} ${okC} ${okH})` },
    { key: "cmyk", label: "CMYK", value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` },
  ];

  // Generate palettes
  const complementary = Array.from({ length: 5 }, (_, i) => {
    const newH = (h + 180 + (i - 2) * 15) % 360;
    return hslToHex(newH, s, Math.max(20, Math.min(80, l + (i - 2) * 8)));
  });

  const analogous = Array.from({ length: 5 }, (_, i) =>
    hslToHex((h + (i - 2) * 25 + 360) % 360, s, l)
  );

  const triadic = [
    hslToHex(h, s, l),
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
    hslToHex((h + 120) % 360, Math.max(20, s - 20), Math.min(85, l + 15)),
    hslToHex((h + 240) % 360, Math.max(20, s - 20), Math.min(85, l + 15)),
  ];

  const monochromatic = Array.from({ length: 5 }, (_, i) =>
    hslToHex(h, s, 15 + i * 17)
  );

  const shades = Array.from({ length: 10 }, (_, i) =>
    hslToHex(h, s, Math.round(l * (1 - (i + 1) / 11)))
  );

  const tints = Array.from({ length: 10 }, (_, i) =>
    hslToHex(h, s, Math.round(l + (100 - l) * ((i + 1) / 11)))
  );

  const palettes = [
    { name: t("complementary"), colors: complementary },
    { name: t("analogous"), colors: analogous },
    { name: t("triadic"), colors: triadic },
    { name: t("monochromatic"), colors: monochromatic },
  ];

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8 pb-16">
        <div className="container max-w-[900px]">
          <Reveal animation="reveal-up">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
            >
              <ArrowLeft size={18} />
              <span>{tNav("home")}</span>
            </Link>

            <header className="mb-10 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {colorName}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2 font-mono">{hex}</p>
            </header>
          </Reveal>

          {/* Large Preview */}
          <Reveal animation="reveal-scale" delay={1}>
            <div
              className="h-[200px] rounded-[2rem] mb-10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              style={{ backgroundColor: hex }}
            >
              <span
                className="font-mono text-2xl font-bold opacity-60"
                style={{ color: getContrastColor(hex) }}
              >
                {hex}
              </span>
            </div>
          </Reveal>

          {/* Conversions */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("conversions")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {conversions.map(({ key, label, value }) => (
                  <button
                    key={key}
                    onClick={() => copy(value, key)}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">{label}</span>
                      <span className="font-mono text-sm text-white">{value}</span>
                    </div>
                    <div className={`transition-colors ${copiedKey === key ? "text-kolr-green" : "text-kolr-text-muted opacity-0 group-hover:opacity-100"}`}>
                      {copiedKey === key ? <Check size={14} /> : <Copy size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Properties */}
          <Reveal animation="reveal-up" delay={2}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("properties")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: t("hue"), value: `${h}°` },
                  { label: t("saturation"), value: `${s}%` },
                  { label: t("lightness"), value: `${l}%` },
                  { label: t("brightness"), value: `${Math.round((r * 299 + g * 587 + b * 114) / 1000)}` },
                  {
                    label: t("temperature"),
                    value: isWarm ? t("warm") : t("cool"),
                    icon: <Thermometer size={14} className={isWarm ? "text-kolr-orange" : "text-kolr-cyan"} />,
                  },
                ].map((prop, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">{prop.label}</span>
                    <span className="flex items-center gap-2 text-lg font-bold text-white">
                      {"icon" in prop && prop.icon}
                      {prop.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Related Palettes */}
          <Reveal animation="reveal-up" delay={3}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("relatedPalettes")}
              </label>
              <div className="flex flex-col gap-5">
                {palettes.map((palette) => (
                  <div key={palette.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{palette.name}</span>
                      <button
                        onClick={() => copy(palette.colors.join(", "), palette.name)}
                        className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                          copiedKey === palette.name ? "text-kolr-green" : "text-kolr-text-muted hover:text-white"
                        }`}
                      >
                        {copiedKey === palette.name ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex rounded-xl overflow-hidden h-12 border border-white/10">
                      {palette.colors.map((color, i) => (
                        <Link
                          key={i}
                          href={`/${locale}/color/${color.replace("#", "")}`}
                          className="flex-1 flex items-center justify-center group no-underline transition-all duration-200 hover:flex-[1.5]"
                          style={{ backgroundColor: color }}
                        >
                          <span
                            className="text-[9px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                            style={{ color: getContrastColor(color) }}
                          >
                            {color}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Shades & Tints */}
          <Reveal animation="reveal-up" delay={4}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl">
              <div className="mb-6">
                <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-3">
                  {t("shades")}
                </label>
                <div className="flex rounded-xl overflow-hidden h-10 border border-white/10">
                  {shades.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 cursor-pointer group relative"
                      style={{ backgroundColor: color }}
                      onClick={() => copy(color, `shade-${i}`)}
                    >
                      <span
                        className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                        style={{ color: getContrastColor(color) }}
                      >
                        {copiedKey === `shade-${i}` ? "✓" : color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-3">
                  {t("tints")}
                </label>
                <div className="flex rounded-xl overflow-hidden h-10 border border-white/10">
                  {tints.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 cursor-pointer group relative"
                      style={{ backgroundColor: color }}
                      onClick={() => copy(color, `tint-${i}`)}
                    >
                      <span
                        className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                        style={{ color: getContrastColor(color) }}
                      >
                        {copiedKey === `tint-${i}` ? "✓" : color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
