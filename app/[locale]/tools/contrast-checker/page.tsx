"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function ContrastCheckerPage() {
  const t = useTranslations("nav");
  const tContrast = useTranslations("toolContrast");
  const locale = useLocale();
  const [foreground, setForeground] = useState("#00F2FF");
  const [background, setBackground] = useState("#000000");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Calculer le ratio de contraste
  const getRelativeLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrastRatio = () => {
    const l1 = getRelativeLuminance(foreground);
    const l2 = getRelativeLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const ratio = getContrastRatio();
  const ratioFormatted = ratio.toFixed(2);

  // Standards WCAG
  const wcagAA = {
    largeText: ratio >= 3,
    normalText: ratio >= 4.5,
  };

  const wcagAAA = {
    largeText: ratio >= 4.5,
    normalText: ratio >= 7,
  };

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
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
              <span>{t("home")}</span>
            </Link>

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {tContrast("title")}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2">
                {tContrast("description")}
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 mb-16">
            {/* Controls */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 flex flex-col gap-8 backdrop-blur-xl">
                {/* Foreground Color */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {tContrast("foreground")}
                  </label>
                  <div className="flex items-center gap-6 bg-white/5 p-4 rounded-xl border border-white/10">
                    <input
                      type="color"
                      value={foreground}
                      onChange={(e) =>
                        setForeground(e.target.value.toUpperCase())
                      }
                      className="min-w-[60px] min-h-[60px] rounded-xl cursor-pointer border-0 bg-transparent"
                      style={{ WebkitAppearance: "none" }}
                    />
                    <input
                      type="text"
                      value={foreground}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                          setForeground(val);
                        }
                      }}
                      className="font-mono text-2xl font-extrabold bg-transparent border-0 outline-none w-full uppercase"
                      maxLength={7}
                      placeholder="#FFFFFF"
                    />
                    <button
                      onClick={() => copyToClipboard(foreground, 0)}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedIndex === 0
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedIndex === 0 ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Background Color */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {tContrast("background")}
                  </label>
                  <div className="flex items-center gap-6 bg-white/5 p-4 rounded-xl border border-white/10">
                    <input
                      type="color"
                      value={background}
                      onChange={(e) =>
                        setBackground(e.target.value.toUpperCase())
                      }
                      className="min-w-[60px] min-h-[60px] rounded-xl cursor-pointer border-0 bg-transparent"
                      style={{ WebkitAppearance: "none" }}
                    />
                    <input
                      type="text"
                      value={background}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                          setBackground(val);
                        }
                      }}
                      className="font-mono text-2xl font-extrabold bg-transparent border-0 outline-none w-full uppercase"
                      maxLength={7}
                      placeholder="#000000"
                    />
                    <button
                      onClick={() => copyToClipboard(background, 1)}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedIndex === 1
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedIndex === 1 ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  onClick={swapColors}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/10 hover:border-kolr-cyan"
                >
                  <Eye size={20} />
                  <span>{tContrast("swapColors")}</span>
                </button>
              </div>
            </Reveal>

            {/* Results */}
            <Reveal animation="reveal-scale" delay={2}>
              <div className="flex flex-col gap-6">
                {/* Preview */}
                <div
                  className="rounded-[2rem] p-12 flex flex-col items-center justify-center gap-6 min-h-[300px] border-4 transition-all duration-300"
                  style={{
                    backgroundColor: background,
                    color: foreground,
                    borderColor: foreground + "30",
                  }}
                >
                  <h2
                    className="text-5xl font-black text-center"
                    style={{ color: foreground }}
                  >
                    Aa
                  </h2>
                  <p
                    className="text-xl text-center"
                    style={{ color: foreground }}
                  >
                    {tContrast("sampleTextLarge")}
                  </p>
                  <p
                    className="text-sm text-center"
                    style={{ color: foreground }}
                  >
                    {tContrast("sampleTextSmall")}
                  </p>
                </div>

                {/* Ratio */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl text-center">
                  <p className="text-sm uppercase tracking-widest text-kolr-text-muted mb-2">
                    {tContrast("contrastRatio")}
                  </p>
                  <p className="text-6xl font-black mb-2">{ratioFormatted}:1</p>
                  <p className="text-kolr-text-muted text-sm">
                    {ratio >= 7
                      ? tContrast("excellent")
                      : ratio >= 4.5
                      ? tContrast("good")
                      : ratio >= 3
                      ? tContrast("fair")
                      : tContrast("poor")}
                  </p>
                </div>

                {/* WCAG Standards */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-bold mb-6">{tContrast("wcagCompliance")}</h3>

                  <div className="space-y-4">
                    {/* AA Normal */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        {wcagAA.normalText ? (
                          <CheckCircle size={24} className="text-kolr-green" />
                        ) : (
                          <AlertCircle size={24} className="text-kolr-orange" />
                        )}
                        <div>
                          <p className="font-bold">{tContrast("aaNormal")}</p>
                          <p className="text-xs text-kolr-text-muted">
                            {tContrast("min45")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          wcagAA.normalText
                            ? "text-kolr-green"
                            : "text-kolr-orange"
                        }`}
                      >
                        {wcagAA.normalText ? tContrast("pass") : tContrast("fail")}
                      </span>
                    </div>

                    {/* AA Large */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        {wcagAA.largeText ? (
                          <CheckCircle size={24} className="text-kolr-green" />
                        ) : (
                          <AlertCircle size={24} className="text-kolr-orange" />
                        )}
                        <div>
                          <p className="font-bold">{tContrast("aaLarge")}</p>
                          <p className="text-xs text-kolr-text-muted">
                            {tContrast("min3")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          wcagAA.largeText
                            ? "text-kolr-green"
                            : "text-kolr-orange"
                        }`}
                      >
                        {wcagAA.largeText ? tContrast("pass") : tContrast("fail")}
                      </span>
                    </div>

                    {/* AAA Normal */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        {wcagAAA.normalText ? (
                          <CheckCircle size={24} className="text-kolr-green" />
                        ) : (
                          <AlertCircle size={24} className="text-kolr-orange" />
                        )}
                        <div>
                          <p className="font-bold">{tContrast("aaaNormal")}</p>
                          <p className="text-xs text-kolr-text-muted">
                            {tContrast("min7")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          wcagAAA.normalText
                            ? "text-kolr-green"
                            : "text-kolr-orange"
                        }`}
                      >
                        {wcagAAA.normalText ? tContrast("pass") : tContrast("fail")}
                      </span>
                    </div>

                    {/* AAA Large */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        {wcagAAA.largeText ? (
                          <CheckCircle size={24} className="text-kolr-green" />
                        ) : (
                          <AlertCircle size={24} className="text-kolr-orange" />
                        )}
                        <div>
                          <p className="font-bold">{tContrast("aaaLarge")}</p>
                          <p className="text-xs text-kolr-text-muted">
                            {tContrast("min45")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          wcagAAA.largeText
                            ? "text-kolr-green"
                            : "text-kolr-orange"
                        }`}
                      >
                        {wcagAAA.largeText ? tContrast("pass") : tContrast("fail")}
                      </span>
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
