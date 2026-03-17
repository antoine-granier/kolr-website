"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Eye, RotateCcw, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// Color blindness simulation matrices
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((c) =>
      Math.max(0, Math.min(255, Math.round(c)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function simulateColorBlindness(hex: string, type: string): string {
  const [r, g, b] = hexToRgb(hex);
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;

  // Linearize sRGB
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = linearize(rn),
    gl = linearize(gn),
    bl = linearize(bn);

  let sr: number, sg: number, sb: number;

  switch (type) {
    case "protanopia":
      sr = 0.567 * rl + 0.433 * gl + 0.0 * bl;
      sg = 0.558 * rl + 0.442 * gl + 0.0 * bl;
      sb = 0.0 * rl + 0.242 * gl + 0.758 * bl;
      break;
    case "deuteranopia":
      sr = 0.625 * rl + 0.375 * gl + 0.0 * bl;
      sg = 0.7 * rl + 0.3 * gl + 0.0 * bl;
      sb = 0.0 * rl + 0.3 * gl + 0.7 * bl;
      break;
    case "tritanopia":
      sr = 0.95 * rl + 0.05 * gl + 0.0 * bl;
      sg = 0.0 * rl + 0.433 * gl + 0.567 * bl;
      sb = 0.0 * rl + 0.475 * gl + 0.525 * bl;
      break;
    case "achromatopsia":
      const gray = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
      sr = gray;
      sg = gray;
      sb = gray;
      break;
    default:
      sr = rl;
      sg = gl;
      sb = bl;
  }

  // De-linearize
  const delinearize = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return rgbToHex(
    Math.round(delinearize(sr) * 255),
    Math.round(delinearize(sg) * 255),
    Math.round(delinearize(sb) * 255),
  );
}

const DEFAULT_COLORS = ["#FF4D4D", "#00F2FF", "#2EFFB0", "#BF5AF2", "#FF9F68"];

type SimType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

export default function ColorblindPage() {
  const t = useTranslations("toolColorblind");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const simTypes: { key: SimType; color: string }[] = [
    { key: "protanopia", color: "var(--kolr-red)" },
    { key: "deuteranopia", color: "var(--kolr-green)" },
    { key: "tritanopia", color: "var(--kolr-cyan)" },
    { key: "achromatopsia", color: "var(--kolr-text-muted)" },
  ];

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const resetColors = () => setColors(DEFAULT_COLORS);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const getContrastColor = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#ffffff";
  };

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

          {/* Original Palette */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted flex items-center gap-2">
                  <Eye size={16} />
                  {t("originalPalette")}
                </label>
                <button
                  onClick={resetColors}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 hover:border-kolr-cyan transition-all"
                >
                  <RotateCcw size={14} />
                  {t("reset")}
                </button>
              </div>
              <div className="flex rounded-[2rem] overflow-hidden border-4 border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-24 md:h-32 flex flex-col items-center justify-center gap-2 cursor-pointer group relative"
                    style={{ backgroundColor: color }}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(i, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span
                      className="text-xs md:text-sm font-bold font-mono opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ color: getContrastColor(color) }}
                    >
                      {color.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-kolr-text-muted mt-2 text-center">
                {t("editColors")}
              </p>
            </div>
          </Reveal>

          {/* Simulations */}
          <Reveal animation="reveal-scale" delay={2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {simTypes.map(({ key, color }) => (
                <div
                  key={key}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <h3 className="font-bold text-white">{t(key)}</h3>
                      <p className="text-xs text-kolr-text-muted">
                        {t(`${key}Desc`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex rounded-xl overflow-hidden border border-white/10">
                    {colors.map((c, i) => {
                      const simulated = simulateColorBlindness(c, key);
                      return (
                        <button
                          key={i}
                          onClick={() => copyHex(simulated)}
                          className="flex-1 h-16 md:h-20 flex items-center justify-center group relative"
                          style={{ backgroundColor: simulated }}
                        >
                          <span
                            className="text-[10px] md:text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: getContrastColor(simulated) }}
                          >
                            {copiedHex === simulated ? (
                              <Check size={14} />
                            ) : (
                              simulated.toUpperCase()
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
