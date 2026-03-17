"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Search, Copy, Check, Share2, ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";

interface PaletteItem {
  name: string;
  category: string;
  colors: string[];
}

const PALETTES: PaletteItem[] = [
  // Ocean
  {
    name: "Ocean Breeze",
    category: "ocean",
    colors: ["#05445E", "#189AB4", "#75E6DA", "#D4F1F9", "#E8F8F5"],
  },
  {
    name: "Deep Sea",
    category: "ocean",
    colors: ["#0C2D48", "#145DA0", "#2E8BC0", "#B1D4E0", "#D6ECF0"],
  },
  {
    name: "Coral Reef",
    category: "ocean",
    colors: ["#1B4965", "#5FA8D3", "#62B6CB", "#BEE9E8", "#CAE9FF"],
  },
  {
    name: "Abyss",
    category: "ocean",
    colors: ["#03071E", "#023E8A", "#0077B6", "#48CAE4", "#ADE8F4"],
  },
  {
    name: "Arctic Blue",
    category: "ocean",
    colors: ["#0B2545", "#134074", "#13678A", "#45C4B0", "#9AEBA3"],
  },
  // Sunset
  {
    name: "Sunset Glow",
    category: "sunset",
    colors: ["#2D1B69", "#B5179E", "#F72585", "#FF6B6B", "#FFD93D"],
  },
  {
    name: "Golden Hour",
    category: "sunset",
    colors: ["#780116", "#C32F27", "#D8572A", "#F7A072", "#F9C784"],
  },
  {
    name: "Dusk",
    category: "sunset",
    colors: ["#1A1A2E", "#16213E", "#533483", "#E94560", "#FF6F61"],
  },
  {
    name: "Flamingo Sky",
    category: "sunset",
    colors: ["#590D22", "#A4133C", "#FF4D6D", "#FF8FA3", "#FFCCD5"],
  },
  {
    name: "Molten Lava",
    category: "sunset",
    colors: ["#1C0A00", "#6A040F", "#D00000", "#E85D04", "#FAA307"],
  },
  // Nature
  {
    name: "Forest Walk",
    category: "nature",
    colors: ["#1B4332", "#2D6A4F", "#40916C", "#52B788", "#95D5B2"],
  },
  {
    name: "Spring Meadow",
    category: "nature",
    colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
  },
  {
    name: "Autumn Leaves",
    category: "nature",
    colors: ["#6B2737", "#C44536", "#E07A5F", "#F2CC8F", "#81B29A"],
  },
  {
    name: "Moss Garden",
    category: "nature",
    colors: ["#132A13", "#31572C", "#4F772D", "#90A955", "#ECF39E"],
  },
  {
    name: "Cherry Blossom",
    category: "nature",
    colors: ["#3C1642", "#7B2D8E", "#D1789C", "#F4BFDB", "#FFF0F5"],
  },
  {
    name: "Northern Lights",
    category: "nature",
    colors: ["#0B0C10", "#1F2833", "#45A29E", "#66FCF1", "#C5C6C7"],
  },
  // Vintage
  {
    name: "Retro Pop",
    category: "vintage",
    colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"],
  },
  {
    name: "Old Film",
    category: "vintage",
    colors: ["#3D405B", "#81B29A", "#F2CC8F", "#F4F1DE", "#E07A5F"],
  },
  {
    name: "Dusty Rose",
    category: "vintage",
    colors: ["#5C374C", "#985277", "#CE796B", "#E8B4B8", "#EED6D3"],
  },
  {
    name: "Polaroid",
    category: "vintage",
    colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"],
  },
  {
    name: "Vinyl",
    category: "vintage",
    colors: ["#0B0C10", "#1F2833", "#C5C6C7", "#66FCF1", "#45A29E"],
  },
  // Neon
  {
    name: "Cyber Neon",
    category: "neon",
    colors: ["#0D0221", "#0F084B", "#26408B", "#A6CFD5", "#00F2FF"],
  },
  {
    name: "Electric Dreams",
    category: "neon",
    colors: ["#120458", "#7B2D8E", "#F72585", "#00F5D4", "#FEE440"],
  },
  {
    name: "Neon Nights",
    category: "neon",
    colors: ["#0A0A0A", "#BF5AF2", "#FF375F", "#00F2FF", "#30D158"],
  },
  {
    name: "Synthwave",
    category: "neon",
    colors: ["#0D0221", "#261447", "#9B5DE5", "#F15BB5", "#00BBF9"],
  },
  {
    name: "Cyberpunk",
    category: "neon",
    colors: ["#0A0A0A", "#1B1B2F", "#E43F5A", "#FF2E63", "#08D9D6"],
  },
  {
    name: "Plasma",
    category: "neon",
    colors: ["#0C0032", "#190061", "#240090", "#3500D3", "#282828"],
  },
  // Pastel
  {
    name: "Cotton Candy",
    category: "pastel",
    colors: ["#FFD6E0", "#FFEFCF", "#C1FBA4", "#BADEFC", "#E0C3FC"],
  },
  {
    name: "Soft Dream",
    category: "pastel",
    colors: ["#FEC5BB", "#FCD5CE", "#F8EDEB", "#E8E8E4", "#D8E2DC"],
  },
  {
    name: "Lavender Haze",
    category: "pastel",
    colors: ["#E2CDF4", "#C3ACD0", "#F7D9C4", "#FAEDCB", "#C9E4DE"],
  },
  {
    name: "Macaron",
    category: "pastel",
    colors: ["#F9C5D1", "#F3E8D3", "#C6E2B1", "#B8D8E8", "#D4B8E0"],
  },
  {
    name: "Sorbet",
    category: "pastel",
    colors: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7"],
  },
  {
    name: "Baby Powder",
    category: "pastel",
    colors: ["#F0EFEB", "#DFE6DA", "#C9E4CA", "#87BBA2", "#55828B"],
  },
  // Earthy
  {
    name: "Terra Firma",
    category: "earthy",
    colors: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#D7CCC8"],
  },
  {
    name: "Desert Sand",
    category: "earthy",
    colors: ["#6D4C3D", "#987D5E", "#C4A882", "#DDC9A3", "#F0E5CF"],
  },
  {
    name: "Clay",
    category: "earthy",
    colors: ["#582F0E", "#7F4F24", "#936639", "#A68A64", "#B6AD90"],
  },
  {
    name: "Terracotta",
    category: "earthy",
    colors: ["#3D2B1F", "#8B4513", "#CD853F", "#DEB887", "#F5E6CC"],
  },
  {
    name: "Sahara",
    category: "earthy",
    colors: ["#4A3728", "#7C5E48", "#C49B66", "#E3C99C", "#F7ECDE"],
  },
  // Minimal
  {
    name: "Monochrome",
    category: "minimal",
    colors: ["#111111", "#333333", "#666666", "#999999", "#DDDDDD"],
  },
  {
    name: "Snow",
    category: "minimal",
    colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD"],
  },
  {
    name: "Ink",
    category: "minimal",
    colors: ["#0B090A", "#161A1D", "#343A40", "#6C757D", "#F8F9FA"],
  },
  {
    name: "Paper",
    category: "minimal",
    colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#212121"],
  },
  {
    name: "Graphite",
    category: "minimal",
    colors: ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"],
  },
  {
    name: "Zen",
    category: "minimal",
    colors: ["#2D2D2D", "#4A4A4A", "#7A7A7A", "#B0B0B0", "#E8E8E8"],
  },
  // Brands
  {
    name: "Claude",
    category: "brands",
    colors: ["#D97706", "#F59E0B", "#FDE68A", "#1A1A1A", "#F5F5F4"],
  },
  {
    name: "ChatGPT",
    category: "brands",
    colors: ["#10A37F", "#1A7F64", "#202123", "#343541", "#ECECF1"],
  },
  {
    name: "Spotify",
    category: "brands",
    colors: ["#1DB954", "#191414", "#121212", "#282828", "#B3B3B3"],
  },
  {
    name: "Instagram",
    category: "brands",
    colors: ["#405DE6", "#833AB4", "#C13584", "#E1306C", "#F56040"],
  },
  {
    name: "Stripe",
    category: "brands",
    colors: ["#635BFF", "#0A2540", "#00D4AA", "#7A73FF", "#FBFCFE"],
  },
  {
    name: "Notion",
    category: "brands",
    colors: ["#000000", "#2F3437", "#787774", "#E3E2DE", "#FFFFFF"],
  },
  {
    name: "Figma",
    category: "brands",
    colors: ["#F24E1E", "#FF7262", "#A259FF", "#1ABCFE", "#0ACF83"],
  },
  {
    name: "Linear",
    category: "brands",
    colors: ["#5E6AD2", "#4E5BA6", "#2C3145", "#1B1D2A", "#F7F8F8"],
  },
  {
    name: "Vercel",
    category: "brands",
    colors: ["#000000", "#111111", "#333333", "#888888", "#FFFFFF"],
  },
  {
    name: "Tailwind CSS",
    category: "brands",
    colors: ["#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1", "#0F172A"],
  },
  {
    name: "GitHub",
    category: "brands",
    colors: ["#0D1117", "#161B22", "#238636", "#58A6FF", "#F0F6FC"],
  },
  {
    name: "Discord",
    category: "brands",
    colors: ["#5865F2", "#57F287", "#FEE75C", "#EB459E", "#2C2F33"],
  },
  {
    name: "Slack",
    category: "brands",
    colors: ["#4A154B", "#36C5F0", "#2EB67D", "#ECB22E", "#E01E5A"],
  },
  {
    name: "Dribbble",
    category: "brands",
    colors: ["#EA4C89", "#C32361", "#F082AC", "#FFF0F5", "#2C2C2C"],
  },
  {
    name: "YouTube",
    category: "brands",
    colors: ["#FF0000", "#CC0000", "#282828", "#AAAAAA", "#FFFFFF"],
  },
  {
    name: "Netflix",
    category: "brands",
    colors: ["#E50914", "#B20710", "#141414", "#221F1F", "#F5F5F1"],
  },
  {
    name: "Apple",
    category: "brands",
    colors: ["#000000", "#555555", "#86868B", "#D2D2D7", "#F5F5F7"],
  },
  {
    name: "X (Twitter)",
    category: "brands",
    colors: ["#000000", "#14171A", "#657786", "#AAB8C2", "#F5F8FA"],
  },
  {
    name: "TikTok",
    category: "brands",
    colors: ["#010101", "#25F4EE", "#FE2C55", "#EE1D52", "#FFFFFF"],
  },
  {
    name: "Supabase",
    category: "brands",
    colors: ["#3ECF8E", "#1C1C1C", "#2A2A2A", "#EDEDED", "#FFFFFF"],
  },
];

const CATEGORIES = [
  "all",
  "brands",
  "nature",
  "sunset",
  "ocean",
  "vintage",
  "neon",
  "pastel",
  "earthy",
  "minimal",
];

function getContrastColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000" : "#fff";
}

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedPalette, setCopiedPalette] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return PALETTES.filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.colors.some((c) => c.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search]);

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
                {t("subtitle")}
              </p>
            </header>
          </Reveal>

          {/* Filters */}
          <Reveal animation="reveal-up" delay={1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2 flex-wrap flex-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                    selectedCategory === cat
                      ? "bg-kolr-cyan text-black border-kolr-cyan"
                      : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-[38px] focus-within:border-kolr-cyan transition-colors w-full sm:w-[220px] self-start shrink-0">
              <Search size={14} className="text-kolr-text-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="bg-transparent text-sm text-white placeholder:text-kolr-text-muted outline-none w-full"
              />
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-kolr-text-muted mb-6">
            <span className="text-white font-bold">{filtered.length}</span>{" "}
            {t("palettes")}
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
                      {t(palette.category)}
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
        </div>
      </main>
    </div>
  );
}
