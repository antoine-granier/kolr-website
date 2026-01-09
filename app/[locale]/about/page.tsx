"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* section -> padding via Tailwind */}
      <section className="section">
        {/* container + max-width 800px */}
        <div className="container max-w-[800px]">
          {/* Titre */}
          <Reveal animation="reveal-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              {t("title")}
            </h1>
          </Reveal>

          {/* Carte logo */}
          <Reveal animation="reveal-up" delay={1}>
            <div className="bg-kolr-surface border border-kolr-border rounded-3xl p-12 mb-12">
              <div className="flex justify-center items-center gap-8 mb-8">
                <img
                  src="/logo-dark.png"
                  alt="Kolr Logo"
                  className="h-32 w-auto"
                />
              </div>
            </div>
          </Reveal>

          {/* Texte description + story */}
          <Reveal animation="reveal-up" delay={2}>
            <div className="text-lg leading-8 text-kolr-text mb-8">
              <p className="mb-6">{t("description")}</p>
              <p className="mb-8">{t("story")}</p>
            </div>
          </Reveal>

          {/* Bouton contact */}
          <Reveal animation="reveal-up" delay={3}>
            <div className="text-center">
              <a href="mailto:support@kolr.app" className="btn-primary">
                {t("contact")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
