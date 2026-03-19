"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowLeft,
  Upload,
  Download,
  RefreshCw,
  Pipette,
  X,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ColorPicker from "@/components/ColorPicker";
import ToolContent from "@/components/ToolContent";
import {
  extractColors,
  applyReplacements,
  sanitizeSvg,
} from "@/lib/svg-color-parser";

function getContrastColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#FFFFFF";
}

export default function SvgColorEditorPage() {
  const t = useTranslations("toolSvgColor");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [svgString, setSvgString] = useState<string | null>(null);

  // Load demo SVG on mount
  useEffect(() => {
    fetch("/demo-svg.svg")
      .then((res) => res.text())
      .then((text) => setSvgString(text))
      .catch(() => {});
  }, []);
  const [fileName, setFileName] = useState("edited.svg");
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract colors from the original SVG
  const colorMap = useMemo(() => {
    if (!svgString) return new Map<string, Set<string>>();
    return extractColors(svgString);
  }, [svgString]);

  const uniqueColors = useMemo(() => Array.from(colorMap.keys()), [colorMap]);

  // Apply replacements and sanitize for preview
  const modifiedSvg = useMemo(() => {
    if (!svgString) return "";
    const hasReplacements = Object.keys(replacements).some(
      (k) => replacements[k] !== k,
    );
    const result = hasReplacements
      ? applyReplacements(svgString, replacements)
      : svgString;
    return sanitizeSvg(result);
  }, [svgString, replacements]);

  const handleFile = (file: File) => {
    if (!file.type.includes("svg") && !file.name.endsWith(".svg")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setSvgString(text);
      setFileName(file.name.replace(".svg", "-edited.svg"));
      setReplacements({});
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const updateColor = (canonical: string, newColor: string) => {
    setReplacements((prev) => ({ ...prev, [canonical]: newColor.toLowerCase() }));
  };

  const resetColors = () => setReplacements({});

  const randomizeColors = () => {
    const newReplacements: Record<string, string> = {};
    // Pick a random palette style
    const styles = [
      { sMin: 50, sMax: 90, lMin: 35, lMax: 55 },  // vivid
      { sMin: 20, sMax: 45, lMin: 60, lMax: 85 },  // pastel
      { sMin: 10, sMax: 30, lMin: 15, lMax: 35 },  // dark muted
      { sMin: 60, sMax: 95, lMin: 55, lMax: 75 },  // bright
      { sMin: 5, sMax: 20, lMin: 70, lMax: 95 },   // desaturated light
      { sMin: 30, sMax: 70, lMin: 40, lMax: 70 },   // balanced
    ];
    const style = styles[Math.floor(Math.random() * styles.length)];
    for (const canonical of uniqueColors) {
      const h = Math.floor(Math.random() * 360);
      const s = style.sMin + Math.floor(Math.random() * (style.sMax - style.sMin));
      const l = style.lMin + Math.floor(Math.random() * (style.lMax - style.lMin));
      const a = s / 100 * Math.min(l / 100, 1 - l / 100);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const c = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, "0");
      };
      newReplacements[canonical] = `#${f(0)}${f(8)}${f(4)}`;
    }
    setReplacements(newReplacements);
  };

  const downloadSvg = () => {
    if (!modifiedSvg) return;
    const blob = new Blob([modifiedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };


  const clearSvg = () => {
    setSvgString(null);
    setReplacements({});
    if (fileInputRef.current) fileInputRef.current.value = "";
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

          {!svgString ? (
            /* Upload Zone */
            <Reveal animation="reveal-up" delay={1}>
              <div
                className={`max-w-2xl mx-auto h-[400px] rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isDragging
                    ? "bg-kolr-cyan/5 border-2 border-dashed border-kolr-cyan -translate-y-1"
                    : "bg-white/[0.03] border-2 border-dashed border-white/10 hover:bg-white/[0.05] hover:border-kolr-cyan hover:-translate-y-1"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <Upload
                    size={32}
                    className={`transition-colors ${isDragging ? "text-kolr-cyan" : "text-kolr-text-muted"}`}
                  />
                </div>
                <p className="text-lg font-bold text-white mb-2">
                  {t("dropzone")}
                </p>
                <p className="text-sm text-kolr-text-muted">
                  {t("orBrowse")}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>
            </Reveal>
          ) : (
            /* Editor */
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 mb-16">
              {/* SVG Preview */}
              <Reveal animation="reveal-up" delay={1}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                      {t("preview")}
                    </label>
                    <button
                      onClick={clearSvg}
                      className="flex items-center gap-1.5 text-xs font-bold text-kolr-text-muted hover:text-white transition-colors"
                    >
                      <X size={14} />
                      {t("uploadNew")}
                    </button>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl flex items-center justify-center min-h-[400px]">
                    <div
                      className="w-full max-h-[500px] [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[500px]"
                      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
                    />
                  </div>
                </div>
              </Reveal>

              {/* Color List */}
              <Reveal animation="reveal-up" delay={2}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                      {t("colors")}
                      <span className="ml-2 text-white">{uniqueColors.length}</span>
                    </label>
                    {uniqueColors.length > 0 && (
                      <button
                        onClick={randomizeColors}
                        className="flex items-center gap-1.5 text-xs font-bold text-kolr-text-muted hover:text-white transition-colors group"
                      >
                        <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                        {t("randomize")}
                      </button>
                    )}
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 backdrop-blur-xl max-h-[500px] overflow-y-auto">
                    {uniqueColors.length === 0 ? (
                      <p className="text-kolr-text-muted text-sm text-center py-8">
                        {t("noColors")}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((canonical) => {
                          const current = replacements[canonical] || canonical;
                          return (
                            <ColorPicker
                              key={canonical}
                              value={current.toUpperCase()}
                              onChange={(c) => updateColor(canonical, c)}
                              size="sm"
                            >
                              <div
                                className="w-8 h-8 rounded-lg cursor-pointer relative group border border-white/15 hover:border-white/40 hover:scale-110 transition-all duration-200"
                                style={{ backgroundColor: current }}
                                title={current.toUpperCase()}
                              >
                                <div
                                  className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ color: getContrastColor(current) }}
                                >
                                  <Pipette size={12} />
                                </div>
                              </div>
                            </ColorPicker>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {uniqueColors.length > 0 && (
                    <div className="flex gap-3">
                      <button
                        onClick={resetColors}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-kolr-cyan transition-all duration-300 group"
                      >
                        <RefreshCw
                          size={16}
                          className="group-hover:rotate-180 transition-transform duration-500"
                        />
                        {t("reset")}
                      </button>
                      <button
                        onClick={downloadSvg}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-kolr-cyan text-black hover:brightness-110 transition-all duration-300"
                      >
                        <Download size={16} />
                        {t("download")}
                      </button>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
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
