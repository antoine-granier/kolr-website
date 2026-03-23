"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  Accessibility,
  Eye,
  Keyboard,
  Monitor,
  Type,
  MousePointer,
  CheckCircle2,
  Globe,
  Zap,
  Focus,
} from "lucide-react";

export default function AccessibilityPage() {
  const locale = useLocale();
  const t = useTranslations("accessibility");

  const features = [
    {
      icon: <Type size={22} />,
      title: t("textSizeTitle"),
      desc: t("textSizeDesc"),
      color: "text-kolr-cyan",
      bg: "bg-kolr-cyan/10",
    },
    {
      icon: <Monitor size={22} />,
      title: t("contrastTitle"),
      desc: t("contrastDesc"),
      color: "text-kolr-purple",
      bg: "bg-kolr-purple/10",
    },
    {
      icon: <Zap size={22} />,
      title: t("motionTitle"),
      desc: t("motionDesc"),
      color: "text-kolr-green",
      bg: "bg-kolr-green/10",
    },
    {
      icon: <Eye size={22} />,
      title: t("colorblindTitle"),
      desc: t("colorblindDesc"),
      color: "text-kolr-orange",
      bg: "bg-kolr-orange/10",
    },
    {
      icon: <Focus size={22} />,
      title: t("focusTitle"),
      desc: t("focusDesc"),
      color: "text-kolr-cyan",
      bg: "bg-kolr-cyan/10",
    },
    {
      icon: <MousePointer size={22} />,
      title: t("cursorTitle"),
      desc: t("cursorDesc"),
      color: "text-kolr-purple",
      bg: "bg-kolr-purple/10",
    },
    {
      icon: <Keyboard size={22} />,
      title: t("keyboardTitle"),
      desc: t("keyboardDesc"),
      color: "text-kolr-green",
      bg: "bg-kolr-green/10",
    },
    {
      icon: <Globe size={22} />,
      title: t("screenReaderTitle"),
      desc: t("screenReaderDesc"),
      color: "text-kolr-orange",
      bg: "bg-kolr-orange/10",
    },
  ];

  const standards = [
    t("standard1"),
    t("standard2"),
    t("standard3"),
    t("standard4"),
    t("standard5"),
    t("standard6"),
    t("standard7"),
    t("standard8"),
  ];

  return (
    <section className="section">
      <div className="container max-w-[800px]">
        {/* Hero */}
        <Reveal animation="reveal-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kolr-surface border border-kolr-border rounded-full mb-6">
              <Accessibility size={16} className="text-kolr-cyan" />
              <span className="text-sm font-bold text-kolr-text-muted"><abbr title="Web Content Accessibility Guidelines">WCAG</abbr> <abbr title="Level AA Conformance">AA</abbr></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
            <p className="text-lg text-kolr-text-muted max-w-[550px] mx-auto">{t("subtitle")}</p>
          </div>
        </Reveal>

        {/* Commitment */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="bg-gradient-to-br from-kolr-cyan/5 via-kolr-purple/5 to-kolr-green/5 border border-white/[0.08] rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-3">{t("commitTitle")}</h2>
            <p className="text-kolr-text-muted leading-relaxed">{t("commitDesc")}</p>
          </div>
        </Reveal>

        {/* Widget Features */}
        <Reveal animation="reveal-up" delay={2}>
          <h2 className="text-2xl font-bold mb-6">{t("widgetTitle")}</h2>
          <p className="text-kolr-text-muted mb-8">{t("widgetDesc")}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {features.map((feature, i) => (
            <Reveal key={i} animation="reveal-up" delay={Math.min(i + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5}>
              <div className="bg-kolr-surface border border-kolr-border rounded-xl p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold">{feature.title}</h3>
                </div>
                <p className="text-sm text-kolr-text-muted leading-relaxed">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Technical Standards */}
        <Reveal animation="reveal-up" delay={1}>
          <h2 className="text-2xl font-bold mb-6">{t("standardsTitle")}</h2>
          <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
            <div className="flex flex-col gap-3">
              {standards.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-kolr-green shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contact */}
        <Reveal animation="reveal-up" delay={2}>
          <div className="text-center mt-12">
            <p className="text-kolr-text-muted">
              {t("contact")}{" "}
              <Link href={`/${locale}/contact`} className="text-kolr-cyan no-underline hover:underline">
                antoine.granier@protonmail.com
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
