"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  Layers,
  Layout,
  Grid,
  Maximize,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

type HarmonyMode = "monochromatic" | "analogous" | "complementary" | "triadic";

export default function ColorExtractPage() {
  const t = useTranslations("nav");
  const tColor = useTranslations("toolColor");
  const locale = useLocale();
  const [baseColor, setBaseColor] = useState("#00F2FF");
  const [hexInput, setHexInput] = useState("#00F2FF");
  const [mode, setMode] = useState<HarmonyMode>("monochromatic");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    // Valider le hex avant de l'appliquer
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setBaseColor(value);
    }
  };

  const getPalette = () => {
    const hsl = hexToHsl(baseColor);
    switch (mode) {
      case "analogous":
        return [
          hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 345) % 360, hsl.s, hsl.l),
          baseColor,
          hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        ];
      case "complementary":
        return [
          hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 30)),
          hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 15)),
          baseColor,
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(0, hsl.l - 20)),
        ];
      case "triadic":
        return [
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 120) % 360, hsl.s, Math.max(0, hsl.l - 20)),
          baseColor,
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, Math.max(0, hsl.l - 20)),
        ];
      case "monochromatic":
      default:
        return [
          hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 40)),
          hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
          baseColor,
          hslToHex(hsl.h, Math.max(0, hsl.s - 30), Math.min(100, hsl.l + 20)),
          hslToHex(hsl.h, Math.max(0, hsl.s - 50), Math.min(100, hsl.l + 40)),
        ];
    }
  };

  const palette = getPalette();

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8">
        <div className="container">
          <Reveal animation="reveal-up">
            {/* Back Link */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
            >
              <ArrowLeft size={18} />
              <span>{t("home")}</span>
            </Link>

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {t("toolColor")}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2">
                {tColor("description")}
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 mb-16">
            {/* Control Panel */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 flex flex-col gap-10 backdrop-blur-xl">
                {/* Base Color */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {tColor("baseColor")}
                  </label>
                  <div className="flex items-center gap-6 bg-white/5 p-4 rounded-xl border border-white/10">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => {
                        setBaseColor(e.target.value);
                        setHexInput(e.target.value.toUpperCase());
                      }}
                      className="min-w-[60px] min-h-[60px] rounded-xl cursor-pointer border-0 bg-transparent"
                      style={{
                        WebkitAppearance: "none",
                      }}
                    />
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) =>
                        handleHexChange(e.target.value.toUpperCase())
                      }
                      onBlur={() => setHexInput(baseColor.toUpperCase())}
                      className="font-mono text-2xl font-extrabold bg-transparent border-0 outline-none w-full uppercase"
                      maxLength={7}
                      placeholder="#00F2FF"
                    />
                  </div>
                </div>

                {/* Harmony Modes */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {tColor("harmonyMode")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: "monochromatic",
                        icon: <Layers size={18} />,
                        label: tColor("monoMode"),
                      },
                      {
                        id: "analogous",
                        icon: <Layout size={18} />,
                        label: tColor("analogousMode"),
                      },
                      {
                        id: "complementary",
                        icon: <Maximize size={18} />,
                        label: tColor("compMode"),
                      },
                      {
                        id: "triadic",
                        icon: <Grid size={18} />,
                        label: tColor("triadicMode"),
                      },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id as HarmonyMode)}
                        className={`
                          flex items-center gap-3 p-4 rounded-2xl font-semibold w-min
                          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                          ${
                            mode === m.id
                              ? "bg-kolr-cyan text-black border-kolr-cyan shadow-[0_10px_30px_rgba(0,242,255,0.3)]"
                              : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:-translate-y-0.5"
                          }
                          border
                        `}
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Palette Preview */}
            <Reveal animation="reveal-scale" delay={2}>
              <div className="flex flex-col h-[500px] rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {palette.map((color, index) => (
                  <div
                    key={`${mode}-${index}`}
                    className="flex-1 relative group transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] animate-in fade-in slide-in-from-right"
                    style={{
                      backgroundColor: color,
                      animationDelay: `${index * 100}ms`,
                      animationDuration: "600ms",
                      animationFillMode: "both",
                    }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-between px-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: getContrastColor(color) }}
                    >
                      <span className="font-mono text-xl font-extrabold">
                        {color.toUpperCase()}
                      </span>
                      <button
                        onClick={() => copyToClipboard(color, index)}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          transition-all duration-200
                          bg-black/10 border border-white/20
                          hover:bg-white/20 hover:scale-110
                          ${
                            copiedIndex === index
                              ? "!bg-white !text-black !border-white"
                              : ""
                          }
                        `}
                        style={{ color: "inherit" }}
                      >
                        {copiedIndex === index ? (
                          <Check size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helpers
function hexToHsl(hex: string) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getContrastColor(hexcolor: string) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
