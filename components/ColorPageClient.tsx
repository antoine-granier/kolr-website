"use client";

import { useState } from "react";
import { Copy, Check, Thermometer } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getContrastColor } from "@/lib/color-utils";

interface ColorPageClientProps {
  hex: string;
  locale: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  okL: number;
  okC: number;
  okH: number;
  c: number;
  m: number;
  y: number;
  k: number;
  isWarm: boolean;
  palettes: { name: string; colors: string[] }[];
  shades: string[];
  tints: string[];
  t: Record<string, string>;
  tNav: Record<string, string>;
}

export default function ColorPageClient({
  hex, locale, r, g, b, h, s, l, okL, okC, okH, c, m, y, k,
  isWarm, palettes, shades, tints, t, tNav,
}: ColorPageClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const conversions = [
    { key: "hex", label: "HEX", value: hex },
    { key: "rgb", label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
    { key: "hsl", label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
    { key: "oklch", label: "OKLCH", value: `oklch(${okL} ${okC} ${okH})` },
    { key: "cmyk", label: "CMYK", value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` },
  ];

  return (
    <>
      {/* Conversions */}
      <Reveal animation="reveal-up" delay={1}>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
          <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
            {t.conversions}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversions.map(({ key, label, value }) => (
              <button
                key={key}
                onClick={() => copy(value, key)}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">{label}</span>
                  <span className="font-mono text-sm text-white">{value}</span>
                </div>
                <div className={`transition-colors ${copiedKey === key ? "text-kolr-green" : "text-kolr-text-muted opacity-0 group-hover:opacity-100"}`}>
                  {copiedKey === key ? <Check size={14} /> : <Copy size={14} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Properties */}
      <Reveal animation="reveal-up" delay={2}>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
          <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
            {t.properties}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: t.hue, value: `${h}°` },
              { label: t.saturation, value: `${s}%` },
              { label: t.lightness, value: `${l}%` },
              { label: t.brightness, value: `${Math.round((r * 299 + g * 587 + b * 114) / 1000)}` },
              {
                label: t.temperature,
                value: isWarm ? t.warm : t.cool,
                icon: <Thermometer size={14} className={isWarm ? "text-kolr-orange" : "text-kolr-cyan"} />,
              },
            ].map((prop, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-1">{prop.label}</span>
                <span className="flex items-center gap-2 text-lg font-bold text-white">
                  {"icon" in prop && prop.icon}
                  {prop.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Related Palettes */}
      <Reveal animation="reveal-up" delay={3}>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
          <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
            {t.relatedPalettes}
          </label>
          <div className="flex flex-col gap-5">
            {palettes.map((palette) => (
              <div key={palette.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{palette.name}</span>
                  <button
                    onClick={() => copy(palette.colors.join(", "), palette.name)}
                    className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                      copiedKey === palette.name ? "text-kolr-green" : "text-kolr-text-muted hover:text-white"
                    }`}
                  >
                    {copiedKey === palette.name ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex rounded-xl overflow-hidden h-12 border border-white/10">
                  {palette.colors.map((color, i) => (
                    <Link
                      key={i}
                      href={`/${locale}/color/${color.replace("#", "")}`}
                      className="flex-1 flex items-center justify-center group no-underline transition-all duration-200 hover:flex-[1.5]"
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
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Shades & Tints */}
      <Reveal animation="reveal-up" delay={5}>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl">
          <div className="mb-6">
            <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-3">
              {t.shades}
            </label>
            <div className="flex rounded-xl overflow-hidden h-10 border border-white/10">
              {shades.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 cursor-pointer group relative"
                  style={{ backgroundColor: color }}
                  onClick={() => copy(color, `shade-${i}`)}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                    style={{ color: getContrastColor(color) }}
                  >
                    {copiedKey === `shade-${i}` ? "✓" : color}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-3">
              {t.tints}
            </label>
            <div className="flex rounded-xl overflow-hidden h-10 border border-white/10">
              {tints.map((color, i) => (
                <div
                  key={i}
                  className="flex-1 cursor-pointer group relative"
                  style={{ backgroundColor: color }}
                  onClick={() => copy(color, `tint-${i}`)}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold opacity-0 group-hover:opacity-80 transition-opacity"
                    style={{ color: getContrastColor(color) }}
                  >
                    {copiedKey === `tint-${i}` ? "✓" : color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
