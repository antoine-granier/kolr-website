"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  Search,
  ArrowRight,
  Sparkles,
  Palette,
  Pipette,
  Image as ImageIcon,
  CircleSlash2,
  Blend,
  Eye,
  Globe,
  Share2,
  Moon,
  Repeat,
  Columns2,
  MonitorCheck,
  Paintbrush,
  FileCode,
  Square,
  Layers,
  AudioLines,
  Type,
  type LucideIcon,
} from "lucide-react";

type Cat = "accessibility" | "creative" | "generation" | "conversion";

interface Tool {
  nameKey: string;
  descKey: string;
  href: string;
  Icon: LucideIcon;
  color: string;
  cat: Cat;
  signature?: boolean;
}

// Signature tools first within each group — these are the differentiators the
// landing page leads with, so they should surface here too.
const TOOLS: Tool[] = [
  { nameKey: "toolColorblindUrl", descKey: "toolColorblindUrlDesc", href: "/tools/colorblind-url", Icon: MonitorCheck, color: "var(--kolr-green)", cat: "accessibility", signature: true },
  { nameKey: "toolContrast", descKey: "toolContrastDesc", href: "/tools/contrast-checker", Icon: CircleSlash2, color: "var(--kolr-orange)", cat: "accessibility" },
  { nameKey: "toolColorblind", descKey: "toolColorblindDesc", href: "/tools/colorblind", Icon: Eye, color: "var(--kolr-cyan)", cat: "accessibility" },

  { nameKey: "toolSoundPalette", descKey: "toolSoundPaletteDesc", href: "/tools/sound-palette", Icon: AudioLines, color: "var(--kolr-purple)", cat: "creative", signature: true },
  { nameKey: "toolTextPalette", descKey: "toolTextPaletteDesc", href: "/tools/text-palette", Icon: Type, color: "var(--kolr-orange)", cat: "creative", signature: true },
  { nameKey: "toolImage", descKey: "toolImageDesc", href: "/tools/image-extract", Icon: ImageIcon, color: "var(--kolr-green)", cat: "creative" },
  { nameKey: "toolUrl", descKey: "toolUrlDesc", href: "/tools/url-extract", Icon: Globe, color: "var(--kolr-purple)", cat: "creative" },

  { nameKey: "toolRandom", descKey: "toolRandomDesc", href: "/tools/random", Icon: Palette, color: "var(--kolr-cyan)", cat: "generation" },
  { nameKey: "toolColor", descKey: "toolColorDesc", href: "/tools/color-extract", Icon: Pipette, color: "var(--kolr-purple)", cat: "generation" },
  { nameKey: "toolGradient", descKey: "toolGradientDesc", href: "/tools/gradient", Icon: Blend, color: "var(--kolr-red)", cat: "generation" },
  { nameKey: "toolDarkTheme", descKey: "toolDarkThemeDesc", href: "/tools/dark-theme", Icon: Moon, color: "var(--kolr-orange)", cat: "generation" },
  { nameKey: "toolShadow", descKey: "toolShadowDesc", href: "/tools/shadow-generator", Icon: Square, color: "var(--kolr-purple)", cat: "generation" },
  { nameKey: "toolGlass", descKey: "toolGlassDesc", href: "/tools/glass-generator", Icon: Layers, color: "var(--kolr-cyan)", cat: "generation" },

  { nameKey: "toolConverter", descKey: "toolConverterDesc", href: "/tools/color-converter", Icon: Repeat, color: "var(--kolr-green)", cat: "conversion" },
  { nameKey: "toolTailwindColors", descKey: "toolTailwindColorsDesc", href: "/tools/tailwind-colors", Icon: Paintbrush, color: "var(--kolr-cyan)", cat: "conversion" },
  { nameKey: "toolSvgColor", descKey: "toolSvgColorDesc", href: "/tools/svg-color-editor", Icon: FileCode, color: "var(--kolr-orange)", cat: "conversion" },
  { nameKey: "toolCompare", descKey: "toolCompareDesc", href: "/tools/palette-compare", Icon: Columns2, color: "var(--kolr-red)", cat: "conversion" },
  { nameKey: "toolShare", descKey: "toolShareDesc", href: "/share", Icon: Share2, color: "var(--kolr-cyan)", cat: "conversion" },
];

const CAT_ORDER: Cat[] = ["accessibility", "creative", "generation", "conversion"];
const CAT_LABEL_KEY: Record<Cat, string> = {
  accessibility: "catAccessibility",
  creative: "catCreative",
  generation: "catGeneration",
  conversion: "catConversion",
};

export default function ToolsExplorer() {
  const tNav = useTranslations("nav");
  const t = useTranslations("toolsPage");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Cat | "all">("all");

  const q = query.trim().toLowerCase();

  const enriched = useMemo(
    () =>
      TOOLS.map((tool) => ({
        ...tool,
        name: tNav(tool.nameKey),
        desc: tNav(tool.descKey),
      })),
    [tNav],
  );

  const filtered = useMemo(
    () =>
      enriched.filter((tool) => {
        const matchCat = cat === "all" || tool.cat === cat;
        const matchQuery =
          !q ||
          tool.name.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q);
        return matchCat && matchQuery;
      }),
    [enriched, cat, q],
  );

  // Group by category only on the default view (no search, "all" selected).
  const grouped = q === "" && cat === "all";

  const chips: (Cat | "all")[] = ["all", ...CAT_ORDER];

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap flex-1">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                cat === c
                  ? "bg-kolr-cyan text-black border-kolr-cyan"
                  : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c === "all" ? t("all") : t(CAT_LABEL_KEY[c])}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-[42px] focus-within:border-kolr-cyan transition-colors w-full md:w-[260px] shrink-0">
          <Search size={16} className="text-kolr-text-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="bg-transparent text-sm text-white placeholder:text-kolr-text-muted outline-none w-full"
          />
        </div>
      </div>

      <p className="text-sm text-kolr-text-muted mb-6">
        {t("results", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="text-kolr-text-muted py-12 text-center">{t("noResults")}</p>
      ) : grouped ? (
        <div className="flex flex-col gap-12">
          {CAT_ORDER.map((c) => {
            const items = filtered.filter((tool) => tool.cat === c);
            if (items.length === 0) return null;
            return (
              <section key={c}>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-kolr-text-muted mb-5">
                  {t(CAT_LABEL_KEY[c])}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((tool) => (
                    <ToolCard
                      key={tool.href}
                      locale={locale}
                      tool={tool}
                      signatureLabel={t("signature")}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tool) => (
            <ToolCard
              key={tool.href}
              locale={locale}
              tool={tool}
              signatureLabel={t("signature")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolCard({
  locale,
  tool,
  signatureLabel,
}: {
  locale: string;
  tool: Tool & { name: string; desc: string };
  signatureLabel: string;
}) {
  const { Icon, color } = tool;
  return (
    <Link
      href={`/${locale}${tool.href}`}
      className="group relative flex flex-col h-full bg-kolr-surface border border-kolr-border rounded-3xl p-6 hover:-translate-y-1.5 hover:border-white/25 transition-all duration-300 no-underline"
    >
      {tool.signature && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-kolr-cyan bg-kolr-cyan/10 border border-kolr-cyan/20 rounded-full px-2 py-0.5">
          <Sparkles size={11} />
          {signatureLabel}
        </span>
      )}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
          color,
        }}
      >
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-extrabold mb-1.5 text-white">{tool.name}</h3>
      <p className="text-sm text-kolr-text-muted leading-relaxed flex-1">
        {tool.desc}
      </p>
      <span
        className="inline-flex items-center gap-1.5 font-bold text-sm mt-4 group-hover:gap-2.5 transition-all duration-200"
        style={{ color }}
      >
        {/* arrow only — keep the card compact */}
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
