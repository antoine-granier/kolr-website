"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";

const INITIAL_COLORS = [
  { hex: "#003033" },
  { hex: "#009199" },
  { hex: "#00F2FF" },
  { hex: "#7DE3E8" },
  { hex: "#D9F1F2" },
];

type HarmonyType =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic";

export default function PalettePreview() {
  const [colors, setColors] = useState(INITIAL_COLORS);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomColors = () => {
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

    let newColors: { hex: string }[] = [];

    switch (harmony) {
      case "monochromatic":
        newColors = [
          { hex: hslToHex(baseHue, baseSat, Math.max(10, baseLum - 35)) },
          { hex: hslToHex(baseHue, baseSat, Math.max(20, baseLum - 20)) },
          { hex: hslToHex(baseHue, baseSat, baseLum) },
          {
            hex: hslToHex(
              baseHue,
              Math.max(20, baseSat - 30),
              Math.min(85, baseLum + 20)
            ),
          },
          {
            hex: hslToHex(
              baseHue,
              Math.max(15, baseSat - 50),
              Math.min(92, baseLum + 35)
            ),
          },
        ];
        break;

      case "analogous":
        newColors = [
          { hex: hslToHex((baseHue - 30 + 360) % 360, baseSat, baseLum - 10) },
          { hex: hslToHex((baseHue - 15 + 360) % 360, baseSat, baseLum) },
          { hex: hslToHex(baseHue, baseSat + 10, baseLum + 5) },
          { hex: hslToHex((baseHue + 15) % 360, baseSat, baseLum) },
          { hex: hslToHex((baseHue + 30) % 360, baseSat - 20, baseLum + 15) },
        ];
        break;

      case "complementary":
        const compHue = (baseHue + 180) % 360;
        newColors = [
          { hex: hslToHex(baseHue, baseSat, Math.max(15, baseLum - 25)) },
          { hex: hslToHex(baseHue, baseSat, baseLum) },
          { hex: hslToHex(baseHue, baseSat - 30, Math.min(85, baseLum + 25)) },
          { hex: hslToHex(compHue, baseSat - 10, baseLum - 5) },
          { hex: hslToHex(compHue, baseSat - 40, Math.min(90, baseLum + 30)) },
        ];
        break;

      case "triadic":
        const tri1 = (baseHue + 120) % 360;
        const tri2 = (baseHue + 240) % 360;
        newColors = [
          { hex: hslToHex(baseHue, baseSat, baseLum - 10) },
          { hex: hslToHex(baseHue, baseSat - 20, baseLum + 20) },
          { hex: hslToHex(tri1, baseSat, baseLum) },
          { hex: hslToHex(tri2, baseSat, baseLum - 5) },
          { hex: hslToHex(tri2, baseSat - 40, baseLum + 25) },
        ];
        break;

      case "tetradic":
        const tet1 = (baseHue + 60) % 360;
        const tet2 = (baseHue + 180) % 360;
        const tet3 = (baseHue + 240) % 360;
        newColors = [
          { hex: hslToHex(baseHue, baseSat, baseLum) },
          { hex: hslToHex(tet1, baseSat - 10, baseLum + 10) },
          { hex: hslToHex(tet2, baseSat, baseLum - 5) },
          { hex: hslToHex(tet3, baseSat - 15, baseLum + 5) },
          { hex: hslToHex(baseHue, baseSat - 50, Math.min(90, baseLum + 30)) },
        ];
        break;
    }

    setColors(newColors.map((c) => ({ hex: c.hex.toUpperCase() })));
  };

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="palette-preview w-full max-w-[400px] m-0">
        {colors.map((color, index) => (
          <div
            key={index}
            className="palette-color relative h-[90px]"
            style={{
              backgroundColor: color.hex,
              color: getContrastColor(color.hex),
              transition: "background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="flex items-center">
              <span className="text-base font-black tracking-wider">
                {color.hex}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(color.hex, index);
              }}
              style={{ color: "inherit" }}
              className={`
                bg-black/10 border border-white/10 p-2.5 rounded-xl cursor-pointer
                flex items-center justify-center transition-all duration-300
                hover:bg-white/20 hover:scale-110
                ${copiedIndex === index ? "copied-btn" : ""}
              `}
            >
              {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={generateRandomColors}
        className="btn-randomize flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-extrabold backdrop-blur-md cursor-pointer transition-all duration-400 hover:bg-white/10 hover:border-kolr-cyan hover:scale-105 hover:-translate-y-0.5 group"
      >
        <RefreshCw
          size={20}
          className="transition-transform duration-600 group-active:rotate-180"
        />
        <span>Randomize Palette</span>
      </button>

      <style jsx>{`
        .copied-btn {
          background: var(--kolr-cyan) !important;
          color: black !important;
          border-color: var(--kolr-cyan) !important;
          animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
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
