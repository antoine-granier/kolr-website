"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Languages,
  Menu,
  X,
  ChevronDown,
  Palette,
  Pipette,
  Image as ImageIcon,
  CircleSlash2,
} from "lucide-react";

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [hoveredToolIndex, setHoveredToolIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { name: t("home"), href: `/${locale}` },
    { name: t("features"), href: `/${locale}/features` },
  ];

  const tools = [
    {
      name: t("toolRandom"),
      description: t("toolRandomDesc"),
      href: `/${locale}/tools/random`,
      icon: <Palette size={20} />,
      colorVar: "var(--kolr-cyan)",
    },
    {
      name: t("toolColor"),
      description: t("toolColorDesc"),
      href: `/${locale}/tools/color-extract`,
      icon: <Pipette size={20} />,
      colorVar: "var(--kolr-purple)",
    },
    {
      name: t("toolImage"),
      description: t("toolImageDesc"),
      href: `/${locale}/tools/image-extract`,
      icon: <ImageIcon size={20} />,
      colorVar: "var(--kolr-green)",
    },
    {
      name: t("toolContrast"),
      description: t("toolContrastDesc"),
      href: `/${locale}/tools/contrast-checker`,
      icon: <CircleSlash2 size={20} />,
      colorVar: "var(--kolr-orange)",
    },
  ];

  const switchLocale = () => {
    const newLocale = locale === "en" ? "fr" : "en";
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? "glass-nav shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "glass-nav"
      }`}
    >
      <div className="container py-1.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center no-underline transition-transform duration-300 ease-out relative z-1001 hover:scale-[1.02]"
          >
            <img src="/logo-dark.png" alt="Kolr Logo" className="h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`no-underline transition-all duration-200 font-semibold text-[0.95rem] tracking-tight hover:text-kolr-cyan hover:-translate-y-0.5 ${
                  pathname === item.href
                    ? "text-kolr-cyan"
                    : "text-kolr-text-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 py-2 no-underline transition-colors duration-200 font-semibold text-[0.95rem] tracking-tight ${
                  toolsOpen || pathname.includes("/tools")
                    ? "text-kolr-cyan"
                    : "text-kolr-text-muted"
                }`}
              >
                {t("tools")}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    toolsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {toolsOpen && (
                <div
                  className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 
                  bg-[#111111]/95 backdrop-blur-2xl backdrop-saturate-180
                  border border-white/10
                  rounded-3xl p-3 min-w-[280px] flex flex-col gap-2 
                  shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                  z-2200"
                >
                  {/* Invisible bridge */}
                  <div className="absolute -top-4 left-0 w-full h-4" />

                  {tools.map((tool, index) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="flex items-center gap-4 p-[0.85rem_1rem] text-white no-underline rounded-[1.1rem] transition-all duration-300 ease-out hover:bg-white/6 hover:-translate-y-0.5 hover:shadow-lg"
                      onMouseEnter={() => setHoveredToolIndex(index)}
                      onMouseLeave={() => setHoveredToolIndex(null)}
                    >
                      <div
                        className="w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all duration-300 ease-out shrink-0"
                        style={{
                          backgroundColor:
                            hoveredToolIndex === index
                              ? tool.colorVar
                              : `${tool.colorVar}15`,
                          color:
                            hoveredToolIndex === index
                              ? "black"
                              : tool.colorVar,
                          transform:
                            hoveredToolIndex === index
                              ? "scale(1.1) rotate(5deg)"
                              : "scale(1) rotate(0deg)",
                        }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="font-bold text-[0.95rem] transition-colors duration-300"
                          style={{
                            color:
                              hoveredToolIndex === index
                                ? tool.colorVar
                                : "white",
                          }}
                        >
                          {tool.name}
                        </span>
                        <span className="text-[0.75rem] text-kolr-text-muted font-medium">
                          {tool.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/download`}
              className={`no-underline transition-colors duration-200 font-semibold text-[0.95rem] tracking-tight hover:text-kolr-cyan ${
                pathname.includes("/download")
                  ? "text-kolr-cyan"
                  : "text-kolr-text-muted"
              }`}
            >
              {t("download")}
            </Link>

            {/* Language Switcher */}
            <button
              onClick={switchLocale}
              className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/3 text-white cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-[0.85rem] font-bold uppercase tracking-wider hover:border-kolr-cyan hover:bg-kolr-cyan/5 hover:shadow-[0_0_15px_rgba(0,242,255,0.15)] group"
            >
              <Languages
                size={14}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>{locale === "en" ? "EN" : "FR"}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white border-0 bg-transparent cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-1001"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 w-full h-screen bg-black/95 backdrop-blur-[25px] backdrop-saturate-200 z-1000 flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="w-full max-w-[400px] p-8 flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[2rem] font-extrabold no-underline tracking-tighter transition-all duration-400 ease-out ${
                    mobileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  } ${
                    pathname === item.href ? "text-kolr-cyan" : "text-white"
                  }`}
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Tools Section */}
              <div
                className={`flex flex-col transform transition-all duration-500 ease-out delay-300 ${
                  mobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <button
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  className={`text-[2rem] font-extrabold no-underline tracking-tighter transition-colors duration-300 bg-transparent border-0 p-0 cursor-pointer flex items-center gap-3 text-left ${
                    mobileToolsOpen ? "text-kolr-cyan" : "text-white"
                  }`}
                >
                  {t("tools")}
                  <ChevronDown
                    size={24}
                    className={`transition-transform duration-300 opacity-50 ${
                      mobileToolsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`flex flex-col gap-5 pl-6 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    mobileToolsOpen
                      ? "max-h-[500px] opacity-100 mt-2"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  {tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="flex items-center gap-4 p-[0.85rem_1rem] text-white no-underline rounded-[1.1rem] transition-all duration-300 ease-out hover:bg-white/6 hover:-translate-y-0.5 hover:shadow-lg group"
                    >
                      <div
                        className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-[5deg] shrink-0 ${
                          tool.colorVar === "var(--kolr-cyan)"
                            ? "bg-kolr-cyan/8 text-kolr-cyan group-hover:bg-kolr-cyan group-hover:text-black"
                            : tool.colorVar === "var(--kolr-purple)"
                            ? "bg-kolr-purple/8 text-kolr-purple group-hover:bg-kolr-purple group-hover:text-black"
                            : "bg-kolr-green/8 text-kolr-green group-hover:bg-kolr-green group-hover:text-black"
                        }`}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`font-bold text-[0.95rem] text-white transition-colors duration-300 ${
                            tool.colorVar === "var(--kolr-cyan)"
                              ? "group-hover:text-kolr-cyan"
                              : tool.colorVar === "var(--kolr-purple)"
                              ? "group-hover:text-kolr-purple"
                              : "group-hover:text-kolr-green"
                          }`}
                        >
                          {tool.name}
                        </span>
                        <span className="text-[0.75rem] text-kolr-text-muted font-medium">
                          {tool.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={`/${locale}/download`}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[2rem] font-extrabold no-underline tracking-tighter transition-all duration-400 ease-out delay-400 ${
                  mobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                } ${
                  pathname.includes("/download")
                    ? "text-kolr-cyan"
                    : "text-white"
                }`}
              >
                {t("download")}
              </Link>
            </div>

            <div
              className={`transition-all duration-400 ease-out delay-500 ${
                mobileMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <button
                onClick={switchLocale}
                className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-between font-bold text-[1.1rem] cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <Languages
                    size={22}
                    className="text-kolr-cyan transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>{locale === "en" ? t("languageFr") : t("languageEn")}</span>
                </div>
                <div className="text-[0.7rem] uppercase tracking-widest opacity-40 bg-white/10 px-2 py-1 rounded-lg">
                  {locale === "en" ? t("switchLanguage") : t("changeLanguage")}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
