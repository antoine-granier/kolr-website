"use client";

import { useState, useEffect, startTransition, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Share2, Copy, Check, Link, Plus, X, ArrowLeft } from "lucide-react";
import NextLink from "next/link";
import Reveal from "@/components/Reveal";
import PaletteExport from "@/components/PaletteExport";
import PaletteHistory from "@/components/PaletteHistory";
import { addToHistory } from "@/components/PaletteHistory";

function SharePageContent() {
  const t = useTranslations("share");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [sharedColors, setSharedColors] = useState<string[]>([]);
  const [editColors, setEditColors] = useState<string[]>([
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#FFD733",
  ]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [colorCopied, setColorCopied] = useState<number | null>(null);

  useEffect(() => {
    const colorsParam = searchParams.get("colors");
    if (colorsParam) {
      const parsed = colorsParam
        .split(",")
        .map((c) => {
          const hex = c.replace("#", "").trim();
          return `#${hex}`;
        })
        .filter((c) => /^#[0-9A-Fa-f]{3,8}$/.test(c));
      if (parsed.length > 0) {
        startTransition(() => {
          setSharedColors(parsed);
        });
        addToHistory(parsed);
      }
    }
  }, [searchParams]);

  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setColorCopied(index);
    setTimeout(() => setColorCopied(null), 1500);
  };

  const generateShareLink = () => {
    const colorsStr = editColors.map((c) => c.replace("#", "")).join(",");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/${locale}/share?colors=${colorsStr}`;
    setGeneratedLink(link);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const updateColor = (index: number, value: string) => {
    const updated = [...editColors];
    updated[index] = value;
    setEditColors(updated);
    setGeneratedLink("");
  };

  const addColor = () => {
    if (editColors.length < 8) {
      setEditColors([...editColors, "#888888"]);
      setGeneratedLink("");
    }
  };

  const removeColor = (index: number) => {
    if (editColors.length > 2) {
      setEditColors(editColors.filter((_, i) => i !== index));
      setGeneratedLink("");
    }
  };

  const handleRestore = (colors: string[]) => {
    setEditColors(colors);
    setSharedColors(colors);
    setGeneratedLink("");
  };

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? "#000000" : "#ffffff";
  };

  const displayColors = sharedColors.length > 0 ? sharedColors : [];

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8">
        <div className="container max-w-[900px]">
          <Reveal animation="reveal-up">
            <NextLink
              href={`/${locale}`}
              className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
            >
              <ArrowLeft size={18} />
              <span>{tNav("home")}</span>
            </NextLink>

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {t("title")}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2">
                {t("description")}
              </p>
            </header>
          </Reveal>

          {/* Shared Palette Display */}
          {displayColors.length > 0 && (
            <Reveal animation="reveal-up" delay={1}>
              <div className="mb-12">
                <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted flex items-center gap-2 mb-4">
                  <Link size={16} className="text-kolr-cyan" />
                  {t("sharedPalette")}
                </label>
                <div className="rounded-[2rem] overflow-hidden border-4 border-white/[0.08]">
                  {/* Large color swatches */}
                  <div className="flex h-32 md:h-40">
                    {displayColors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-[1.3]"
                        style={{ backgroundColor: color }}
                        onClick={() => copyColor(color, i)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-md text-sm font-bold"
                            style={{
                              backgroundColor: `${getContrastColor(color)}20`,
                              color: getContrastColor(color),
                            }}
                          >
                            {colorCopied === i ? (
                              <Check size={14} />
                            ) : (
                              <Copy size={14} />
                            )}
                            {colorCopied === i
                              ? t("colorCopied")
                              : color.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Hex codes row */}
                  <div className="flex border-t border-white/[0.08] bg-white/[0.03]">
                    {displayColors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 text-center py-3 text-xs font-mono text-kolr-text-muted border-r border-white/[0.08] last:border-r-0"
                      >
                        {color.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export */}
                <div className="mt-6">
                  <PaletteExport colors={displayColors} />
                </div>
              </div>
            </Reveal>
          )}

          {displayColors.length === 0 && (
            <Reveal animation="reveal-up" delay={1}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 text-center mb-12 backdrop-blur-xl">
                <Share2
                  size={32}
                  className="text-kolr-text-muted mx-auto mb-4 opacity-50"
                />
                <p className="text-kolr-text-muted">{t("noColors")}</p>
              </div>
            </Reveal>
          )}

          {/* How it works */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <h3 className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-6">
                {t("howItWorks")}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-kolr-cyan/10 text-kolr-cyan flex items-center justify-center text-sm font-bold shrink-0">
                      {step}
                    </div>
                    <p className="text-sm text-kolr-text-muted leading-relaxed">
                      {t(`step${step}` as "step1" | "step2" | "step3")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          {/* Create Share Link */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] overflow-hidden backdrop-blur-xl mb-8">
              <div className="flex items-center gap-2 p-6 border-b border-white/[0.08]">
                <Share2 size={16} className="text-kolr-orange" />
                <span className="font-bold uppercase text-xs tracking-widest text-white">
                  {t("createLink")}
                </span>
              </div>

              <div className="p-8">
                {/* Color pickers */}
                <p className="text-sm text-kolr-text-muted mb-4">
                  {t("paletteColors")}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {editColors.map((color, i) => (
                    <div key={i} className="relative group">
                      <div
                        className="h-20 rounded-xl border-2 border-white/10 cursor-pointer transition-all duration-200 hover:border-kolr-cyan relative overflow-hidden"
                        style={{ backgroundColor: color }}
                      >
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => updateColor(i, e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {editColors.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeColor(i);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={color.toUpperCase()}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^#[0-9A-Fa-f]{0,6}$/.test(val))
                            updateColor(i, val);
                        }}
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-center text-white outline-none focus:border-kolr-cyan transition-colors"
                      />
                    </div>
                  ))}

                  {editColors.length < 8 && (
                    <button
                      onClick={addColor}
                      className="h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-kolr-text-muted hover:text-kolr-cyan hover:border-kolr-cyan transition-all duration-200"
                    >
                      <Plus size={20} />
                      <span className="text-xs mt-1">{t("addColor")}</span>
                    </button>
                  )}
                </div>

                {/* Generate Link Button */}
                <button
                  onClick={generateShareLink}
                  className="w-full bg-kolr-cyan text-black py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
                >
                  <Link size={16} />
                  {t("generateLink")}
                </button>

                {/* Generated Link */}
                {generatedLink && (
                  <div className="mt-6">
                    <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-2">
                      {t("shareUrl")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-kolr-text-muted outline-none"
                      />
                      <button
                        onClick={copyLink}
                        className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 transition-all duration-300 ${
                          linkCopied
                            ? "bg-kolr-green text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                        {linkCopied ? t("linkCopied") : t("copyLink")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* History */}
          <div className="pb-16">
            <PaletteHistory onRestore={handleRestore} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-kolr-bg text-white">
          <main className="min-h-[calc(100vh-80px)] pt-8">
            <div className="container max-w-[900px] text-center py-20">
              <div className="animate-pulse text-kolr-text-muted">
                Loading...
              </div>
            </div>
          </main>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
