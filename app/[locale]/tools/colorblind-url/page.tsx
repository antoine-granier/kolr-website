"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, Globe, Search, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ToolContent from "@/components/ToolContent";

type SimType = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const SIM_FILTERS: Record<SimType, string> = {
  normal: "none",
  protanopia:
    "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"p\"><feColorMatrix type=\"matrix\" values=\"0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0\"/></filter></svg>#p')",
  deuteranopia:
    "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"d\"><feColorMatrix type=\"matrix\" values=\"0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0\"/></filter></svg>#d')",
  tritanopia:
    "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"t\"><feColorMatrix type=\"matrix\" values=\"0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0\"/></filter></svg>#t')",
  achromatopsia: "grayscale(100%)",
};

export default function ColorblindUrlPage() {
  const t = useTranslations("toolColorblindUrl");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [url, setUrl] = useState("");
  const [loadedUrl, setLoadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSim, setActiveSim] = useState<SimType>("normal");
  const [error, setError] = useState("");

  const simTypes: { key: SimType; color: string }[] = [
    { key: "normal", color: "var(--kolr-text)" },
    { key: "protanopia", color: "var(--kolr-red)" },
    { key: "deuteranopia", color: "var(--kolr-green)" },
    { key: "tritanopia", color: "var(--kolr-cyan)" },
    { key: "achromatopsia", color: "var(--kolr-text-muted)" },
  ];

  const loadSite = () => {
    if (!url.trim()) return;
    setError("");
    setLoading(true);

    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http")) finalUrl = `https://${finalUrl}`;

    setLoadedUrl(finalUrl);
    // iframe will handle the loading
    setTimeout(() => setLoading(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") loadSite();
  };

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

          {/* URL Input */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-4">
                URL
              </label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
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
                    className="flex-1 font-mono text-sm bg-transparent border-0 outline-none placeholder:text-kolr-text-muted/50"
                  />
                </div>
                <button
                  onClick={loadSite}
                  disabled={!url.trim() || loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-kolr-cyan text-black hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  {t("load")}
                </button>
              </div>

              {error && (
                <p id="url-error" role="alert" className="text-sm text-kolr-red mt-3">{error}</p>
              )}

              <p className="text-xs text-kolr-text-muted mt-3">
                {t("note")}
              </p>
            </div>
          </Reveal>

          {/* Simulation Tabs */}
          {loadedUrl && (
            <Reveal animation="reveal-up" delay={1}>
              <div className="mb-6">
                <div className="flex gap-2 flex-wrap">
                  {simTypes.map(({ key, color }) => (
                    <button
                      key={key}
                      onClick={() => setActiveSim(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                        activeSim === key
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/5 border-white/10 text-kolr-text-muted hover:text-white"
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-kolr-text-muted">
                  {t(`${activeSim}Desc`)}
                </p>
                <a
                  href={loadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-kolr-text-muted hover:text-white transition-colors no-underline"
                >
                  <ExternalLink size={12} />
                  {t("openOriginal")}
                </a>
              </div>

              {/* iframe Preview */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <div
                  className="w-full h-[600px] relative"
                  style={{ filter: SIM_FILTERS[activeSim] }}
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-kolr-bg/80 z-10">
                      <Loader2 size={32} className="animate-spin text-kolr-cyan" />
                    </div>
                  )}
                  <iframe
                    src={loadedUrl}
                    title="Website preview"
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setError(t("loadError"));
                      setLoading(false);
                    }}
                  />
                </div>
              </div>
            </Reveal>
          )}

          {/* How it works */}
          {!loadedUrl && (
            <Reveal animation="reveal-up" delay={2}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl">
                <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-6">
                  {t("howTitle")}
                </label>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-kolr-cyan/10 text-kolr-cyan flex items-center justify-center text-sm font-bold shrink-0">
                        {step}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">{t(`step${step}Title`)}</p>
                        <p className="text-xs text-kolr-text-muted leading-relaxed">{t(`step${step}Desc`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
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
