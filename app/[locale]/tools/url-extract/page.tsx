"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Globe,
  Search,
  Copy,
  Check,
  Trash2,
  Loader2,
  ExternalLink,
  Palette,
  FileCode,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ToolPrivacyNote from "@/components/ToolPrivacyNote";
import PaletteExport from "@/components/PaletteExport";
import { addToHistory } from "@/components/PaletteHistory";

function getContrastColor(hex: string): string {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#ffffff";
}

export default function UrlExtractPage() {
  const t = useTranslations("toolUrl");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const resultsRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState("");
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [cssCount, setCssCount] = useState(0);

  const extract = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setExtractedColors([]);
    setSiteUrl("");
    setCssCount(0);

    try {
      const response = await fetch("/api/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("errorGeneric"));
        return;
      }

      if (data.colors.length === 0) {
        setError(t("noColors"));
        return;
      }

      setExtractedColors(data.colors);
      setSiteUrl(data.url);
      setCssCount(data.cssFilesAnalyzed);

      // Save interesting colors to history (top 8)
      const topColors = data.colors.slice(0, Math.min(8, data.colors.length));
      if (topColors.length >= 2) {
        addToHistory(topColors);
      }

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  };

  const copyColor = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(extractedColors.join(", "));
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const clear = () => {
    setUrl("");
    setExtractedColors([]);
    setError("");
    setSiteUrl("");
    setCssCount(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      extract();
    }
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
              <ToolPrivacyNote variant="server" />
            </header>
          </Reveal>

          <div className="max-w-3xl mx-auto">
            {/* URL Input */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 backdrop-blur-xl mb-8">
                <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-4">
                  URL
                </label>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                  <Globe size={18} className="text-kolr-text-muted shrink-0" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("placeholder")}
                    aria-label="Website URL"
                    aria-invalid={!!error}
                    aria-describedby={error ? "url-error" : undefined}
                    className="flex-1 font-mono text-lg font-extrabold bg-transparent border-0 outline-none placeholder:text-kolr-text-muted/50"
                    disabled={loading}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={extract}
                    disabled={!url.trim() || loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-kolr-cyan text-black hover:opacity-90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Search size={18} />
                    )}
                    {loading ? t("loading") : t("extract")}
                  </button>
                  <button
                    onClick={clear}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-kolr-text-muted hover:text-white hover:border-kolr-red transition-all duration-300"
                  >
                    <Trash2 size={16} />
                    {t("clear")}
                  </button>
                </div>
              </div>
            </Reveal>

            {/* How it works */}
            {extractedColors.length === 0 && !error && !loading && (
              <Reveal animation="reveal-up" delay={2}>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
                  <h3 className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-6">
                    {t("howTitle")}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-kolr-purple/10 text-kolr-purple flex items-center justify-center shrink-0">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">
                          {t("step1Title")}
                        </p>
                        <p className="text-xs text-kolr-text-muted leading-relaxed">
                          {t("step1Desc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-kolr-cyan/10 text-kolr-cyan flex items-center justify-center shrink-0">
                        <FileCode size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">
                          {t("step2Title")}
                        </p>
                        <p className="text-xs text-kolr-text-muted leading-relaxed">
                          {t("step2Desc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-kolr-green/10 text-kolr-green flex items-center justify-center shrink-0">
                        <Palette size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">
                          {t("step3Title")}
                        </p>
                        <p className="text-xs text-kolr-text-muted leading-relaxed">
                          {t("step3Desc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Error */}
            {error && (
              <div id="url-error" role="alert" className="flex items-center gap-3 bg-kolr-red/10 border border-kolr-red/20 rounded-xl px-5 py-4 mb-8">
                <AlertCircle size={18} className="text-kolr-red shrink-0" />
                <p className="text-sm text-kolr-red">{error}</p>
              </div>
            )}

            {/* Results */}
            {extractedColors.length > 0 && (
                <div ref={resultsRef} className="mb-16 pt-4">
                  {/* Site info */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-kolr-text-muted">
                        <span className="text-white font-bold">
                          {extractedColors.length}
                        </span>{" "}
                        {t("found")}
                      </p>
                      {cssCount > 0 && (
                        <span className="text-xs bg-kolr-purple/10 text-kolr-purple px-2 py-1 rounded-full font-bold">
                          {cssCount} CSS {cssCount > 1 ? "files" : "file"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {siteUrl && (
                        <a
                          href={siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all duration-300 no-underline"
                        >
                          <ExternalLink size={12} />
                          {t("visitSite")}
                        </a>
                      )}
                      <button
                        onClick={copyAll}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                          allCopied
                            ? "bg-kolr-green text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {allCopied ? <Check size={14} /> : <Copy size={14} />}
                        {t("copyAll")}
                      </button>
                    </div>
                  </div>

                  {/* Color palette strip */}
                  <div className="rounded-[2rem] overflow-hidden border-4 border-white/[0.08] mb-6">
                    <div className="flex h-24">
                      {extractedColors.slice(0, 12).map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-[1.5]"
                          style={{ backgroundColor: color }}
                          onClick={() => copyColor(color, index)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div
                              className="flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-md text-xs font-bold"
                              style={{
                                backgroundColor: `${getContrastColor(color)}20`,
                                color: getContrastColor(color),
                              }}
                            >
                              {copiedIndex === index ? (
                                <Check size={12} />
                              ) : (
                                <Copy size={12} />
                              )}
                              {color.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All colors grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
                    {extractedColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => copyColor(color, index)}
                        aria-label={`Copy color ${color}`}
                        className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div
                          className="h-16 w-full flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: getContrastColor(color) }}
                          >
                            {copiedIndex === index ? (
                              <Check size={18} />
                            ) : (
                              <Copy size={18} />
                            )}
                          </span>
                        </div>
                        <div className="bg-white/[0.03] px-2 py-2 text-center">
                          <span className="text-[0.65rem] font-mono font-bold text-white">
                            {color.toUpperCase()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Export */}
                  <PaletteExport
                    colors={extractedColors.slice(
                      0,
                      Math.min(12, extractedColors.length),
                    )}
                  />
                </div>
            )}
          </div>
        </div>
      </main></div>
  );
}
