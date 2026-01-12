"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { RefreshCw, Copy, Check, Lock, Unlock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

interface Color {
  hex: string;
  locked: boolean;
}

const INITIAL_COLORS: Color[] = [
  { hex: "#003033", locked: false },
  { hex: "#009199", locked: false },
  { hex: "#00F2FF", locked: false },
  { hex: "#7DE3E8", locked: false },
  { hex: "#D9F1F2", locked: false },
];

type HarmonyType =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic";

export default function RandomToolPage() {
  const t = useTranslations("nav");
  const tRandom = useTranslations("toolRandom");
  const locale = useLocale();
  const [colors, setColors] = useState<Color[]>(INITIAL_COLORS);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomColors = () => {
    const lockedColors = colors.filter((c) => c.locked);

    // Si des couleurs sont lockées, générer autour de la première couleur lockée
    if (lockedColors.length > 0) {
      // Utiliser la première couleur lockée comme base
      const baseColor = lockedColors[0].hex;
      const baseHsl = hexToHsl(baseColor);

      // Choisir une harmonie aléatoire
      const harmonies: HarmonyType[] = [
        "monochromatic",
        "analogous",
        "complementary",
        "triadic",
        "tetradic",
      ];
      const harmony = harmonies[Math.floor(Math.random() * harmonies.length)];

      let newHexColors: string[] = [];

      switch (harmony) {
        case "monochromatic":
          newHexColors = [
            hslToHex(baseHsl.h, baseHsl.s, Math.max(10, baseHsl.l - 35)),
            hslToHex(baseHsl.h, baseHsl.s, Math.max(20, baseHsl.l - 20)),
            baseColor,
            hslToHex(
              baseHsl.h,
              Math.max(20, baseHsl.s - 30),
              Math.min(85, baseHsl.l + 20),
            ),
            hslToHex(
              baseHsl.h,
              Math.max(15, baseHsl.s - 50),
              Math.min(92, baseHsl.l + 35),
            ),
          ];
          break;

        case "analogous":
          newHexColors = [
            hslToHex((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l - 10),
            hslToHex((baseHsl.h - 15 + 360) % 360, baseHsl.s, baseHsl.l),
            baseColor,
            hslToHex((baseHsl.h + 15) % 360, baseHsl.s, baseHsl.l),
            hslToHex((baseHsl.h + 30) % 360, baseHsl.s - 20, baseHsl.l + 15),
          ];
          break;

        case "complementary":
          const compHue = (baseHsl.h + 180) % 360;
          newHexColors = [
            hslToHex(baseHsl.h, baseHsl.s, Math.max(15, baseHsl.l - 25)),
            baseColor,
            hslToHex(baseHsl.h, baseHsl.s - 30, Math.min(85, baseHsl.l + 25)),
            hslToHex(compHue, baseHsl.s - 10, baseHsl.l - 5),
            hslToHex(compHue, baseHsl.s - 40, Math.min(90, baseHsl.l + 30)),
          ];
          break;

        case "triadic":
          const tri1 = (baseHsl.h + 120) % 360;
          const tri2 = (baseHsl.h + 240) % 360;
          newHexColors = [
            baseColor,
            hslToHex(baseHsl.h, baseHsl.s - 20, baseHsl.l + 20),
            hslToHex(tri1, baseHsl.s, baseHsl.l),
            hslToHex(tri2, baseHsl.s, baseHsl.l - 5),
            hslToHex(tri2, baseHsl.s - 40, baseHsl.l + 25),
          ];
          break;

        case "tetradic":
          const tet1 = (baseHsl.h + 60) % 360;
          const tet2 = (baseHsl.h + 180) % 360;
          const tet3 = (baseHsl.h + 240) % 360;
          newHexColors = [
            baseColor,
            hslToHex(tet1, baseHsl.s - 10, baseHsl.l + 10),
            hslToHex(tet2, baseHsl.s, baseHsl.l - 5),
            hslToHex(tet3, baseHsl.s - 15, baseHsl.l + 5),
            hslToHex(baseHsl.h, baseHsl.s - 50, Math.min(90, baseHsl.l + 30)),
          ];
          break;
      }

      // Appliquer les nouvelles couleurs en respectant les locks
      const newColors = colors.map((c, index) => {
        if (c.locked) return c;
        return {
          hex: newHexColors[index].toUpperCase(),
          locked: false,
        };
      });

      setColors(newColors);
    } else {
      // Aucune couleur lockée, générer normalement
      const harmonies: HarmonyType[] = [
        "monochromatic",
        "analogous",
        "complementary",
        "triadic",
        "tetradic",
      ];
      const harmony = harmonies[Math.floor(Math.random() * harmonies.length)];

      const baseHue = Math.floor(Math.random() * 360);
      const baseSat = 70 + Math.random() * 25;
      const baseLum = 45 + Math.random() * 20;

      let newHexColors: string[] = [];

      switch (harmony) {
        case "monochromatic":
          newHexColors = [
            hslToHex(baseHue, baseSat, Math.max(10, baseLum - 35)),
            hslToHex(baseHue, baseSat, Math.max(20, baseLum - 20)),
            hslToHex(baseHue, baseSat, baseLum),
            hslToHex(
              baseHue,
              Math.max(20, baseSat - 30),
              Math.min(85, baseLum + 20),
            ),
            hslToHex(
              baseHue,
              Math.max(15, baseSat - 50),
              Math.min(92, baseLum + 35),
            ),
          ];
          break;

        case "analogous":
          newHexColors = [
            hslToHex((baseHue - 30 + 360) % 360, baseSat, baseLum - 10),
            hslToHex((baseHue - 15 + 360) % 360, baseSat, baseLum),
            hslToHex(baseHue, baseSat + 10, baseLum + 5),
            hslToHex((baseHue + 15) % 360, baseSat, baseLum),
            hslToHex((baseHue + 30) % 360, baseSat - 20, baseLum + 15),
          ];
          break;

        case "complementary":
          const compHue = (baseHue + 180) % 360;
          newHexColors = [
            hslToHex(baseHue, baseSat, Math.max(15, baseLum - 25)),
            hslToHex(baseHue, baseSat, baseLum),
            hslToHex(baseHue, baseSat - 30, Math.min(85, baseLum + 25)),
            hslToHex(compHue, baseSat - 10, baseLum - 5),
            hslToHex(compHue, baseSat - 40, Math.min(90, baseLum + 30)),
          ];
          break;

        case "triadic":
          const tri1 = (baseHue + 120) % 360;
          const tri2 = (baseHue + 240) % 360;
          newHexColors = [
            hslToHex(baseHue, baseSat, baseLum - 10),
            hslToHex(baseHue, baseSat - 20, baseLum + 20),
            hslToHex(tri1, baseSat, baseLum),
            hslToHex(tri2, baseSat, baseLum - 5),
            hslToHex(tri2, baseSat - 40, baseLum + 25),
          ];
          break;

        case "tetradic":
          const tet1 = (baseHue + 60) % 360;
          const tet2 = (baseHue + 180) % 360;
          const tet3 = (baseHue + 240) % 360;
          newHexColors = [
            hslToHex(baseHue, baseSat, baseLum),
            hslToHex(tet1, baseSat - 10, baseLum + 10),
            hslToHex(tet2, baseSat, baseLum - 5),
            hslToHex(tet3, baseSat - 15, baseLum + 5),
            hslToHex(baseHue, baseSat - 50, Math.min(90, baseLum + 30)),
          ];
          break;
      }

      setColors(
        newHexColors.map((hex) => ({ hex: hex.toUpperCase(), locked: false })),
      );
    }
  };

  const toggleLock = (index: number) => {
    const newColors = [...colors];
    newColors[index].locked = !newColors[index].locked;
    setColors(newColors);
  };

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Spacebar to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        generateRandomColors();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [colors]);

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8">
        <div className="container">
          <Reveal animation="reveal-up">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
            >
              <ArrowLeft size={18} />
              <span>{t("home")}</span>
            </Link>

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black mb-2 tracking-[-0.02em]">
                {t("toolRandom")}
              </h1>
              <p className="text-kolr-text-muted text-lg flex items-center justify-center gap-2 flex-wrap">
                {tRandom("pressKey")}{" "}
                <span className="bg-white/10 border border-white/20 rounded-md px-2 py-0.5 text-sm font-mono text-white">
                  {tRandom("spacebar")}
                </span>{" "}
                {tRandom("toGenerate")}
              </p>
            </header>
          </Reveal>

          <Reveal animation="reveal-scale" delay={2}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] h-[60vh] rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] md:grid-cols-5 max-md:grid-cols-1 max-md:h-auto">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="relative transition-colors duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] max-md:h-[120px]"
                  style={{ backgroundColor: color.hex }}
                >
                  <div
                    className="absolute inset-0 flex flex-col p-8 pb-12 transition-all duration-300"
                    style={{ color: getContrastColor(color.hex) }}
                  >
                    <button
                      onClick={() => toggleLock(index)}
                      className="bg-transparent border-0 cursor-pointer flex items-center justify-center transition-transform duration-200 self-start hover:scale-110"
                      style={{ color: "inherit" }}
                    >
                      {color.locked ? (
                        <Lock size={22} />
                      ) : (
                        <Unlock size={22} className="opacity-50" />
                      )}
                    </button>

                    <div className="flex-1" />

                    <div className="flex flex-col items-center gap-4">
                      <span className="font-mono text-2xl font-black tracking-wider">
                        {color.hex}
                      </span>
                      <button
                        onClick={() => copyToClipboard(color.hex, index)}
                        className={`
                          w-11 h-11 rounded-full cursor-pointer flex items-center justify-center
                          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                          bg-black/10 border border-white/20
                          hover:bg-white/20 hover:scale-110
                          ${
                            copiedIndex === index
                              ? "!bg-white !text-black !border-white scale-110"
                              : ""
                          }
                        `}
                        style={{ color: "inherit" }}
                      >
                        {copiedIndex === index ? (
                          <Check size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12 pb-16">
              <button
                onClick={generateRandomColors}
                className="
                  flex items-center gap-4 px-10 py-5 rounded-full
                  bg-white text-black border-0 font-extrabold text-xl cursor-pointer
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  shadow-[0_10px_40px_rgba(0,242,255,0.3)]
                  hover:shadow-[0_20px_60px_rgba(0,242,255,0.4)]
                  hover:-translate-y-1 hover:scale-[1.02]
                  active:translate-y-0 active:scale-[0.98]
                  group
                "
              >
                <RefreshCw
                  size={24}
                  className="transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-active:rotate-180"
                />
                <span>{tRandom("generateButton")}</span>
              </button>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}

// Helpers
function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s;
  const l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getContrastColor(hexcolor: string) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}
