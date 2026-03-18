"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  Download,
  Copy,
  ArrowRight,
  Layers,
  Palette,
  Zap,
  CheckCircle2,
  Code,
  FileJson,
  FileCode,
} from "lucide-react";

export default function IntegrationsPage() {
  const t = useTranslations("integrations");
  const locale = useLocale();

  const figmaFeatures = [
    t("figmaFeature1"),
    t("figmaFeature2"),
    t("figmaFeature3"),
    t("figmaFeature4"),
  ];

  const sketchFeatures = [
    t("sketchFeature1"),
    t("sketchFeature2"),
    t("sketchFeature3"),
    t("sketchFeature4"),
  ];

  const chromeFeatures = [
    t("chromeFeature1"),
    t("chromeFeature2"),
    t("chromeFeature4"),
  ];

  const steps = [
    {
      icon: <Palette size={24} />,
      title: t("step1Title"),
      desc: t("step1Desc"),
      color: "kolr-cyan",
    },
    {
      icon: <Download size={24} />,
      title: t("step2Title"),
      desc: t("step2Desc"),
      color: "kolr-purple",
    },
    {
      icon: <Layers size={24} />,
      title: t("step3Title"),
      desc: t("step3Desc"),
      color: "kolr-green",
    },
  ];

  const formats = [
    { icon: <Code size={18} />, name: t("featureCss"), color: "kolr-cyan" },
    {
      icon: <FileJson size={18} />,
      name: t("featureJson"),
      color: "kolr-purple",
    },
    { icon: <Copy size={18} />, name: t("featureHex"), color: "kolr-green" },
    {
      icon: <FileCode size={18} />,
      name: t("featureSvg"),
      color: "kolr-orange",
    },
    { icon: <Zap size={18} />, name: t("featureTailwind"), color: "kolr-cyan" },
    {
      icon: <FileCode size={18} />,
      name: t("featureScss"),
      color: "kolr-purple",
    },
  ];

  return (
    <section className="section">
      <div className="container max-w-[1100px]">
        {/* Hero */}
        <Reveal animation="reveal-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kolr-surface border border-kolr-border rounded-full mb-6">
              <Layers size={16} className="text-kolr-purple" />
              <span className="text-sm font-bold text-kolr-text-muted">
                Figma · Sketch · Chrome
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-kolr-text-muted max-w-[600px] mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        {/* Integration Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6 h-full hover:border-kolr-purple/50 transition-all duration-300">
              {/* Figma Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-kolr-purple/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 38 57" fill="none">
                    <path
                      d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
                      fill="#1ABCFE"
                    />
                    <path
                      d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
                      fill="#0ACF83"
                    />
                    <path
                      d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
                      fill="#FF7262"
                    />
                    <path
                      d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
                      fill="#F24E1E"
                    />
                    <path
                      d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
                      fill="#A259FF"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t("figmaTitle")}</h2>
                  <span className="text-xs font-bold text-kolr-purple bg-kolr-purple/10 px-2 py-0.5 rounded-full">
                    {t("comingSoon")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-kolr-text-muted leading-relaxed mb-5">
                {t("figmaDesc")}
              </p>
              <div className="flex flex-col gap-2.5">
                {figmaFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={14}
                      className="text-kolr-purple shrink-0"
                    />
                    <span className="text-sm text-kolr-text-muted">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal animation="reveal-up" delay={2}>
            <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6 h-full hover:border-kolr-orange/50 transition-all duration-300">
              {/* Sketch Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-kolr-orange/10 flex items-center justify-center">
                  <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
                    <path
                      d="M5.25 0.5L12 0L18.75 0.5L24 8L12 22L0 8L5.25 0.5Z"
                      fill="#FDB300"
                    />
                    <path d="M5.0625 8L12 22L0 8H5.0625Z" fill="#EA6C00" />
                    <path d="M18.9375 8L12 22L24 8H18.9375Z" fill="#EA6C00" />
                    <path
                      d="M5.0625 8H18.9375L12 22L5.0625 8Z"
                      fill="#FDAD00"
                    />
                    <path d="M12 0L5.25 0.5L5.0625 8L12 0Z" fill="#FDD231" />
                    <path d="M12 0L18.75 0.5L18.9375 8L12 0Z" fill="#FDD231" />
                    <path d="M24 8L18.75 0.5L18.9375 8H24Z" fill="#FDAD00" />
                    <path d="M0 8L5.25 0.5L5.0625 8H0Z" fill="#FDAD00" />
                    <path d="M12 0L5.0625 8H18.9375L12 0Z" fill="#FEEEB7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t("sketchTitle")}</h2>
                  <span className="text-xs font-bold text-kolr-orange bg-kolr-orange/10 px-2 py-0.5 rounded-full">
                    {t("comingSoon")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-kolr-text-muted leading-relaxed mb-5">
                {t("sketchDesc")}
              </p>
              <div className="flex flex-col gap-2.5">
                {sketchFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={14}
                      className="text-kolr-orange shrink-0"
                    />
                    <span className="text-sm text-kolr-text-muted">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal animation="reveal-up" delay={3}>
            <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6 h-full hover:border-kolr-cyan/50 transition-all duration-300">
              {/* Chrome Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-kolr-cyan/10 flex items-center justify-center">
                  <img src="/chrome-logo.svg" alt="Chrome" width={24} height={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t("chromeTitle")}</h2>
                  <span className="text-xs font-bold text-kolr-cyan bg-kolr-cyan/10 px-2 py-0.5 rounded-full">
                    {t("comingSoon")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-kolr-text-muted leading-relaxed mb-5">
                {t("chromeDesc")}
              </p>
              <div className="flex flex-col gap-2.5">
                {chromeFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={14}
                      className="text-kolr-cyan shrink-0"
                    />
                    <span className="text-sm text-kolr-text-muted">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* How It Works */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">{t("howTitle")}</h2>
            <p className="text-kolr-text-muted">{t("howSubtitle")}</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="contents">
              <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 text-center relative flex flex-col items-center min-h-[250px]">
                <div
                  className={`w-14 h-14 rounded-2xl bg-${step.color}/10 text-${step.color} flex items-center justify-center mb-5`}
                >
                  {step.icon}
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-kolr-text-muted">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-kolr-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
              {i < 2 && (
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight size={20} className="text-kolr-text-muted/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Export Formats */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">{t("featuresTitle")}</h2>
            <p className="text-kolr-text-muted">{t("featuresSubtitle")}</p>
          </div>
        </Reveal>

        <Reveal animation="reveal-up" delay={2}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {formats.map((fmt, i) => (
              <div
                key={i}
                className="bg-kolr-surface border border-kolr-border rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-all duration-200"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-${fmt.color}/10 text-${fmt.color} flex items-center justify-center shrink-0`}
                >
                  {fmt.icon}
                </div>
                <span className="text-sm font-semibold">{fmt.name}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="bg-gradient-to-br from-kolr-purple/10 via-kolr-cyan/5 to-kolr-green/10 border border-kolr-border rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-3">{t("ctaTitle")}</h2>
            <p className="text-kolr-text-muted mb-6 max-w-[500px] mx-auto">
              {t("ctaDesc")}
            </p>
            <Link
              href={`/${locale}/tools/random`}
              className="inline-flex items-center gap-2 bg-kolr-cyan text-black px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity duration-200 no-underline"
            >
              {t("ctaButton")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
