"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* section -> padding via Tailwind */}
      <section className="section">
        {/* container + max-width 900px */}
        <div className="container max-w-[900px]">
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
            <div className="text-lg leading-8 text-kolr-text mb-12">
              <p className="mb-6">{t("description")}</p>
              <p className="mb-8">{t("story")}</p>
            </div>
          </Reveal>

          {/* Our Mission Section */}
          <Reveal animation="reveal-up" delay={3}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">
                {t("ourMission.title")}
              </h2>
              <p className="text-lg leading-8 text-kolr-text">
                {t("ourMission.content")}
              </p>
            </div>
          </Reveal>

          {/* The Story Behind Kolr */}
          <Reveal animation="reveal-up" delay={4}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">{t("theStory.title")}</h2>
              <div className="text-lg leading-8 text-kolr-text space-y-6">
                <p>{t("theStory.content")}</p>
                <p>{t("theStory.content2")}</p>
                <p>{t("theStory.content3")}</p>
              </div>
            </div>
          </Reveal>

          {/* What Makes Us Different */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {t("whatMakesUsDifferent.title")}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Intelligent Analysis */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("whatMakesUsDifferent.intelligent.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("whatMakesUsDifferent.intelligent.description")}
                  </p>
                </div>

                {/* Privacy First */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("whatMakesUsDifferent.privacy.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("whatMakesUsDifferent.privacy.description")}
                  </p>
                </div>

                {/* Accessibility */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("whatMakesUsDifferent.accessibility.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("whatMakesUsDifferent.accessibility.description")}
                  </p>
                </div>

                {/* Education */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("whatMakesUsDifferent.education.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("whatMakesUsDifferent.education.description")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* The Technology */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">
                {t("technology.title")}
              </h2>
              <p className="text-lg leading-8 text-kolr-text">
                {t("technology.content")}
              </p>
            </div>
          </Reveal>

          {/* Who Uses Kolr */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {t("forWhom.title")}
              </h2>
              <div className="space-y-6">
                {/* Designers */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("forWhom.designers.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("forWhom.designers.description")}
                  </p>
                </div>

                {/* Developers */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("forWhom.developers.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("forWhom.developers.description")}
                  </p>
                </div>

                {/* Artists */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("forWhom.artists.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("forWhom.artists.description")}
                  </p>
                </div>

                {/* Photographers */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("forWhom.photographers.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("forWhom.photographers.description")}
                  </p>
                </div>

                {/* Everyone */}
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-3">
                    {t("forWhom.everyone.title")}
                  </h3>
                  <p className="text-kolr-text leading-7">
                    {t("forWhom.everyone.description")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Our Commitment */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">
                {t("commitment.title")}
              </h2>
              <div className="text-lg leading-8 text-kolr-text space-y-6">
                <p>{t("commitment.content")}</p>
                <p>{t("commitment.content2")}</p>
              </div>
            </div>
          </Reveal>

          {/* Contact Section */}
          <Reveal animation="reveal-up" delay={5}>
            <div className="bg-kolr-surface border border-kolr-border rounded-3xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">{t("contact.title")}</h2>
              <p className="text-lg text-kolr-text mb-6">
                {t("contact.content")}
              </p>
              <p className="text-kolr-text mb-6">
                {t("contact.email")}{" "}
                <a
                  href="mailto:antoine.granier@protonmail.com"
                  className="text-kolr-primary hover:underline font-semibold"
                >
                  antoine.granier@protonmail.com
                </a>
              </p>
              <a
                href="mailto:antoine.granier@protonmail.com"
                className="btn-primary"
              >
                {t("contact.button")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
