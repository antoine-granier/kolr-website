"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-kolr-border">
      <div className="container px-6 py-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 mb-8">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center my-6">
              <img
                src="/logo-dark.png"
                alt="Kolr Logo"
                className="h-[60px] w-auto"
              />
            </div>
            <p className="text-kolr-text-muted text-base leading-relaxed">
              Transform your photos into
              <br />
              beautiful color palettes.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="my-6 text-[1.1rem] font-extrabold uppercase tracking-wider">
              {t("legal")}
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${locale}/privacy`}
                className="text-kolr-text-muted no-underline text-base transition-colors duration-200 hover:text-white"
              >
                {t("privacy")}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-kolr-text-muted no-underline text-base transition-colors duration-200 hover:text-white"
              >
                {t("terms")}
              </Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="my-6 text-[1.1rem] font-extrabold uppercase tracking-wider">
              {t("about")}
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${locale}/about`}
                className="text-kolr-text-muted no-underline text-base transition-colors duration-200 hover:text-white"
              >
                {t("about")}
              </Link>
              <a
                href="mailto:support@kolr.app"
                className="text-kolr-text-muted no-underline text-base transition-colors duration-200 hover:text-white"
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
