"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const tools = [
    { href: "/tools/random", key: "toolRandom" },
    { href: "/tools/color-extract", key: "toolColor" },
    { href: "/tools/image-extract", key: "toolImage" },
    { href: "/tools/contrast-checker", key: "toolContrast" },
    { href: "/tools/gradient", key: "toolGradient" },
    { href: "/tools/colorblind", key: "toolColorblind" },
    { href: "/tools/colorblind-url", key: "toolColorblindUrl" },
    { href: "/tools/color-converter", key: "toolConverter" },
    { href: "/tools/dark-theme", key: "toolDarkTheme" },
    { href: "/tools/palette-compare", key: "toolCompare" },
    { href: "/tools/tailwind-colors", key: "toolTailwindColors" },
    { href: "/tools/url-extract", key: "toolUrl" },
    { href: "/tools/svg-color-editor", key: "toolSvgColor" },
    { href: "/share", key: "toolShare" },
  ];

  const legal = [
    { href: "/privacy", key: "privacy" },
    { href: "/terms", key: "terms" },
    { href: "/about", key: "about" },
    { href: "/faq", label: "FAQ" },
    { href: "/roadmap", label: "Roadmap" },
  ];

  return (
    <footer className="mt-20 bg-white/[0.02]" role="contentinfo" aria-label="Site footer">
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container px-6! py-12!">
        {/* Top: Logo + Links */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-10">
          {/* Logo */}
          <div className="shrink-0">
            <Image
              src="/logo-dark.png"
              alt="Kolr - Color palette toolkit"
              width={50}
              height={50}
              className="h-[50px] w-auto mb-3"
            />
            <p className="text-kolr-text-muted text-sm leading-relaxed max-w-[260px]">
              {t("tagline")}
            </p>
          </div>

          {/* Tools grid */}
          <div>
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-white">
              {t("tools")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2">
              {tools.map(({ href, key }) => (
                <Link
                  key={key}
                  href={`/${locale}${href}`}
                  className="text-white/70 no-underline text-sm transition-colors duration-200 hover:text-white whitespace-nowrap"
                >
                  {t(key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="shrink-0">
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-white">
              {t("legal")}
            </h3>
            <div className="flex flex-col gap-2">
              {legal.map(({ href, key, label }) => (
                <Link
                  key={href}
                  href={`/${locale}${href}`}
                  className="text-white/70 no-underline text-sm transition-colors duration-200 hover:text-white"
                >
                  {label || t(key!)}
                </Link>
              ))}
              <a
                href="mailto:antoine.granier@protonmail.com"
                className="text-white/70 no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("contact")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="h-px bg-white/[0.06] mb-5" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-kolr-text-muted text-xs">
            {t("rights")}
          </p>
          <Link
            href={`/${locale}/accessibility`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-kolr-cyan/20 bg-kolr-cyan/5 text-kolr-cyan text-xs font-bold no-underline hover:bg-kolr-cyan/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7" r="1" fill="currentColor"/><path d="M7 11h10"/><path d="m10 22 2-8 2 8"/></svg>
            WCAG AA
          </Link>
        </div>
      </div>
    </footer>
  );
}
