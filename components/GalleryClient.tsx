"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Copy, Check, Share2 } from "lucide-react";
import Reveal from "@/components/Reveal";

interface PaletteItem {
  name: string;
  category: string;
  colors: string[];
}

interface GalleryClientProps {
  palettes: PaletteItem[];
  categories: string[];
  locale: string;
  translations: {
    [key: string]: string;
  };
}

function getContrastColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000" : "#fff";
}

export default function GalleryClient({
  palettes,
  categories,
  locale,
  translations,
}: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedPalette, setCopiedPalette] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return palettes.filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.colors.some((c) => c.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search, palettes]);

  const copyPalette = (palette: PaletteItem) => {
    navigator.clipboard.writeText(palette.colors.join(", "));
    setCopiedPalette(palette.name);
    setTimeout(() => setCopiedPalette(null), 2000);
  };

  const [sharedPalette, setSharedPalette] = useState<string | null>(null);

  const sharePalette = (palette: PaletteItem) => {
    const colorsStr = palette.colors.map((c) => c.replace("#", "")).join(",");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/${locale}/share?colors=${colorsStr}`;
    navigator.clipboard.writeText(link);
    setSharedPalette(palette.name);
    setTimeout(() => setSharedPalette(null), 2000);
  };

  return (
    <>
      {/* Filters */}
      <Reveal animation="reveal-up" delay={1}>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-kolr-cyan text-black border-kolr-cyan"
                  : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {translations[cat]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-[38px] focus-within:border-kolr-cyan transition-colors w-full sm:w-[220px] self-start shrink-0">
          <Search size={14} className="text-kolr-text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="bg-transparent text-sm text-white placeholder:text-kolr-text-muted outline-none w-full"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-kolr-text-muted mb-6">
        <span className="text-white font-bold">{filtered.length}</span>{" "}
        {translations.palettes}
      </p>
      </Reveal>

      {/* Grid */}
      <Reveal animation="reveal-up" delay={2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {filtered.map((palette) => (
          <div
            key={palette.name}
            className="bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] group"
          >
            {/* Color bars */}
            <div className="flex h-20">
              {palette.colors.map((color, i) => (
                <Link
                  key={i}
                  href={`/${locale}/color/${color.replace("#", "")}`}
                  className="flex-1 flex items-center justify-center no-underline transition-all duration-200 hover:flex-[1.5]"
                  style={{ backgroundColor: color }}
                >
                  <span
                    className="text-[9px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                    style={{ color: getContrastColor(color) }}
                  >
                    {color}
                  </span>
                </Link>
              ))}
            </div>

            {/* Info */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  {palette.name}
                </h3>
                <span className="text-xs text-kolr-text-muted capitalize">
                  {translations[palette.category]}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => sharePalette(palette)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    sharedPalette === palette.name
                      ? "text-kolr-green bg-kolr-green/10"
                      : "text-kolr-text-muted bg-white/5 hover:text-kolr-orange"
                  }`}
                >
                  {sharedPalette === palette.name ? <Check size={16} /> : <Share2 size={16} />}
                </button>
                <button
                  onClick={() => copyPalette(palette)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    copiedPalette === palette.name
                      ? "text-kolr-green bg-kolr-green/10"
                      : "text-kolr-text-muted bg-white/5 hover:text-kolr-cyan"
                  }`}
                >
                  {copiedPalette === palette.name ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </Reveal>
    </>
  );
}
