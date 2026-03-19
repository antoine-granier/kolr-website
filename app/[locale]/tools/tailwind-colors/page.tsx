"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Copy,
  Check,
  ArrowLeft,
  RefreshCw,
  Camera,
  Heart,
  Glasses,
  Dumbbell,
  Eye,
  Settings,
  Upload,
  Sparkles,
  Star,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ColorPicker from "@/components/ColorPicker";
import ToolContent from "@/components/ToolContent";

// ── Color utilities ──

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  if (hex.length < 6) return { h: 0, s: 0, l: 0 };
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getContrastColor(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "#000000" : "#FFFFFF";
}

// ── Tailwind scale generation ──

const SHADE_KEYS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
type ShadeKey = (typeof SHADE_KEYS)[number];

function generateTailwindScale(baseHex: string): Record<ShadeKey, string> {
  const { h, s } = hexToHsl(baseHex);

  const lightnessMap: Record<ShadeKey, number> = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 66,
    500: 55,
    600: 45,
    700: 37,
    800: 29,
    900: 21,
    950: 12,
  };

  const saturationMap: Record<ShadeKey, number> = {
    50: Math.max(s * 0.6, 20),
    100: Math.max(s * 0.7, 25),
    200: Math.max(s * 0.75, 30),
    300: Math.max(s * 0.8, 35),
    400: Math.max(s * 0.9, 40),
    500: s,
    600: Math.min(s * 1.05, 100),
    700: Math.min(s * 1.1, 100),
    800: Math.min(s * 1.1, 100),
    900: Math.min(s * 1.15, 100),
    950: Math.min(s * 1.2, 100),
  };

  const result = {} as Record<ShadeKey, string>;
  for (const key of SHADE_KEYS) {
    result[key] = hslToHex(h, saturationMap[key], lightnessMap[key]);
  }
  // Override 500 with the user's exact color
  result[500] = baseHex.toUpperCase();
  return result;
}

// ── Component ──

export default function TailwindColorsPage() {
  const t = useTranslations("toolTailwindColors");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [baseColor, setBaseColor] = useState("#0066FF");
  const [isDark, setIsDark] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const scale = useMemo(() => generateTailwindScale(baseColor), [baseColor]);

  const copyValue = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyFullScale = () => {
    const lines = SHADE_KEYS.map((k) => `  "${k}": "${scale[k]}",`).join("\n");
    const code = `"primary": {\n${lines}\n}`;
    navigator.clipboard.writeText(code);
    setCopiedKey("full");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyCssVars = () => {
    const lines = SHADE_KEYS.map((k) => `  --primary-${k}: ${scale[k]};`).join(
      "\n",
    );
    const code = `:root {\n${lines}\n}`;
    navigator.clipboard.writeText(code);
    setCopiedKey("css");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const randomize = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 35);
    const l = 45 + Math.floor(Math.random() * 15);
    setBaseColor(hslToHex(h, s, l));
  };

  // Preview theme colors — neutral backgrounds, accent only for UI elements
  const bg = isDark ? "#0a0a0a" : "#F5F5F5";
  const cardBg = isDark ? "#141414" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#111111";
  const textSecondary = isDark ? "#A0A0A0" : "#555555";
  const textMuted = isDark ? "#666666" : "#888888";
  const border = isDark ? "#262626" : "#E5E5E5";
  const accent = scale[500];
  const accentLight = isDark ? scale[900] : scale[50];
  const accentText = getContrastColor(accent);

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

          {/* Controls */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 md:p-10 flex flex-col gap-6 backdrop-blur-xl mb-12">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Color Picker */}
                <div className="flex flex-col gap-3 flex-1">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    {t("baseColor")}
                  </label>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 h-[60px]">
                    <ColorPicker
                      value={baseColor}
                      onChange={setBaseColor}
                      size="sm"
                    />
                    <input
                      type="text"
                      value={baseColor.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (/^#[0-9A-F]{0,6}$/i.test(val)) setBaseColor(val);
                      }}
                      className="flex-1 font-mono text-lg font-extrabold bg-transparent border-0 outline-none uppercase text-white"
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={randomize}
                    className="flex items-center justify-center gap-2 px-6 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-kolr-cyan transition-all duration-300 group h-[60px]"
                  >
                    <RefreshCw
                      size={18}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    {t("randomize")}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Color Scale */}
          <Reveal animation="reveal-up" delay={2}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">primary</h2>
              {/* Light / Dark toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDark(false)}
                  className={`text-sm font-semibold transition-colors ${!isDark ? "text-kolr-cyan" : "text-kolr-text-muted hover:text-white"}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setIsDark(!isDark)}
                  aria-label="Toggle dark mode"
                  className="relative w-12 h-6 rounded-full border border-white/20 transition-colors duration-300 bg-white/5"
                >
                  <div
                    className="absolute top-px w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
                    style={{
                      transform: isDark
                        ? "translateX(24px)"
                        : "translateX(2px)",
                    }}
                  />
                </button>
                <button
                  onClick={() => setIsDark(true)}
                  className={`text-sm font-semibold transition-colors ${isDark ? "text-kolr-cyan" : "text-kolr-text-muted hover:text-white"}`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Scale Strip */}
            <div className="flex rounded-2xl overflow-hidden mb-12">
              {SHADE_KEYS.map((shade) => (
                <button
                  key={shade}
                  onClick={() => copyValue(scale[shade], String(shade))}
                  aria-label={`Copy shade ${shade}`}
                  className="flex-1 flex flex-col items-center justify-between py-3 px-1 min-h-[100px] transition-all duration-200 hover:scale-y-110 hover:z-10 relative group cursor-pointer border-0"
                  style={{ backgroundColor: scale[shade] }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: getContrastColor(scale[shade]) }}
                  >
                    {shade}
                  </span>
                  <span
                    className="text-[10px] font-mono opacity-80 mt-auto"
                    style={{ color: getContrastColor(scale[shade]) }}
                  >
                    {copiedKey === String(shade) ? (
                      <Check size={12} />
                    ) : (
                      scale[shade].replace("#", "")
                    )}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Preview Section */}
          <Reveal animation="reveal-up" delay={3}>
            <h2 className="text-xl font-bold mb-2">{t("examples")}</h2>
            <p className="text-kolr-text-muted text-sm mb-6">
              {t("examplesDesc")}
            </p>

            <div
              className="rounded-[2rem] p-4 md:p-8 transition-colors duration-500 mb-12"
              style={{ backgroundColor: bg }}
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* CTA Card */}
                <PreviewCard bg={accentLight} border={border}>
                  <div className="p-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: accent, color: accentText }}
                    >
                      <Sparkles size={20} />
                    </div>
                    <h3
                      className="text-lg font-black mb-2"
                      style={{ color: textPrimary }}
                    >
                      {t("ctaTitle")}
                    </h3>
                    <p className="text-sm" style={{ color: textSecondary }}>
                      {t("ctaDesc")}
                    </p>
                  </div>
                </PreviewCard>

                {/* Categories */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6">
                    <h4
                      className="font-bold text-sm mb-4"
                      style={{ color: textPrimary }}
                    >
                      {t("categories")}
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { icon: <Camera size={18} />, label: t("catPhoto") },
                        { icon: <Heart size={18} />, label: t("catHealth") },
                        { icon: <Glasses size={18} />, label: t("catStyle") },
                        { icon: <Dumbbell size={18} />, label: t("catSport") },
                        { icon: <Eye size={18} />, label: t("catView") },
                        {
                          icon: <Settings size={18} />,
                          label: t("catSettings"),
                        },
                        { icon: <Upload size={18} />, label: t("catExport") },
                        { icon: <Sparkles size={18} />, label: t("catAI") },
                      ].map((cat, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: accentLight,
                              color: accent,
                            }}
                          >
                            {cat.icon}
                          </div>
                          <span
                            className="text-[10px] font-medium text-center"
                            style={{ color: textSecondary }}
                          >
                            {cat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PreviewCard>

                {/* Budget Tracker */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6 flex flex-col gap-3">
                    {[
                      {
                        label: t("budgetDesign"),
                        amount: "$10.000",
                        spent: "$8.250",
                        pct: 82,
                      },
                      {
                        label: t("budgetDev"),
                        amount: "$40.000",
                        spent: "$19.500",
                        pct: 49,
                      },
                      {
                        label: t("budgetMarketing"),
                        amount: "$5.500",
                        spent: "$3.200",
                        pct: 58,
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: accentLight,
                                color: accent,
                              }}
                            >
                              {i === 0 ? (
                                <Camera size={14} />
                              ) : i === 1 ? (
                                <Glasses size={14} />
                              ) : (
                                <Star size={14} />
                              )}
                            </div>
                            <span
                              className="text-xs font-bold"
                              style={{ color: textPrimary }}
                            >
                              {item.label}
                            </span>
                          </div>
                          <span
                            className="text-xs font-bold"
                            style={{ color: textPrimary }}
                          >
                            {item.amount}
                          </span>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: isDark ? "#262626" : "#E5E5E5",
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.pct}%`,
                              backgroundColor: accent,
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span
                            className="text-[10px]"
                            style={{ color: textMuted }}
                          >
                            {item.spent}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: textMuted }}
                          >
                            $
                            {(
                              parseFloat(item.amount.replace(/[^0-9.]/g, "")) -
                              parseFloat(item.spent.replace(/[^0-9.]/g, ""))
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PreviewCard>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Newsletter List */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6 flex flex-col gap-3">
                    {[
                      {
                        label: "Newsletter",
                        desc: t("msgSent1h"),
                        active: false,
                      },
                      {
                        label: t("existingCustomers"),
                        desc: t("msgSent2w"),
                        active: true,
                      },
                      {
                        label: t("trialUsers"),
                        desc: t("msgSent4d"),
                        active: false,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl transition-colors"
                        style={{
                          backgroundColor: item.active
                            ? accentLight
                            : "transparent",
                          border: `1px solid ${item.active ? accent : border}`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className="text-sm font-bold"
                              style={{ color: textPrimary }}
                            >
                              {item.label}
                            </p>
                            <p
                              className="text-[11px]"
                              style={{ color: textMuted }}
                            >
                              {item.desc}
                            </p>
                          </div>
                          {item.active && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: accent,
                                color: accentText,
                              }}
                            >
                              <Check size={12} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </PreviewCard>

                {/* Schedule */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="font-bold text-sm"
                        style={{ color: textPrimary }}
                      >
                        Schedule
                      </h4>
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: accentLight, color: accent }}
                      >
                        <Calendar size={12} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          time: "9:15",
                          period: "AM",
                          title: t("schedMeeting"),
                          desc: t("schedMeetingDesc"),
                        },
                        {
                          time: "4:00",
                          period: "PM",
                          title: t("schedPitch"),
                          desc: t("schedPitchDesc"),
                        },
                        {
                          time: "7:30",
                          period: "PM",
                          title: t("schedReview"),
                          desc: t("schedReviewDesc"),
                        },
                      ].map((event, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 rounded-xl"
                          style={{ backgroundColor: accentLight }}
                        >
                          <div className="flex flex-col items-center">
                            <span
                              className="text-lg font-black"
                              style={{ color: textPrimary }}
                            >
                              {event.time}
                            </span>
                            <span
                              className="text-[9px] font-bold"
                              style={{ color: textMuted }}
                            >
                              {event.period}
                            </span>
                          </div>
                          <div
                            className="border-l-2 pl-3"
                            style={{ borderColor: accent }}
                          >
                            <p
                              className="text-xs font-bold"
                              style={{ color: textPrimary }}
                            >
                              {event.title}
                            </p>
                            <p
                              className="text-[10px]"
                              style={{ color: textSecondary }}
                            >
                              {event.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PreviewCard>

                {/* Profile Card */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6 flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-xl font-black"
                      style={{
                        backgroundColor: accent,
                        color: accentText,
                        boxShadow: `0 0 0 2px ${cardBg}, 0 0 0 4px ${accent}`,
                      }}
                    >
                      SJ
                    </div>
                    <h4
                      className="font-bold text-sm"
                      style={{ color: textPrimary }}
                    >
                      Sarah Jones
                    </h4>
                    <p
                      className="text-[11px] mb-4"
                      style={{ color: textSecondary }}
                    >
                      Product designer
                    </p>
                    <div className="flex gap-6 mb-4 w-full justify-center">
                      {[
                        { label: "Posts", value: "248" },
                        { label: "Followers", value: "12.4k" },
                        { label: "Following", value: "573" },
                      ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <span
                            className="text-sm font-black"
                            style={{ color: textPrimary }}
                          >
                            {s.value}
                          </span>
                          <span
                            className="text-[9px]"
                            style={{ color: textMuted }}
                          >
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full py-2 rounded-lg text-xs font-bold transition-colors"
                      style={{ backgroundColor: accent, color: accentText }}
                    >
                      Follow
                    </button>
                  </div>
                </PreviewCard>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Stats */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          label: t("statSubscribers"),
                          value: "71,842",
                          prev: "70,946",
                          change: "+12%",
                          positive: true,
                        },
                        {
                          label: t("statOpenRate"),
                          value: "58.16%",
                          prev: "56.14%",
                          change: "+2.02%",
                          positive: true,
                        },
                        {
                          label: t("statClickRate"),
                          value: "24.57%",
                          prev: "28.62%",
                          change: "-4.05%",
                          positive: false,
                        },
                      ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: textMuted }}
                          >
                            {stat.label}
                          </span>
                          <span
                            className="text-xl font-black"
                            style={{ color: accent }}
                          >
                            {stat.value}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className="text-[10px]"
                              style={{ color: textMuted }}
                            >
                              from {stat.prev}
                            </span>
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{
                                backgroundColor: stat.positive
                                  ? isDark
                                    ? "#10B98120"
                                    : "#10B98115"
                                  : isDark
                                    ? "#F43F5E20"
                                    : "#F43F5E15",
                                color: stat.positive ? "#10B981" : "#F43F5E",
                              }}
                            >
                              {stat.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mini Bar Chart */}
                    <div className="flex items-end gap-2 mt-5 h-24">
                      {[40, 55, 30, 65, 45, 70, 50, 80, 60, 45, 75, 55].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all duration-500"
                            style={{
                              height: `${h}%`,
                              backgroundColor:
                                i >= 9
                                  ? accent
                                  : isDark
                                    ? "#262626"
                                    : "#E0E0E0",
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </PreviewCard>

                {/* Pricing */}
                <PreviewCard bg={cardBg} border={border}>
                  <div className="p-6">
                    <h4
                      className="font-bold text-sm mb-4"
                      style={{ color: textPrimary }}
                    >
                      {t("pricingTitle")}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          plan: t("pricingFree"),
                          price: "$0",
                          desc: t("pricingFreeDesc"),
                          featured: false,
                        },
                        {
                          plan: t("pricingTeam"),
                          price: "$99",
                          desc: t("pricingTeamDesc"),
                          featured: true,
                        },
                        {
                          plan: t("pricingPro"),
                          price: "$199",
                          desc: t("pricingProDesc"),
                          featured: false,
                        },
                      ].map((plan, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl flex flex-col gap-2"
                          style={{
                            backgroundColor: plan.featured
                              ? accent
                              : isDark
                                ? "#1a1a1a"
                                : "#F5F5F5",
                            border: plan.featured
                              ? "none"
                              : `1px solid ${border}`,
                          }}
                        >
                          <span
                            className="text-[11px] font-bold"
                            style={{
                              color: plan.featured ? accentText : textPrimary,
                            }}
                          >
                            {plan.plan}
                          </span>
                          <div className="flex items-baseline gap-0.5">
                            <span
                              className="text-xl font-black"
                              style={{
                                color: plan.featured ? accentText : accent,
                              }}
                            >
                              {plan.price}
                            </span>
                            <span
                              className="text-[9px]"
                              style={{
                                color: plan.featured
                                  ? `${accentText}99`
                                  : textMuted,
                              }}
                            >
                              /mo
                            </span>
                          </div>
                          <p
                            className="text-[10px] leading-snug"
                            style={{
                              color: plan.featured
                                ? `${accentText}BB`
                                : textSecondary,
                            }}
                          >
                            {plan.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </PreviewCard>
              </div>
            </div>
          </Reveal>

          {/* Export */}
          <Reveal animation="reveal-up" delay={4}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 md:p-10 backdrop-blur-xl mb-16">
              <div className="flex flex-col gap-6">
                {/* Tailwind Config */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                      Tailwind Config
                    </label>
                    <button
                      onClick={copyFullScale}
                      className={`flex items-center gap-1 text-xs font-bold transition-colors ${copiedKey === "full" ? "text-kolr-green" : "text-kolr-text-muted hover:text-white"}`}
                    >
                      {copiedKey === "full" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedKey === "full" ? t("copied") : t("copy")}
                    </button>
                  </div>
                  <pre className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs text-kolr-cyan overflow-x-auto">
                    {`"primary": {\n${SHADE_KEYS.map((k) => `  "${k}": "${scale[k]}"`).join(",\n")}\n}`}
                  </pre>
                </div>

                {/* CSS Variables */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                      CSS Variables
                    </label>
                    <button
                      onClick={copyCssVars}
                      className={`flex items-center gap-1 text-xs font-bold transition-colors ${copiedKey === "css" ? "text-kolr-green" : "text-kolr-text-muted hover:text-white"}`}
                    >
                      {copiedKey === "css" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedKey === "css" ? t("copied") : t("copy")}
                    </button>
                  </div>
                  <pre className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs text-kolr-purple overflow-x-auto">
                    {`:root {\n${SHADE_KEYS.map((k) => `  --primary-${k}: ${scale[k]};`).join("\n")}\n}`}
                  </pre>
                </div>
              </div>
            </div>
          </Reveal>
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

// ── Subcomponents ──

function PreviewCard({
  children,
  bg,
  border,
}: {
  children: React.ReactNode;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      {children}
    </div>
  );
}
