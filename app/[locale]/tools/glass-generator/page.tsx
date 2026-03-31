"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Copy,
  Check,
  RefreshCw,
  ArrowLeft,
  RotateCcw,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ColorPicker from "@/components/ColorPicker";

type EffectType = "glass" | "neumorphism";
type NeuShape = "flat" | "concave" | "convex" | "pressed";

interface GlassSettings {
  blur: number;
  opacity: number;
  borderRadius: number;
  borderOpacity: number;
  color: string;
}

interface NeuSettings {
  color: string;
  intensity: number;
  blur: number;
  distance: number;
  borderRadius: number;
  shape: NeuShape;
}

const DEFAULT_GLASS: GlassSettings = {
  blur: 16,
  opacity: 20,
  borderRadius: 16,
  borderOpacity: 30,
  color: "#00f2ff",
};

const DEFAULT_NEU: NeuSettings = {
  color: "#1a1a2e",
  intensity: 40,
  blur: 30,
  distance: 10,
  borderRadius: 20,
  shape: "flat",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "");
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

function adjustBrightness(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `rgb(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)})`;
}

export default function GlassGeneratorPage() {
  const t = useTranslations("toolGlass");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [effectType, setEffectType] = useState<EffectType>("glass");
  const [glass, setGlass] = useState<GlassSettings>({ ...DEFAULT_GLASS });
  const [neu, setNeu] = useState<NeuSettings>({ ...DEFAULT_NEU });
  const [copiedType, setCopiedType] = useState<"css" | "tailwind" | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

  const generateGlassCSS = useCallback(() => {
    const { r, g, b } = hexToRgb(glass.color);
    return [
      `background: rgba(${r}, ${g}, ${b}, ${(glass.opacity / 100).toFixed(2)})`,
      `backdrop-filter: blur(${glass.blur}px)`,
      `-webkit-backdrop-filter: blur(${glass.blur}px)`,
      `border-radius: ${glass.borderRadius}px`,
      `border: 1px solid rgba(255, 255, 255, ${(glass.borderOpacity / 100).toFixed(2)})`,
    ].join(";\n") + ";";
  }, [glass]);

  const generateNeuCSS = useCallback(() => {
    const lightShadow = adjustBrightness(neu.color, Math.round(neu.intensity * 0.6));
    const darkShadow = adjustBrightness(neu.color, -Math.round(neu.intensity * 0.6));
    const { r, g, b } = hexToRgb(neu.color);

    let bgGradient = `background: rgb(${r}, ${g}, ${b})`;
    if (neu.shape === "concave") {
      bgGradient = `background: linear-gradient(145deg, ${adjustBrightness(neu.color, -15)}, ${adjustBrightness(neu.color, 15)})`;
    } else if (neu.shape === "convex") {
      bgGradient = `background: linear-gradient(145deg, ${adjustBrightness(neu.color, 15)}, ${adjustBrightness(neu.color, -15)})`;
    }

    const shadow =
      neu.shape === "pressed"
        ? `box-shadow: inset ${neu.distance}px ${neu.distance}px ${neu.blur}px ${darkShadow}, inset -${neu.distance}px -${neu.distance}px ${neu.blur}px ${lightShadow}`
        : `box-shadow: ${neu.distance}px ${neu.distance}px ${neu.blur}px ${darkShadow}, -${neu.distance}px -${neu.distance}px ${neu.blur}px ${lightShadow}`;

    return [bgGradient, `border-radius: ${neu.borderRadius}px`, shadow].join(";\n") + ";";
  }, [neu]);

  const cssCode = effectType === "glass" ? generateGlassCSS() : generateNeuCSS();

  const generateTailwindCSS = useCallback(() => {
    if (effectType === "glass") {
      const { r, g, b } = hexToRgb(glass.color);
      return `bg-[rgba(${r},${g},${b},${(glass.opacity / 100).toFixed(2)})] backdrop-blur-[${glass.blur}px] rounded-[${glass.borderRadius}px] border border-white/${glass.borderOpacity}`;
    }
    return `[${generateNeuCSS().replace(/\n/g, "").replace(/;\s*/g, ";").replace(/\s+/g, "_")}]`;
  }, [effectType, glass, generateNeuCSS]);

  const tailwindCode = generateTailwindCSS();

  const copyCode = (code: string, type: "css" | "tailwind") => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const randomize = () => {
    const randColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    if (effectType === "glass") {
      setGlass({
        blur: 8 + Math.floor(Math.random() * 24),
        opacity: 10 + Math.floor(Math.random() * 40),
        borderRadius: 8 + Math.floor(Math.random() * 30),
        borderOpacity: 10 + Math.floor(Math.random() * 50),
        color: randColor,
      });
    } else {
      const shapes: NeuShape[] = ["flat", "concave", "convex", "pressed"];
      setNeu({
        color: randColor,
        intensity: 20 + Math.floor(Math.random() * 50),
        blur: 15 + Math.floor(Math.random() * 40),
        distance: 5 + Math.floor(Math.random() * 20),
        borderRadius: 10 + Math.floor(Math.random() * 30),
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
  };

  const reset = () => {
    if (effectType === "glass") {
      setGlass({ ...DEFAULT_GLASS });
    } else {
      setNeu({ ...DEFAULT_NEU });
    }
  };

  const glassPreviewStyle = (): React.CSSProperties => {
    const { r, g, b } = hexToRgb(glass.color);
    return {
      background: `rgba(${r}, ${g}, ${b}, ${glass.opacity / 100})`,
      backdropFilter: `blur(${glass.blur}px)`,
      WebkitBackdropFilter: `blur(${glass.blur}px)`,
      borderRadius: `${glass.borderRadius}px`,
      border: `1px solid rgba(255, 255, 255, ${glass.borderOpacity / 100})`,
    };
  };

  const neuPreviewStyle = (): React.CSSProperties => {
    const lightShadow = adjustBrightness(neu.color, Math.round(neu.intensity * 0.6));
    const darkShadow = adjustBrightness(neu.color, -Math.round(neu.intensity * 0.6));
    const { r, g, b } = hexToRgb(neu.color);

    let bg: string = `rgb(${r}, ${g}, ${b})`;
    if (neu.shape === "concave") {
      bg = `linear-gradient(145deg, ${adjustBrightness(neu.color, -15)}, ${adjustBrightness(neu.color, 15)})`;
    } else if (neu.shape === "convex") {
      bg = `linear-gradient(145deg, ${adjustBrightness(neu.color, 15)}, ${adjustBrightness(neu.color, -15)})`;
    }

    const shadow =
      neu.shape === "pressed"
        ? `inset ${neu.distance}px ${neu.distance}px ${neu.blur}px ${darkShadow}, inset -${neu.distance}px -${neu.distance}px ${neu.blur}px ${lightShadow}`
        : `${neu.distance}px ${neu.distance}px ${neu.blur}px ${darkShadow}, -${neu.distance}px -${neu.distance}px ${neu.blur}px ${lightShadow}`;

    return {
      background: bg,
      borderRadius: `${neu.borderRadius}px`,
      boxShadow: shadow,
    };
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Preview */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("preview")}
                  </label>
                  <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setPreviewTheme("dark")}
                      aria-label="Dark preview"
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        previewTheme === "dark"
                          ? "bg-white/10 text-white"
                          : "text-kolr-text-muted hover:text-white"
                      }`}
                    >
                      <Moon size={14} />
                    </button>
                    <button
                      onClick={() => setPreviewTheme("light")}
                      aria-label="Light preview"
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        previewTheme === "light"
                          ? "bg-white/10 text-white"
                          : "text-kolr-text-muted hover:text-white"
                      }`}
                    >
                      <Sun size={14} />
                    </button>
                  </div>
                </div>
                <div
                  className={`w-full aspect-square rounded-[2rem] flex items-center justify-center transition-colors duration-300 overflow-hidden relative ${
                    previewTheme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
                  }`}
                >
                  {/* Background decoration for glass effect */}
                  {effectType === "glass" && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className="absolute w-32 h-32 rounded-full opacity-60"
                        style={{
                          background: "var(--kolr-cyan)",
                          top: "15%",
                          left: "15%",
                          filter: "blur(20px)",
                        }}
                      />
                      <div
                        className="absolute w-40 h-40 rounded-full opacity-50"
                        style={{
                          background: "var(--kolr-purple)",
                          bottom: "15%",
                          right: "15%",
                          filter: "blur(20px)",
                        }}
                      />
                      <div
                        className="absolute w-24 h-24 rounded-full opacity-40"
                        style={{
                          background: "var(--kolr-green)",
                          top: "50%",
                          left: "60%",
                          filter: "blur(15px)",
                        }}
                      />
                    </div>
                  )}

                  {/* Neumorphism background fill */}
                  {effectType === "neumorphism" && (
                    <div
                      className="absolute inset-0"
                      style={{ background: `rgb(${hexToRgb(neu.color).r}, ${hexToRgb(neu.color).g}, ${hexToRgb(neu.color).b})` }}
                    />
                  )}

                  {/* Card */}
                  <div
                    className="relative w-56 h-56 flex flex-col items-center justify-center gap-3 transition-all duration-300"
                    style={effectType === "glass" ? glassPreviewStyle() : neuPreviewStyle()}
                  >
                    <span
                      className={`text-lg font-bold ${
                        effectType === "neumorphism"
                          ? ""
                          : previewTheme === "light"
                            ? "text-gray-900"
                            : "text-white"
                      }`}
                      style={
                        effectType === "neumorphism"
                          ? { color: adjustBrightness(neu.color, 80) }
                          : undefined
                      }
                    >
                      {t("previewText")}
                    </span>
                    <span
                      className={`text-sm text-center px-4 ${
                        effectType === "neumorphism"
                          ? ""
                          : previewTheme === "light"
                            ? "text-gray-500"
                            : "text-white/60"
                      }`}
                      style={
                        effectType === "neumorphism"
                          ? { color: adjustBrightness(neu.color, 50) }
                          : undefined
                      }
                    >
                      {t("previewDesc")}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Controls */}
            <Reveal animation="reveal-up" delay={2}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 flex flex-col gap-8 backdrop-blur-xl">
                {/* Effect Type */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {(["glass", "neumorphism"] as EffectType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setEffectType(type)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 border ${
                          effectType === type
                            ? "bg-kolr-cyan text-black border-kolr-cyan"
                            : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {t(type)}
                      </button>
                    ))}
                  </div>
                </div>

                {effectType === "glass" ? (
                  <>
                    {/* Glass Color */}
                    <div className="flex flex-col gap-4">
                      <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                        {t("color")}
                      </label>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <ColorPicker
                          value={glass.color}
                          onChange={(c) => setGlass({ ...glass, color: c })}
                          size="md"
                        />
                        <input
                          type="text"
                          value={glass.color.toUpperCase()}
                          onChange={(e) => setGlass({ ...glass, color: e.target.value })}
                          className="flex-1 font-mono text-lg font-extrabold bg-transparent border-0 outline-none uppercase"
                        />
                      </div>
                    </div>

                    {/* Blur */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("blur")}</span>
                        <span className="font-mono font-bold">{glass.blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={glass.blur}
                        onChange={(e) => setGlass({ ...glass, blur: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>

                    {/* Opacity */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("opacity")}</span>
                        <span className="font-mono font-bold">{glass.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={glass.opacity}
                        onChange={(e) => setGlass({ ...glass, opacity: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>

                    {/* Border Radius */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("borderRadius")}</span>
                        <span className="font-mono font-bold">{glass.borderRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={glass.borderRadius}
                        onChange={(e) => setGlass({ ...glass, borderRadius: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>

                    {/* Border Opacity */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("borderOpacity")}</span>
                        <span className="font-mono font-bold">{glass.borderOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={glass.borderOpacity}
                        onChange={(e) => setGlass({ ...glass, borderOpacity: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Neu Color */}
                    <div className="flex flex-col gap-4">
                      <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                        {t("color")}
                      </label>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <ColorPicker
                          value={neu.color}
                          onChange={(c) => setNeu({ ...neu, color: c })}
                          size="md"
                        />
                        <input
                          type="text"
                          value={neu.color.toUpperCase()}
                          onChange={(e) => setNeu({ ...neu, color: e.target.value })}
                          className="flex-1 font-mono text-lg font-extrabold bg-transparent border-0 outline-none uppercase"
                        />
                      </div>
                    </div>

                    {/* Shape */}
                    <div className="flex flex-col gap-4">
                      <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                        {t("shape")}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["flat", "concave", "convex", "pressed"] as NeuShape[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => setNeu({ ...neu, shape: s })}
                            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-300 border ${
                              neu.shape === s
                                ? "bg-kolr-cyan text-black border-kolr-cyan"
                                : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {t(s)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Intensity */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("intensity")}</span>
                        <span className="font-mono font-bold">{neu.intensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={neu.intensity}
                        onChange={(e) => setNeu({ ...neu, intensity: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>

                    {/* Distance */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("distance")}</span>
                        <span className="font-mono font-bold">{neu.distance}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        value={neu.distance}
                        onChange={(e) => setNeu({ ...neu, distance: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>

                    {/* Blur */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("blur")}</span>
                        <span className="font-mono font-bold">{neu.blur}px</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={neu.blur}
                        onChange={(e) => setNeu({ ...neu, blur: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>

                    {/* Border Radius */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-kolr-text-muted font-bold uppercase tracking-widest">{t("borderRadius")}</span>
                        <span className="font-mono font-bold">{neu.borderRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={neu.borderRadius}
                        onChange={(e) => setNeu({ ...neu, borderRadius: Number(e.target.value) })}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                      />
                    </div>
                  </>
                )}

                {/* CSS Code */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    CSS
                  </label>
                  <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <code className="flex-1 font-mono text-sm text-kolr-cyan break-all whitespace-pre-wrap">
                      {cssCode}
                    </code>
                    <button
                      onClick={() => copyCode(cssCode, "css")}
                      aria-label={t("copyCss")}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedType === "css"
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedType === "css" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Tailwind Code */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    Tailwind
                  </label>
                  <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <code className="flex-1 font-mono text-sm text-kolr-purple break-all">
                      {tailwindCode}
                    </code>
                    <button
                      onClick={() => copyCode(tailwindCode, "tailwind")}
                      aria-label={t("copyTailwind")}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedType === "tailwind"
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedType === "tailwind" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={randomize}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-kolr-purple transition-all duration-300 group"
                  >
                    <RefreshCw
                      size={18}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    {t("randomize")}
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-kolr-text-muted hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    <RotateCcw size={16} />
                    {t("reset")}
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main></div>
  );
}
