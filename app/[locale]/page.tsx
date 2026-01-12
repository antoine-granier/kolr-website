"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import Reveal from "@/components/Reveal";
import PalettePreview from "@/components/PalettePreview";
import {
  Palette,
  Pipette,
  ImageIcon,
  ArrowRight,
  CircleSlash2,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations("hero");
  const tFeatures = useTranslations("features");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tHomepage = useTranslations("homepage");
  const locale = useLocale();

  return (
    <>
      {/* Hero Section */}
      <section className="section min-h-[90vh] flex items-center pt-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal animation="reveal-up">
              <div className="text-left">
                <p className="text-xl text-kolr-cyan font-bold mb-4 uppercase tracking-[0.1em]">
                  {t("tagline")}
                </p>

                <h1 className="text-[clamp(3rem,8vw,4.5rem)] font-black mb-8 leading-[1.1] tracking-tighter">
                  {t("title")}{" "}
                  <span className="gradient-text">{tCommon("masterpieces")}</span>
                </h1>

                <p className="text-xl text-kolr-text-muted mb-12 leading-relaxed max-w-[600px]">
                  {t("description")}
                </p>

                <div className="flex gap-6 flex-wrap">
                  <Link href={`/${locale}/download`} className="btn-primary">
                    {t("downloadNow")}
                  </Link>
                  <Link href={`/${locale}/features`} className="btn-secondary">
                    {t("learnMore")}
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal animation="reveal-scale" delay={2}>
              <div className="flex justify-center items-center">
                <PalettePreview />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quick Features Preview */}
      <section className="section bg-kolr-surface">
        <div className="container">
          <Reveal animation="reveal-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">{tFeatures("title")}</h2>
              <p className="text-xl text-kolr-text-muted max-w-[700px] mx-auto">
                {tFeatures("subtitle")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Reveal animation="reveal-up" delay={1}>
              <FeatureCard
                icon="📸"
                color="var(--kolr-cyan)"
                title={tFeatures("photoExtraction.title")}
                description={tFeatures("photoExtraction.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={2}>
              <FeatureCard
                icon="📷"
                color="var(--kolr-green)"
                title={tFeatures("cameraIntegration.title")}
                description={tFeatures("cameraIntegration.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={3}>
              <FeatureCard
                icon="🎲"
                color="var(--kolr-orange)"
                title={tFeatures("randomGenerator.title")}
                description={tFeatures("randomGenerator.description")}
              />
            </Reveal>
            <Reveal animation="reveal-up" delay={4}>
              <FeatureCard
                icon="🎨"
                color="var(--kolr-purple)"
                title={tFeatures("colorPicker.title")}
                description={tFeatures("colorPicker.description")}
              />
            </Reveal>
          </div>

          <Reveal animation="reveal-up" delay={5}>
            <div className="text-center">
              <Link
                href={`/${locale}/features`}
                className="inline-flex items-center gap-3 text-lg font-bold text-kolr-cyan hover:text-white transition-colors duration-200 group"
              >
                <span>{tCommon("discoverFeatures")}</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tools Section */}
      <section className="section">
        <div className="container">
          <Reveal animation="reveal-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">{tHomepage("toolsTitle")}</h2>
              <p className="text-xl text-kolr-text-muted max-w-[700px] mx-auto">
                {tHomepage("toolsDescription")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal animation="reveal-up" delay={1}>
              <Link
                href={`/${locale}/tools/random`}
                className="group block bg-kolr-surface border border-kolr-border rounded-3xl p-8 hover:-translate-y-2 hover:border-kolr-cyan transition-all duration-300 no-underline"
              >
                <div className="w-16 h-16 rounded-2xl bg-kolr-cyan/10 text-kolr-cyan flex items-center justify-center mb-6 group-hover:bg-kolr-cyan group-hover:text-black transition-all duration-300">
                  <Palette size={32} />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-white">
                  {tNav("toolRandom")}
                </h3>
                <p className="text-kolr-text-muted text-base leading-relaxed">
                  {tNav("toolRandomDesc")}
                </p>
                <div className="flex items-center gap-2 text-kolr-cyan font-bold mt-6 group-hover:gap-3 transition-all duration-200">
                  <span>{tCommon("tryNow")}</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            </Reveal>

            <Reveal animation="reveal-up" delay={2}>
              <Link
                href={`/${locale}/tools/color-extract`}
                className="group block bg-kolr-surface border border-kolr-border rounded-3xl p-8 hover:-translate-y-2 hover:border-kolr-purple transition-all duration-300 no-underline"
              >
                <div className="w-16 h-16 rounded-2xl bg-kolr-purple/10 text-kolr-purple flex items-center justify-center mb-6 group-hover:bg-kolr-purple group-hover:text-black transition-all duration-300">
                  <Pipette size={32} />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-white">
                  {tNav("toolColor")}
                </h3>
                <p className="text-kolr-text-muted text-base leading-relaxed">
                  {tNav("toolColorDesc")}
                </p>
                <div className="flex items-center gap-2 text-kolr-purple font-bold mt-6 group-hover:gap-3 transition-all duration-200">
                  <span>Try it now</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            </Reveal>

            <Reveal animation="reveal-up" delay={3}>
              <Link
                href={`/${locale}/tools/image-extract`}
                className="group block bg-kolr-surface border border-kolr-border rounded-3xl p-8 hover:-translate-y-2 hover:border-kolr-green transition-all duration-300 no-underline"
              >
                <div className="w-16 h-16 rounded-2xl bg-kolr-green/10 text-kolr-green flex items-center justify-center mb-6 group-hover:bg-kolr-green group-hover:text-black transition-all duration-300">
                  <ImageIcon size={32} />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-white">
                  {tNav("toolImage")}
                </h3>
                <p className="text-kolr-text-muted text-base leading-relaxed">
                  {tNav("toolImageDesc")}
                </p>
                <div className="flex items-center gap-2 text-kolr-green font-bold mt-6 group-hover:gap-3 transition-all duration-200">
                  <span>Try it now</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            </Reveal>
            <Reveal animation="reveal-up" delay={4}>
              <Link
                href={`/${locale}/tools/contrast-checker`}
                className="group block bg-kolr-surface border border-kolr-border rounded-3xl p-8 hover:-translate-y-2 hover:border-kolr-orange transition-all duration-300 no-underline"
              >
                <div className="w-16 h-16 rounded-2xl bg-kolr-orange/10 text-kolr-orange flex items-center justify-center mb-6 group-hover:bg-kolr-orange group-hover:text-black transition-all duration-300">
                  <CircleSlash2 size={32} />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-white">
                  {tNav("toolContrast")}
                </h3>
                <p className="text-kolr-text-muted text-base leading-relaxed">
                  {tNav("toolContrastDesc")}
                </p>
                <div className="flex items-center gap-2 text-kolr-orange font-bold mt-6 group-hover:gap-3 transition-all duration-200">
                  <span>{tCommon("tryNow")}</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Download Section */}
      <section className="section bg-gradient-to-br from-kolr-surface to-black">
        <div className="container">
          <Reveal animation="reveal-up">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[3rem] p-12 md:p-16 text-center backdrop-blur-xl">
              <h2 className="text-5xl font-black mb-6 tracking-tight">
                {tHomepage("ctaTitle")}
              </h2>
              <p className="text-xl text-kolr-text-muted mb-12 max-w-[600px] mx-auto">
                {tHomepage("ctaDescription")}
              </p>

              <div className="flex flex-wrap gap-6 justify-center mb-8">
                <Link
                  href={`/${locale}/download`}
                  className="btn-primary flex items-center gap-3 text-xl px-12 py-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="w-10 h-10"
                  >
                    <defs>
                      <linearGradient
                        id="SVG1vlmueNw"
                        x1="50%"
                        x2="50%"
                        y1="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#17C9FB" />
                        <stop offset="100%" stopColor="#1A74E8" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#SVG1vlmueNw)"
                      d="M56.064 0h143.872C230.9 0 256 25.1 256 56.064v143.872C256 230.9 230.9 256 199.936 256H56.064C25.1 256 0 230.9 0 199.936V56.064C0 25.1 25.1 0 56.064 0"
                    />
                    <path
                      fill="#FFF"
                      d="m82.042 185.81l.024.008l-8.753 15.16c-3.195 5.534-10.271 7.43-15.805 4.235s-7.43-10.271-4.235-15.805l6.448-11.168l.619-1.072c1.105-1.588 3.832-4.33 9.287-3.814c0 0 12.837 1.393 13.766 8.065c0 0 .126 2.195-1.351 4.391m124.143-38.72h-27.294c-1.859-.125-2.67-.789-2.99-1.175l-.02-.035l-29.217-50.606l-.038.025l-1.752-2.512c-2.872-4.392-7.432 6.84-7.432 6.84c-5.445 12.516.773 26.745 2.94 31.046l40.582 70.29c3.194 5.533 10.27 7.43 15.805 4.234c5.533-3.195 7.43-10.271 4.234-15.805l-10.147-17.576c-.197-.426-.539-1.582 1.542-1.587h13.787c6.39 0 11.57-5.18 11.57-11.57s-5.18-11.57-11.57-11.57m-53.014 15.728s1.457 7.411-4.18 7.411H48.092c-6.39 0-11.57-5.18-11.57-11.57s5.18-11.57 11.57-11.57h25.94c4.188-.242 5.18-2.66 5.18-2.66l.024.012l33.86-58.648l-.01-.002c.617-1.133.103-2.204.014-2.373l-11.183-19.369c-3.195-5.533-1.299-12.61 4.235-15.804s12.61-1.3 15.805 4.234l5.186 8.983l5.177-8.967c3.195-5.533 10.271-7.43 15.805-4.234s7.43 10.27 4.235 15.804l-47.118 81.61c-.206.497-.269 1.277 1.264 1.414h28.164l.006.275s16.278.253 18.495 15.454"
                    />
                  </svg>
                  <span>{tHomepage("downloadIos")}</span>
                </Link>
                <Link
                  href={`/${locale}/download`}
                  className="btn-primary flex items-center gap-3 text-xl px-12 py-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 283"
                    className="w-10 h-10"
                  >
                    <path
                      fill="#EA4335"
                      d="M119.553 134.916L1.06 259.061a32.14 32.14 0 0 0 47.062 19.071l133.327-75.934z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M239.37 113.814L181.715 80.79l-64.898 56.95l65.162 64.28l57.216-32.67a31.345 31.345 0 0 0 0-55.537z"
                    />
                    <path
                      fill="#4285F4"
                      d="M1.06 23.487A30.6 30.6 0 0 0 0 31.61v219.327a32.3 32.3 0 0 0 1.06 8.124l122.555-120.966z"
                    />
                    <path
                      fill="#34A853"
                      d="m120.436 141.274l61.278-60.483L48.564 4.503A32.85 32.85 0 0 0 32.051 0C17.644-.028 4.978 9.534 1.06 23.399z"
                    />
                  </svg>
                  <span>{tHomepage("downloadAndroid")}</span>
                </Link>
              </div>

              <Link
                href={`/${locale}/download`}
                className="inline-flex items-center gap-2 text-kolr-cyan hover:text-white font-bold transition-colors duration-200"
              >
                <span>{tHomepage("viewAllDownloads")}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  color,
  title,
  description,
}: {
  icon: string;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "1.25rem",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
          marginBottom: "2rem",
          boxShadow: `0 10px 30px ${color}44`,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          marginBottom: "1rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--kolr-text-muted)",
          lineHeight: "1.7",
          fontSize: "1.1rem",
        }}
      >
        {description}
      </p>
    </div>
  );
}
