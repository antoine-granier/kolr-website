"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-kolr-border">
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center my-4">
              <Image
                src="/logo-dark.png"
                alt="Kolr Logo"
                width={50}
                height={50}
                className="h-[50px] w-auto"
              />
            </div>
            <p className="text-kolr-text-muted text-base leading-relaxed mb-6 max-w-[320px]">
              {t("tagline")}
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="my-4 text-sm font-extrabold uppercase tracking-wider">
              {t("tools")}
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/${locale}/tools/random`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolRandom")}
              </Link>
              <Link
                href={`/${locale}/tools/color-extract`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolColor")}
              </Link>
              <Link
                href={`/${locale}/tools/image-extract`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolImage")}
              </Link>
              <Link
                href={`/${locale}/tools/contrast-checker`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolContrast")}
              </Link>
              <Link
                href={`/${locale}/tools/gradient`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolGradient")}
              </Link>
              <Link
                href={`/${locale}/tools/colorblind`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolColorblind")}
              </Link>
              <Link
                href={`/${locale}/tools/dark-theme`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolDarkTheme")}
              </Link>
              <Link
                href={`/${locale}/share`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("toolShare")}
              </Link>
            </div>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="my-4 text-sm font-extrabold uppercase tracking-wider">
              {t("legal")}
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/${locale}/privacy`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("privacy")}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("terms")}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("about")}
              </Link>
              <Link
                href={`/${locale}/faq`}
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                FAQ
              </Link>
              <a
                href="mailto:antoine.granier@protonmail.com"
                className="text-kolr-text-muted no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("contact")}
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="py-4 border-t border-kolr-border text-center text-kolr-text-muted text-sm">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
