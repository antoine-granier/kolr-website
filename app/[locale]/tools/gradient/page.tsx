"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Copy, Check, RefreshCw, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

type GradientType = "linear" | "radial" | "conic";

export default function GradientPage() {
  const t = useTranslations("toolGradient");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const [colors, setColors] = useState(["#00f2ff", "#bf5af2"]);
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [copiedType, setCopiedType] = useState<"css" | "tailwind" | null>(null);

  const generateGradientCSS = useCallback(() => {
    const colorStops = colors.join(", ");
    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${colorStops})`;
      case "radial":
        return `radial-gradient(circle, ${colorStops})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${colorStops})`;
    }
  }, [colors, gradientType, angle]);

  const generateTailwindCSS = useCallback(() => {
    const directionMap: Record<number, string> = {
      0: "to-t", 45: "to-tr", 90: "to-r", 135: "to-br",
      180: "to-b", 225: "to-bl", 270: "to-l", 315: "to-tl",
    };
    const fromColor = `from-[${colors[0]}]`;
    const toColor = `to-[${colors[colors.length - 1]}]`;
    const viaColors = colors.slice(1, -1).map((c) => `via-[${c}]`).join(" ");

    if (gradientType === "linear") {
      const closest = Object.keys(directionMap).reduce((prev, curr) =>
        Math.abs(Number(curr) - angle) < Math.abs(Number(prev) - angle) ? curr : prev
      );
      const dir = directionMap[Number(closest)];
      return `bg-gradient-${dir} ${fromColor} ${viaColors ? viaColors + " " : ""}${toColor}`.replace(/\s+/g, " ").trim();
    }
    if (gradientType === "radial") {
      return `bg-[radial-gradient(circle,${colors.join(",")})]`;
    }
    return `bg-[conic-gradient(from_${angle}deg,${colors.join(",")})]`;
  }, [colors, gradientType, angle]);

  const cssCode = `background: ${generateGradientCSS()};`;
  const tailwindCode = generateTailwindCSS();

  const copyCode = (code: string, type: "css" | "tailwind") => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const addColor = () => {
    if (colors.length < 5) {
      const randomColor = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
      setColors([...colors, randomColor]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 3);
    const newColors = Array.from(
      { length: count },
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
    );
    setColors(newColors);
    setAngle(Math.floor(Math.random() * 360));
    const types: GradientType[] = ["linear", "radial", "conic"];
    setGradientType(types[Math.floor(Math.random() * 3)]);
  };

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
              <span>{tNav("home")}</span>
            </Link>

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {t("title")}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2">
                {t("description")}
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Preview */}
            <Reveal animation="reveal-up" delay={1}>
              <div className="flex flex-col gap-6">
                <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                  {t("preview")}
                </label>
                <div
                  className="w-full aspect-square rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500"
                  style={{ background: generateGradientCSS() }}
                />
              </div>
            </Reveal>

            {/* Controls */}
            <Reveal animation="reveal-up" delay={2}>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-10 flex flex-col gap-8 backdrop-blur-xl">
                {/* Gradient Type */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {(["linear", "radial", "conic"] as GradientType[]).map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => setGradientType(type)}
                          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 border ${
                            gradientType === type
                              ? "bg-kolr-cyan text-black border-kolr-cyan"
                              : "bg-white/5 text-kolr-text-muted border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {t(type)}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Angle (for linear & conic) */}
                {(gradientType === "linear" || gradientType === "conic") && (
                  <div className="flex flex-col gap-4">
                    <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                      {t("angle")}: {angle}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none bg-white/10 accent-kolr-cyan"
                    />
                  </div>
                )}

                {/* Color Stops */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    Colors
                  </label>
                  <div className="flex flex-col gap-3">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10"
                      >
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="min-w-[48px] min-h-[48px] rounded-xl cursor-pointer border-0 bg-transparent"
                          style={{ WebkitAppearance: "none" }}
                        />
                        <input
                          type="text"
                          value={color.toUpperCase()}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="flex-1 font-mono text-lg font-extrabold bg-transparent border-0 outline-none uppercase"
                        />
                        {colors.length > 2 && (
                          <button
                            onClick={() => removeColor(index)}
                            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-kolr-red/20 hover:text-kolr-red transition-all duration-200"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                      </div>
                    ))}

                    {colors.length < 5 && (
                      <button
                        onClick={addColor}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/20 text-kolr-text-muted hover:text-white hover:border-kolr-cyan transition-all duration-300"
                      >
                        <Plus size={16} />
                        <span className="text-sm font-bold">
                          {t("addColor")}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CSS Code */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    CSS
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <code className="flex-1 font-mono text-sm text-kolr-cyan break-all">
                      {cssCode}
                    </code>
                    <button
                      onClick={() => copyCode(cssCode, "css")}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedType === "css"
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedType === "css" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Tailwind Code */}
                <div className="flex flex-col gap-4">
                  <label className="block font-bold uppercase text-xs tracking-widest text-kolr-text-muted">
                    Tailwind
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4">
                    <code className="flex-1 font-mono text-sm text-kolr-purple break-all">
                      {tailwindCode}
                    </code>
                    <button
                      onClick={() => copyCode(tailwindCode, "tailwind")}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedType === "tailwind"
                          ? "bg-kolr-green text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {copiedType === "tailwind" ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={randomize}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-kolr-purple transition-all duration-300 group"
                >
                  <RefreshCw
                    size={18}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  {t("randomize")}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
