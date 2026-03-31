import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import ColorPageClient from "@/components/ColorPageClient";
import {
  hexToRgb, rgbToHsl, rgbToCmyk, rgbToOklch, hslToHex,
  getColorName, getContrastColor, luminance, contrastRatio,
  getColorFamily, getPsychologyKey, getSaturationDesc, getLightnessDesc,
  getUsageSuggestions,
} from "@/lib/color-utils";

export default async function ColorPage({
  params,
}: {
  params: Promise<{ locale: string; hex: string }>;
}) {
  const { locale, hex: hexParam } = await params;
  const upperHex = hexParam.toUpperCase();
  const hex = `#${upperHex}`;

  const t = await getTranslations({ locale, namespace: "colorPage" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const valid = /^[0-9A-F]{3,8}$/i.test(upperHex);
  if (!valid) {
    return (
      <div className="bg-kolr-bg text-white min-h-screen flex items-center justify-center">
        <p className="text-kolr-text-muted text-lg">Invalid color code</p>
      </div>
    );
  }

  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [c, m, y, k] = rgbToCmyk(r, g, b);
  const [okL, okC, okH] = rgbToOklch(r, g, b);
  const colorName = getColorName(h, s, l);
  const isWarm = (h >= 0 && h < 70) || h >= 310;

  const colorLum = luminance(r, g, b);
  const whiteLum = luminance(255, 255, 255);
  const blackLum = luminance(0, 0, 0);
  const contrastOnWhite = contrastRatio(colorLum, whiteLum);
  const contrastOnBlack = contrastRatio(colorLum, blackLum);

  const colorFamily = getColorFamily(h, s, l);
  const usageSuggestions = getUsageSuggestions(l, s);

  // Generate palettes
  const complementary = Array.from({ length: 5 }, (_, i) => {
    const newH = (h + 180 + (i - 2) * 15) % 360;
    return hslToHex(newH, s, Math.max(20, Math.min(80, l + (i - 2) * 8)));
  });

  const analogous = Array.from({ length: 5 }, (_, i) =>
    hslToHex((h + (i - 2) * 25 + 360) % 360, s, l)
  );

  const triadic = [
    hslToHex(h, s, l),
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
    hslToHex((h + 120) % 360, Math.max(20, s - 20), Math.min(85, l + 15)),
    hslToHex((h + 240) % 360, Math.max(20, s - 20), Math.min(85, l + 15)),
  ];

  const monochromatic = Array.from({ length: 5 }, (_, i) =>
    hslToHex(h, s, 15 + i * 17)
  );

  const shades = Array.from({ length: 10 }, (_, i) =>
    hslToHex(h, s, Math.round(l * (1 - (i + 1) / 11)))
  );

  const tints = Array.from({ length: 10 }, (_, i) =>
    hslToHex(h, s, Math.round(l + (100 - l) * ((i + 1) / 11)))
  );

  const palettes = [
    { name: t("complementary"), colors: complementary },
    { name: t("analogous"), colors: analogous },
    { name: t("triadic"), colors: triadic },
    { name: t("monochromatic"), colors: monochromatic },
  ];

  // Serialize translations for client component
  const tClient: Record<string, string> = {};
  const clientKeys = [
    "conversions", "properties", "hue", "saturation", "lightness",
    "brightness", "temperature", "warm", "cool", "relatedPalettes",
    "shades", "tints",
  ];
  for (const key of clientKeys) {
    tClient[key] = t(key);
  }

  const tNavClient: Record<string, string> = { home: tNav("home") };

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8 pb-16">
        <div className="container max-w-[900px]">
          <Reveal animation="reveal-up">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
            >
              <ArrowLeft size={18} />
              <span>{tNav("home")}</span>
            </Link>

            <header className="mb-10 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {colorName}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2 font-mono">{hex}</p>
            </header>
          </Reveal>

          {/* Large Preview */}
          <Reveal animation="reveal-scale" delay={1}>
            <div
              className="h-[200px] rounded-[2rem] mb-10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              style={{ backgroundColor: hex }}
            >
              <span
                className="font-mono text-2xl font-bold opacity-60"
                style={{ color: getContrastColor(hex) }}
              >
                {hex}
              </span>
            </div>
          </Reveal>

          {/* Interactive sections (client) */}
          <ColorPageClient
            hex={hex}
            locale={locale}
            r={r} g={g} b={b}
            h={h} s={s} l={l}
            okL={okL} okC={okC} okH={okH}
            c={c} m={m} y={y} k={k}
            isWarm={isWarm}
            palettes={palettes}
            shades={shades}
            tints={tints}
            t={tClient}
            tNav={tNavClient}
          />

          {/* About This Color - SSR */}
          <Reveal animation="reveal-up" delay={4}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <h2 className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("aboutTitle")}
              </h2>
              <div className="flex flex-col gap-4 text-sm text-kolr-text-muted leading-relaxed">
                <p>
                  {t("descIntro", {
                    name: colorName,
                    hex,
                    temperature: isWarm ? t("warm").toLowerCase() : t("cool").toLowerCase(),
                    family: colorFamily,
                    hue: String(h),
                    saturation: String(s),
                    lightness: String(l),
                  })}
                </p>
                <p>{t(getSaturationDesc(s))}</p>
                <p>{t(getLightnessDesc(l))}</p>
              </div>
            </div>
          </Reveal>

          {/* Color Psychology - SSR */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <h2 className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("psychologyTitle")}
              </h2>
              <p className="text-sm text-kolr-text-muted leading-relaxed">
                {t(getPsychologyKey(colorFamily))}
              </p>
            </div>
          </Reveal>

          {/* Usage in Design - SSR */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <h2 className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("usageTitle")}
              </h2>
              <div className="flex flex-col gap-2">
                {usageSuggestions.map((key, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} className="text-kolr-green shrink-0" />
                    <span className="text-sm text-kolr-text-muted">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Accessibility - SSR */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <h2 className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-5">
                {t("a11yTitle")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-2">
                    {t("a11yOnWhite")}
                  </span>
                  <span className="text-2xl font-bold text-white mb-3 block">{contrastOnWhite}:1</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { label: t("a11yAA"), pass: contrastOnWhite >= 4.5 },
                      { label: t("a11yAALarge"), pass: contrastOnWhite >= 3 },
                      { label: t("a11yAAA"), pass: contrastOnWhite >= 7 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {item.pass
                          ? <CheckCircle2 size={12} className="text-kolr-green" />
                          : <XCircle size={12} className="text-kolr-red" />}
                        <span className="text-xs text-kolr-text-muted">{item.label}</span>
                        <span className={`text-xs font-bold ml-auto ${item.pass ? "text-kolr-green" : "text-kolr-red"}`}>
                          {item.pass ? t("a11yPass") : t("a11yFail")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-kolr-text-muted mb-2">
                    {t("a11yOnBlack")}
                  </span>
                  <span className="text-2xl font-bold text-white mb-3 block">{contrastOnBlack}:1</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { label: t("a11yAA"), pass: contrastOnBlack >= 4.5 },
                      { label: t("a11yAALarge"), pass: contrastOnBlack >= 3 },
                      { label: t("a11yAAA"), pass: contrastOnBlack >= 7 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {item.pass
                          ? <CheckCircle2 size={12} className="text-kolr-green" />
                          : <XCircle size={12} className="text-kolr-red" />}
                        <span className="text-xs text-kolr-text-muted">{item.label}</span>
                        <span className={`text-xs font-bold ml-auto ${item.pass ? "text-kolr-green" : "text-kolr-red"}`}>
                          {item.pass ? t("a11yPass") : t("a11yFail")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-kolr-text-muted/60 leading-relaxed">{t("a11yNote")}</p>
            </div>
          </Reveal>

          {/* CSS Usage - SSR */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-xl mb-8">
              <h2 className="font-bold uppercase text-xs tracking-widest text-kolr-text-muted mb-3">
                {t("cssUsageTitle")}
              </h2>
              <p className="text-sm text-kolr-text-muted mb-4">{t("cssUsageDesc")}</p>
              <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-kolr-text-muted leading-loose overflow-x-auto">
                <div><span className="text-kolr-purple">color</span>: {hex};</div>
                <div><span className="text-kolr-purple">color</span>: rgb({r}, {g}, {b});</div>
                <div><span className="text-kolr-purple">color</span>: hsl({h}, {s}%, {l}%);</div>
                <div><span className="text-kolr-purple">color</span>: oklch({okL} {okC} {okH});</div>
                <div><span className="text-kolr-purple">--my-color</span>: {hex};</div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
