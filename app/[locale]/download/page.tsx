"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { Smartphone, Zap, Shield, Globe } from "lucide-react";

export default function DownloadPage() {
  const t = useTranslations("download");
  const tPage = useTranslations("downloadPage");

  return (
    <>
      <section className="section min-h-[80vh] pt-24">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto">
            {/* Title */}
            <Reveal animation="reveal-up">
              <h1 className="[font-size:_clamp(3rem,6vw,4.5rem)] font-black mb-6 tracking-[-0.02em]">
                {t("title")}
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal animation="reveal-up" delay={1}>
              <p className="text-2xl text-kolr-cyan mb-6 font-extrabold uppercase tracking-[0.05em]">
                {t("subtitle")}
              </p>
            </Reveal>

            {/* Description */}
            <Reveal animation="reveal-up" delay={2}>
              <p className="text-xl text-kolr-text-muted mb-16 leading-[1.7]">
                {t("description")}
              </p>
            </Reveal>

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center gap-8 mb-24">
              {/* iOS */}
              <Reveal animation="reveal-scale" delay={3} width="fit-content">
                <a
                  href="#"
                  className="btn-primary flex items-center justify-center gap-4 text-xl px-12 py-6"
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
                  <span className="leading-none">{t("appStore")}</span>
                </a>
              </Reveal>

              {/* Android */}
              <Reveal animation="reveal-scale" delay={4} width="fit-content">
                <a
                  href="#"
                  className="btn-primary flex items-center justify-center gap-4 text-xl px-12 py-6"
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
                  <span className="leading-none">{t("playStore")}</span>
                </a>
              </Reveal>
            </div>

            {/* Why Download Section */}
            <Reveal animation="reveal-up">
              <h2 className="text-3xl font-black mb-12 tracking-[-0.01em]">
                {tPage("whyDownload")}
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
              <Reveal animation="reveal-up" delay={1}>
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 text-left hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-xl bg-kolr-cyan/10 text-kolr-cyan flex items-center justify-center mb-6">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3">
                    {tPage("mobileTitle")}
                  </h3>
                  <p className="text-kolr-text-muted leading-relaxed">
                    {tPage("mobileDesc")}
                  </p>
                </div>
              </Reveal>

              <Reveal animation="reveal-up" delay={2}>
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 text-left hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-xl bg-kolr-purple/10 text-kolr-purple flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3">
                    {tPage("fastTitle")}
                  </h3>
                  <p className="text-kolr-text-muted leading-relaxed">
                    {tPage("fastDesc")}
                  </p>
                </div>
              </Reveal>

              <Reveal animation="reveal-up" delay={3}>
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 text-left hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-xl bg-kolr-green/10 text-kolr-green flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3">{tPage("privacyTitle")}</h3>
                  <p className="text-kolr-text-muted leading-relaxed">
                    {tPage("privacyDesc")}
                  </p>
                </div>
              </Reveal>

              <Reveal animation="reveal-up" delay={4}>
                <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 text-left hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-xl bg-kolr-orange/10 text-kolr-orange flex items-center justify-center mb-6">
                    <Globe className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3">{tPage("offlineTitle")}</h3>
                  <p className="text-kolr-text-muted leading-relaxed">
                    {tPage("offlineDesc")}
                  </p>
                </div>
              </Reveal>
            </div>
            {/* App Preview */}
            <Reveal animation="reveal-up" delay={5}>
              <div className="bg-kolr-surface border border-kolr-border rounded-[2rem] px-8 py-16 mb-20 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                <div className="flex justify-center items-center mb-10">
                  <img
                    src="/logo-dark.png"
                    alt="Kolr Logo"
                    className="h-[140px] w-auto"
                  />
                </div>
                <p className="text-kolr-text-muted text-2xl font-medium">
                  {tPage("photoTagline")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
