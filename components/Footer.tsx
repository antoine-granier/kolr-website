"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Coffee } from "lucide-react";

const socials = [
  { label: "GitHub", href: "https://github.com/antoine-granier", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/antoine-granier-473147204/",
    icon: Linkedin,
  },
];

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
    { href: "/tools/shadow-generator", key: "toolShadow" },
    { href: "/tools/glass-generator", key: "toolGlass" },
    { href: "/share", key: "toolShare" },
  ];

  const legal = [
    { href: "/privacy", key: "privacy" },
    { href: "/terms", key: "terms" },
    { href: "/about", key: "about" },
    { href: "/faq", label: "FAQ" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/roadmap", key: "apiSoon" },
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

            {/* Socials + support */}
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-white">
                {t("followUs")}
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/80 no-underline hover:text-white hover:border-white/25 transition-colors"
                  >
                    <Icon size={17} />
                  </a>
                ))}
                <a
                  href="https://buymeacoffee.com/agranier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full bg-[#FFDD00] text-black text-xs font-bold no-underline hover:opacity-90 transition-opacity"
                >
                  <Coffee size={15} />
                  {t("support")}
                </a>
              </div>
            </div>
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
                  className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white whitespace-nowrap"
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
                  key={label || key}
                  href={`/${locale}${href}`}
                  className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white"
                >
                  {label || t(key!)}
                </Link>
              ))}
              <Link
                href={`/${locale}/contact`}
                className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white"
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="h-px bg-white/[0.06] mb-5" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-kolr-text-muted text-xs">
            {t("rights")} · {t("madeBy")}
          </p>
          <Link
            href={`/${locale}/accessibility`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-kolr-cyan/20 bg-kolr-cyan/5 text-kolr-cyan text-xs font-bold no-underline hover:bg-kolr-cyan/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7" r="1" fill="currentColor"/><path d="M7 11h10"/><path d="m10 22 2-8 2 8"/></svg>
            <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> AA
          </Link>
        </div>
      </div>
    </footer>
  );
}
