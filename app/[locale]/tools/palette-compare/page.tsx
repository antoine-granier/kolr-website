"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, RefreshCw, Copy, Check } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ColorPicker from "@/components/ColorPicker";

function randomHex(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`.toUpperCase();
}

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
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


function harmonyScore(colors: string[]): number {
  const hues = colors.map((c) => hexToHsl(c)[0]);
  let totalDist = 0;
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const dist = Math.min(Math.abs(hues[i] - hues[j]), 360 - Math.abs(hues[i] - hues[j]));
      totalDist += dist;
    }
  }
  const avgDist = totalDist / (hues.length * (hues.length - 1) / 2);
  // Ideal spread is ~72 (360/5), score based on proximity to ideal
  return Math.max(0, Math.min(100, 100 - Math.abs(avgDist - 72) * 1.2));
}

function generatePalette(): string[] {
  return Array.from({ length: 5 }, () => randomHex());
}

export default function PaletteComparePage() {
  const t = useTranslations("toolCompare");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [paletteA, setPaletteA] = useState<string[]>(["#FF4D4D", "#FF9F68", "#FFD93D", "#2EFFB0", "#00F2FF"]);
  const [paletteB, setPaletteB] = useState<string[]>(["#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899"]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const updateColor = (palette: "a" | "b", index: number, value: string) => {
    if (palette === "a") {
      const updated = [...paletteA];
      updated[index] = value;
      setPaletteA(updated);
    } else {
      const updated = [...paletteB];
      updated[index] = value;
      setPaletteB(updated);
    }
  };

  const scoreA = Math.round(harmonyScore(paletteA));
  const scoreB = Math.round(harmonyScore(paletteB));

  // Find shared/unique colors (approximate match within threshold)
  const shared = paletteA.filter((ca) =>
    paletteB.some((cb) => ca.toUpperCase() === cb.toUpperCase())
  );

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8 pb-16">
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

          {/* Two Palettes Side by Side */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {(["a", "b"] as const).map((side) => {
                const palette = side === "a" ? paletteA : paletteB;
                const setPalette = side === "a" ? setPaletteA : setPaletteB;
                const label = side === "a" ? t("paletteA") : t("paletteB");
                const score = side === "a" ? scoreA : scoreB;

                return (
                  <div key={side} className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                      <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                        {label}
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-kolr-text-muted">
                          {t("harmony")}: <span className={`font-bold ${score >= 60 ? "text-kolr-green" : score >= 30 ? "text-kolr-orange" : "text-kolr-red"}`}>{score}</span>
                        </span>
                        <button
                          onClick={() => setPalette(generatePalette())}
                          aria-label="Randomize palette"
                          className="p-2 rounded-lg bg-white/5 text-kolr-text-muted hover:text-white transition-colors group"
                        >
                          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                        <button
                          onClick={() => copy(palette.join(", "), `copy-${side}`)}
                          aria-label="Copy palette"
                          className={`p-2 rounded-lg transition-colors ${copiedKey === `copy-${side}` ? "bg-kolr-green/10 text-kolr-green" : "bg-white/5 text-kolr-text-muted hover:text-white"}`}
                        >
                          {copiedKey === `copy-${side}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Color strip */}
                    <div className="flex rounded-xl overflow-hidden h-16 mb-4 border border-white/10">
                      {palette.map((color, i) => (
                        <ColorPicker key={i} value={color} onChange={(c) => updateColor(side, i, c)}>
                          <div
                            className="flex-1 h-16 flex items-center justify-center group"
                            style={{ backgroundColor: color }}
                          >
                            <span
                              className="text-[9px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                              style={{ color: (parseInt(color.replace("#","").substring(0,2),16)*299 + parseInt(color.replace("#","").substring(2,4),16)*587 + parseInt(color.replace("#","").substring(4,6),16)*114)/1000 >= 128 ? "#000" : "#fff" }}
                            >
                              {color}
                            </span>
                          </div>
                        </ColorPicker>
                      ))}
                    </div>

                    {/* Hex inputs */}
                    <div className="grid grid-cols-5 gap-2">
                      {palette.map((color, i) => (
                        <input
                          key={i}
                          type="text"
                          value={color}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            if (/^#[0-9A-F]{0,6}$/i.test(val)) updateColor(side, i, val);
                          }}
                          className="bg-white/5 border border-white/10 rounded-lg px-1.5 py-1.5 text-[10px] font-mono text-center text-white outline-none focus:border-kolr-cyan transition-colors"
                          maxLength={7}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Comparison */}
          <Reveal animation="reveal-up" delay={2}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-6">
                {t("compare")}
              </label>

              {/* Side by side strips */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-kolr-text-muted w-6">A</span>
                  <div className="flex-1 flex rounded-lg overflow-hidden h-10 border border-white/10">
                    {paletteA.map((color, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-kolr-text-muted w-6">B</span>
                  <div className="flex-1 flex rounded-lg overflow-hidden h-10 border border-white/10">
                    {paletteB.map((color, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">
                    {t("harmony")} A
                  </span>
                  <span className={`text-2xl font-black ${scoreA >= 60 ? "text-kolr-green" : scoreA >= 30 ? "text-kolr-orange" : "text-kolr-red"}`}>
                    {scoreA}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">
                    {t("shared")}
                  </span>
                  <span className="text-2xl font-black text-kolr-cyan">
                    {shared.length}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">
                    {t("harmony")} B
                  </span>
                  <span className={`text-2xl font-black ${scoreB >= 60 ? "text-kolr-green" : scoreB >= 30 ? "text-kolr-orange" : "text-kolr-red"}`}>
                    {scoreB}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
