"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Copy,
  Check,
  ArrowLeft,
  RefreshCw,
  Moon,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getContrastColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#ffffff";
}

interface DarkTheme {
  bg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryMuted: string;
}

const PRESETS = [
  { name: "Midnight", accent: "#6366F1" },
  { name: "Ocean", accent: "#06B6D4" },
  { name: "Forest", accent: "#10B981" },
  { name: "Sunset", accent: "#F59E0B" },
  { name: "Rose", accent: "#F43F5E" },
  { name: "Violet", accent: "#8B5CF6" },
  { name: "Sky", accent: "#0EA5E9" },
  { name: "Emerald", accent: "#34D399" },
];

export default function DarkThemePage() {
  const t = useTranslations("toolDarkTheme");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [accent, setAccent] = useState("#6366F1");
  const [contrast, setContrast] = useState(50);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateTheme = useCallback((): DarkTheme => {
    const hsl = hexToHsl(accent);

    const bgL = Math.max(2, 8 - Math.round(contrast / 12));
    const surfaceL = bgL + 4;
    const surfaceHoverL = surfaceL + 4;
    const borderL = surfaceHoverL + 4;
    const textMutedL = 45 + Math.round(contrast / 5);
    const primaryMutedL = Math.min(hsl.l + 15, 75);

    return {
      bg: hslToHex(hsl.h, Math.min(hsl.s, 15), bgL),
      surface: hslToHex(hsl.h, Math.min(hsl.s, 12), surfaceL),
      surfaceHover: hslToHex(hsl.h, Math.min(hsl.s, 10), surfaceHoverL),
      border: hslToHex(hsl.h, Math.min(hsl.s, 8), borderL),
      text: hslToHex(hsl.h, 5, 95),
      textMuted: hslToHex(hsl.h, 5, textMutedL),
      primary: accent,
      primaryMuted: hslToHex(hsl.h, Math.min(hsl.s, 60), primaryMutedL),
    };
  }, [accent, contrast]);

  const theme = generateTheme();

  const cssVars = `--bg: ${theme.bg};
--surface: ${theme.surface};
--surface-hover: ${theme.surfaceHover};
--border: ${theme.border};
--text: ${theme.text};
--text-muted: ${theme.textMuted};
--primary: ${theme.primary};
--primary-muted: ${theme.primaryMuted};`;

  const tailwindConfig = `colors: {
  bg: "${theme.bg}",
  surface: "${theme.surface}",
  "surface-hover": "${theme.surfaceHover}",
  border: "${theme.border}",
  text: "${theme.text}",
  "text-muted": "${theme.textMuted}",
  primary: "${theme.primary}",
  "primary-muted": "${theme.primaryMuted}",
}`;

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const randomize = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 50 + Math.floor(Math.random() * 40);
    const l = 50 + Math.floor(Math.random() * 20);
    setAccent(hslToHex(h, s, l));
    setContrast(30 + Math.floor(Math.random() * 40));
  };

  const themeEntries: { key: string; label: string; value: string }[] = [
    { key: "bg", label: "Background", value: theme.bg },
    { key: "surface", label: "Surface", value: theme.surface },
    { key: "surfaceHover", label: "Surface Hover", value: theme.surfaceHover },
    { key: "border", label: "Border", value: theme.border },
    { key: "text", label: "Text", value: theme.text },
    { key: "textMuted", label: "Text Muted", value: theme.textMuted },
    { key: "primary", label: "Primary", value: theme.primary },
    { key: "primaryMuted", label: "Primary Muted", value: theme.primaryMuted },
  ];

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8">
        <div className="container">
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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 mb-16">
            {/* Controls */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 flex flex-col gap-8 backdrop-blur-xl">
                {/* Accent Color */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("accentColor")}
                  </label>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <input
                      type="color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="min-w-[48px] min-h-[48px] rounded-xl cursor-pointer border-0 bg-transparent"
                      style={{ WebkitAppearance: "none" }}
                    />
                    <input
                      type="text"
                      value={accent.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (/^#[0-9A-F]{0,6}$/i.test(val)) setAccent(val);
                      }}
                      className="flex-1 font-mono text-lg font-extrabold bg-transparent border-0 outline-none uppercase"
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* Presets */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("presets")}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setAccent(preset.accent)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 ${
                          accent === preset.accent
                            ? "border-white/30 bg-white/10"
                            : "border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg"
                          style={{ backgroundColor: preset.accent }}
                        />
                        <span className="text-[10px] font-bold text-kolr-text-muted">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("contrast")}: {contrast}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                  />
                </div>

                {/* Randomize */}
                <button
                  onClick={randomize}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-kolr-purple transition-all duration-300 group"
                >
                  <RefreshCw
                    size={18}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  {t("randomize")}
                </button>
              </div>
            </Reveal>

            {/* Preview & Palette */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="flex flex-col gap-6">
                {/* Live Preview */}
                <div
                  className="rounded-[2rem] p-8 border-2 transition-all duration-300"
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                  }}
                >
                  {/* Mini App Preview */}
                  <div
                    className="rounded-xl p-5 mb-4"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border, border: `1px solid ${theme.border}` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Moon size={18} style={{ color: theme.primary }} />
                      <span className="font-bold text-sm" style={{ color: theme.text }}>
                        {t("previewTitle")}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: theme.textMuted }}>
                      {t("previewText")}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                        style={{ backgroundColor: theme.primary, color: getContrastColor(theme.primary) }}
                      >
                        {t("previewButton")}
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: theme.surfaceHover, color: theme.textMuted, border: `1px solid ${theme.border}` }}
                      >
                        {t("previewSecondary")}
                      </button>
                    </div>
                  </div>

                  {/* Mini Card */}
                  <div
                    className="rounded-xl p-4 flex items-center gap-3"
                    style={{ backgroundColor: theme.surfaceHover, border: `1px solid ${theme.border}` }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
                    >
                      <Moon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: theme.text }}>
                        {t("previewCard")}
                      </p>
                      <p className="text-xs" style={{ color: theme.textMuted }}>
                        {t("previewCardDesc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 backdrop-blur-xl">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-4">
                    {t("palette")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {themeEntries.map(({ key, label, value }) => (
                      <button
                        key={key}
                        onClick={() => copyCode(value, key)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                      >
                        <div
                          className="w-10 h-10 rounded-lg shrink-0 border border-white/10"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
                          <span className="text-xs font-bold text-white">{label}</span>
                          <span className="text-[10px] font-mono text-kolr-text-muted">
                            {copiedKey === key ? "Copied!" : value.toUpperCase()}
                          </span>
                        </div>
                        <div className={`shrink-0 transition-colors ${copiedKey === key ? "text-kolr-green" : "text-kolr-text-muted opacity-0 group-hover:opacity-100"}`}>
                          {copiedKey === key ? <Check size={14} /> : <Copy size={14} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Export */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 backdrop-blur-xl">
                  <div className="flex flex-col gap-4">
                    {/* CSS */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                          CSS
                        </label>
                        <button
                          onClick={() => copyCode(cssVars, "css")}
                          className={`flex items-center gap-1 text-xs font-bold transition-colors ${copiedKey === "css" ? "text-kolr-green" : "text-kolr-text-muted hover:text-white"}`}
                        >
                          {copiedKey === "css" ? <Check size={12} /> : <Copy size={12} />}
                          {copiedKey === "css" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs text-kolr-cyan overflow-x-auto">
                        {cssVars}
                      </pre>
                    </div>

                    {/* Tailwind */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                          Tailwind
                        </label>
                        <button
                          onClick={() => copyCode(tailwindConfig, "tailwind")}
                          className={`flex items-center gap-1 text-xs font-bold transition-colors ${copiedKey === "tailwind" ? "text-kolr-green" : "text-kolr-text-muted hover:text-white"}`}
                        >
                          {copiedKey === "tailwind" ? <Check size={12} /> : <Copy size={12} />}
                          {copiedKey === "tailwind" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs text-kolr-purple overflow-x-auto">
                        {tailwindConfig}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
