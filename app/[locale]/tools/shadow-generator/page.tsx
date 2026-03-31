"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Copy,
  Check,
  RefreshCw,
  Plus,
  Minus,
  ArrowLeft,
  RotateCcw,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ColorPicker from "@/components/ColorPicker";

type ShadowType = "box" | "text";

interface ShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const DEFAULT_LAYER: ShadowLayer = {
  offsetX: 0,
  offsetY: 0,
  blur: 15,
  spread: 0,
  color: "#00f2ff",
  opacity: 100,
  inset: false,
};

const PRESETS: Record<string, ShadowLayer[]> = {
  subtle: [{ offsetX: 0, offsetY: 2, blur: 8, spread: 0, color: "#00f2ff", opacity: 40, inset: false }],
  medium: [
    { offsetX: 0, offsetY: 4, blur: 12, spread: -1, color: "#00f2ff", opacity: 50, inset: false },
    { offsetX: 0, offsetY: 2, blur: 6, spread: -2, color: "#00f2ff", opacity: 30, inset: false },
  ],
  strong: [
    { offsetX: 0, offsetY: 10, blur: 25, spread: -3, color: "#00f2ff", opacity: 60, inset: false },
    { offsetX: 0, offsetY: 4, blur: 10, spread: -4, color: "#00f2ff", opacity: 40, inset: false },
  ],
  dreamy: [
    { offsetX: 0, offsetY: 20, blur: 50, spread: -12, color: "#00f2ff", opacity: 25, inset: false },
  ],
  sharp: [
    { offsetX: 4, offsetY: 4, blur: 0, spread: 0, color: "#00f2ff", opacity: 30, inset: false },
  ],
  neon: [
    { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: "#00f2ff", opacity: 70, inset: false },
    { offsetX: 0, offsetY: 0, blur: 40, spread: 0, color: "#00f2ff", opacity: 30, inset: false },
  ],
};

function hexToRgba(hex: string, opacity: number): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

export default function ShadowGeneratorPage() {
  const t = useTranslations("toolShadow");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [shadowType, setShadowType] = useState<ShadowType>("box");
  const [layers, setLayers] = useState<ShadowLayer[]>([{ ...DEFAULT_LAYER }]);
  const [copiedType, setCopiedType] = useState<"css" | "tailwind" | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

  const generateShadowCSS = useCallback(() => {
    return layers
      .map((l) => {
        const rgba = hexToRgba(l.color, l.opacity);
        if (shadowType === "text") {
          return `${l.offsetX}px ${l.offsetY}px ${l.blur}px ${rgba}`;
        }
        return `${l.inset ? "inset " : ""}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${rgba}`;
      })
      .join(", ");
  }, [layers, shadowType]);

  const cssProperty = shadowType === "box" ? "box-shadow" : "text-shadow";
  const cssCode = `${cssProperty}: ${generateShadowCSS()};`;

  const generateTailwindCSS = useCallback(() => {
    return `[${cssProperty}:${generateShadowCSS().replace(/\s+/g, "_")}]`;
  }, [cssProperty, generateShadowCSS]);

  const tailwindCode = generateTailwindCSS();

  const copyCode = (code: string, type: "css" | "tailwind") => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const updateLayer = (index: number, updates: Partial<ShadowLayer>) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...updates } : l))
    );
  };

  const addLayer = () => {
    if (layers.length < 5) {
      setLayers([...layers, { ...DEFAULT_LAYER }]);
    }
  };

  const removeLayer = (index: number) => {
    if (layers.length > 1) {
      setLayers(layers.filter((_, i) => i !== index));
    }
  };

  const applyPreset = (presetKey: string) => {
    setLayers(PRESETS[presetKey].map((l) => ({ ...l })));
  };

  const randomize = () => {
    const count = 1 + Math.floor(Math.random() * 3);
    const newLayers: ShadowLayer[] = Array.from({ length: count }, () => ({
      offsetX: Math.floor(Math.random() * 40) - 20,
      offsetY: Math.floor(Math.random() * 40) - 10,
      blur: Math.floor(Math.random() * 50),
      spread: Math.floor(Math.random() * 20) - 10,
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      opacity: 10 + Math.floor(Math.random() * 60),
      inset: Math.random() > 0.8,
    }));
    setLayers(newLayers);
  };

  const reset = () => {
    setLayers([{ ...DEFAULT_LAYER }]);
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
                  className={`w-full aspect-square rounded-[2rem] flex items-center justify-center transition-colors duration-300 ${
                    previewTheme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl"
                  }`}
                >
                  {shadowType === "box" ? (
                    <div
                      className={`w-48 h-48 rounded-2xl transition-all duration-300 ${
                        previewTheme === "light"
                          ? "bg-gray-900 border border-gray-800"
                          : "bg-white/10 border border-white/10"
                      }`}
                      style={{ boxShadow: generateShadowCSS() }}
                    />
                  ) : (
                    <p
                      className={`text-5xl font-black tracking-tight transition-all duration-300 ${
                        previewTheme === "light" ? "text-gray-900" : "text-white"
                      }`}
                      style={{ textShadow: generateShadowCSS() }}
                    >
                      {t("previewText")}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Controls */}
            <Reveal animation="reveal-up" delay={2}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 flex flex-col gap-8 backdrop-blur-xl">
                {/* Shadow Type */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {(["box", "text"] as ShadowType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setShadowType(type)}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 border ${
                          shadowType === type
                            ? "bg-kolr-cyan text-black border-kolr-cyan"
                            : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {type === "box" ? t("boxShadow") : t("textShadow")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Presets */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("presets")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(PRESETS).map((key) => (
                      <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white/5 border border-white/10 text-kolr-text-muted hover:bg-white/10 hover:text-white hover:border-kolr-cyan transition-all duration-300"
                      >
                        {t(`preset${key.charAt(0).toUpperCase() + key.slice(1)}` as "presetSubtle" | "presetMedium" | "presetStrong" | "presetDreamy" | "presetSharp" | "presetNeon")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layers */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("layers")} ({layers.length}/5)
                  </label>
                  <div className="flex flex-col gap-4">
                    {layers.map((layer, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">
                            {t("layers")} {index + 1}
                          </span>
                          {layers.length > 1 && (
                            <button
                              onClick={() => removeLayer(index)}
                              aria-label={t("removeShadow")}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-kolr-red/20 hover:text-kolr-red transition-all duration-200"
                            >
                              <Minus size={14} />
                            </button>
                          )}
                        </div>

                        {/* Offset X */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-kolr-text-muted font-semibold">{t("offsetX")}</span>
                            <span className="font-mono font-bold">{layer.offsetX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={layer.offsetX}
                            onChange={(e) => updateLayer(index, { offsetX: Number(e.target.value) })}
                            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                          />
                        </div>

                        {/* Offset Y */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-kolr-text-muted font-semibold">{t("offsetY")}</span>
                            <span className="font-mono font-bold">{layer.offsetY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={layer.offsetY}
                            onChange={(e) => updateLayer(index, { offsetY: Number(e.target.value) })}
                            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                          />
                        </div>

                        {/* Blur */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-kolr-text-muted font-semibold">{t("blur")}</span>
                            <span className="font-mono font-bold">{layer.blur}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={layer.blur}
                            onChange={(e) => updateLayer(index, { blur: Number(e.target.value) })}
                            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                          />
                        </div>

                        {/* Spread (box-shadow only) */}
                        {shadowType === "box" && (
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-kolr-text-muted font-semibold">{t("spread")}</span>
                              <span className="font-mono font-bold">{layer.spread}px</span>
                            </div>
                            <input
                              type="range"
                              min="-50"
                              max="50"
                              value={layer.spread}
                              onChange={(e) => updateLayer(index, { spread: Number(e.target.value) })}
                              className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                            />
                          </div>
                        )}

                        {/* Color & Opacity */}
                        <div className="flex items-center gap-4">
                          <ColorPicker
                            value={layer.color}
                            onChange={(c) => updateLayer(index, { color: c })}
                            size="md"
                          />
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-kolr-text-muted font-semibold">{t("opacity")}</span>
                              <span className="font-mono font-bold">{layer.opacity}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={layer.opacity}
                              onChange={(e) => updateLayer(index, { opacity: Number(e.target.value) })}
                              className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                            />
                          </div>
                        </div>

                        {/* Inset (box-shadow only) */}
                        {shadowType === "box" && (
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={layer.inset}
                              onChange={(e) => updateLayer(index, { inset: e.target.checked })}
                              className="w-5 h-5 rounded accent-kolr-cyan"
                            />
                            <span className="text-sm font-bold">{t("inset")}</span>
                          </label>
                        )}
                      </div>
                    ))}

                    {layers.length < 5 && (
                      <button
                        onClick={addLayer}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-kolr-text-muted hover:text-white hover:border-kolr-cyan transition-all duration-300"
                      >
                        <Plus size={16} />
                        <span className="text-sm font-bold">{t("addShadow")}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CSS Code */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    CSS
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <code className="flex-1 font-mono text-sm text-kolr-cyan break-all">
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
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
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
