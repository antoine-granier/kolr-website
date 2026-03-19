"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ColorPicker from "@/components/ColorPicker";
import ToolContent from "@/components/ToolContent";

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
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

function getContrastColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#ffffff";
}

function parseAnyColor(input: string): string | null {
  input = input.trim();
  // HEX
  if (/^#?[0-9a-f]{3,6}$/i.test(input)) {
    const hex = input.startsWith("#") ? input : `#${input}`;
    return hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase()
      : hex.toUpperCase();
  }
  // RGB
  const rgbMatch = input.match(/rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
  if (rgbMatch) return rgbToHex(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]);
  // HSL
  const hslMatch = input.match(/hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)/i);
  if (hslMatch) {
    const [r, g, b] = hslToRgb(+hslMatch[1], +hslMatch[2], +hslMatch[3]);
    return rgbToHex(r, g, b);
  }
  return null;
}

export default function ColorConverterPage() {
  const t = useTranslations("toolColorConverter");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [hex, setHex] = useState("#6366F1");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [cm, mm, ym, km] = rgbToCmyk(r, g, b);
  const [okL, okC, okH] = rgbToOklch(r, g, b);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePaste = (value: string) => {
    const parsed = parseAnyColor(value);
    if (parsed) setHex(parsed);
  };

  const formats = [
    { key: "hex", label: "HEX", value: hex, editable: true },
    { key: "rgb", label: "RGB", value: `rgb(${r}, ${g}, ${b})`, editable: true },
    { key: "hsl", label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)`, editable: true },
    { key: "oklch", label: "OKLCH", value: `oklch(${okL} ${okC} ${okH})`, editable: false },
    { key: "cmyk", label: "CMYK", value: `cmyk(${cm}%, ${mm}%, ${ym}%, ${km}%)`, editable: false },
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

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {t("title")}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2">
                {t("description")}
              </p>
            </header>
          </Reveal>

          {/* Color Input + Preview */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-center">
                {/* Input */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("pasteAny")}
                  </label>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <ColorPicker value={hex} onChange={setHex} size="md" />
                    <input
                      type="text"
                      value={hex}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (/^#[0-9A-F]{0,6}$/i.test(val)) setHex(val);
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text");
                        handlePaste(pasted);
                      }}
                      className="flex-1 font-mono text-xl font-extrabold bg-transparent border-0 outline-none uppercase"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Preview */}
                <Link
                  href={`/${locale}/color/${hex.replace("#", "")}`}
                  className="block h-[120px] rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-2 border-white/[0.08] no-underline transition-all duration-200 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:scale-[1.02]"
                  style={{ backgroundColor: hex }}
                >
                  <span
                    className="font-mono text-lg font-bold opacity-70"
                    style={{ color: getContrastColor(hex) }}
                  >
                    {hex}
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Conversions Grid */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl">
              <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-6">
                {t("title")}
              </label>
              <div className="flex flex-col gap-4">
                {formats.map(({ key, label, value, editable }) => (
                  <div
                    key={key}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-kolr-text-muted w-14 shrink-0">
                      {label}
                    </span>
                    <input
                      type="text"
                      value={value}
                      readOnly={!editable}
                      onChange={(e) => {
                        if (editable) handlePaste(e.target.value);
                      }}
                      onPaste={(e) => {
                        if (editable) {
                          e.preventDefault();
                          handlePaste(e.clipboardData.getData("text"));
                        }
                      }}
                      className={`flex-1 font-mono text-sm font-bold bg-transparent border-0 outline-none ${
                        editable ? "text-white cursor-text" : "text-kolr-text-muted"
                      }`}
                    />
                    <button
                      onClick={() => copy(value, key)}
                      aria-label={`Copy ${label} value`}
                      className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        copiedKey === key
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedKey === key ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <ToolContent
        aboutContent={t.raw("aboutContent")}
        howToContent={t.raw("howToContent")}
        faqJson={t.raw("faq")}
      />
    </div>
  );
}
