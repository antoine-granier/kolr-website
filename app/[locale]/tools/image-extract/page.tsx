"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function ImageExtractPage() {
  const t = useTranslations("nav");
  const tImage = useTranslations("toolImage");
  const locale = useLocale();
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractPalette = () => {
    if (!image) return;

    setIsExtracting(true);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsExtracting(false);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsExtracting(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample 5 points from the image
      const points = [
        { x: img.width * 0.5, y: img.height * 0.5 },
        { x: img.width * 0.25, y: img.height * 0.25 },
        { x: img.width * 0.75, y: img.height * 0.25 },
        { x: img.width * 0.25, y: img.height * 0.75 },
        { x: img.width * 0.75, y: img.height * 0.75 },
      ];

      const colors = points.map((p) => {
        const data = ctx.getImageData(p.x, p.y, 1, 1).data;
        return rgbToHex(data[0], data[1], data[2]);
      });

      setPalette(colors);
      setIsExtracting(false);
    };

    img.onerror = () => {
      setIsExtracting(false);
    };
  };

  useEffect(() => {
    if (image) {
      // Use setTimeout to avoid calling setState synchronously in effect
      const timer = setTimeout(() => extractPalette(), 0);
      return () => clearTimeout(timer);
    }
  }, [image]);

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-kolr-bg text-white">
      <main className="min-h-[calc(100vh-80px)] pt-8">
        <div className="container">
          <Reveal animation="reveal-up">
            {/* Back Link */}
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan"
            >
              <ArrowLeft size={18} />
              <span>{t("home")}</span>
            </Link>

            <header className="mb-12 text-center">
              <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black tracking-[-0.02em]">
                {t("toolImage")}
              </h1>
              <p className="text-kolr-text-muted text-lg mt-2">
                {tImage("description")}
              </p>
            </header>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 mb-20">
            {/* Upload Zone */}
            <Reveal animation="reveal-up" delay={1}>
              <div
                className={`
                  h-[500px] lg:h-[500px] max-lg:h-[350px] rounded-[2.5rem]
                  flex items-center justify-center cursor-pointer overflow-hidden relative
                  transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${
                    image
                      ? "bg-transparent border-0"
                      : "bg-white/[0.03] border-2 border-dashed border-white/10 hover:bg-white/[0.05] hover:border-kolr-cyan hover:-translate-y-1"
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) =>
                      setImage(event.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-cover animate-in fade-in duration-800"
                  />
                ) : (
                  <div className="text-center text-kolr-text-muted">
                    {/* Pulsing Upload Icon */}
                    <div className="relative w-20 h-20 bg-kolr-cyan/10 text-kolr-cyan rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload size={40} />
                      <div className="absolute inset-0 rounded-full border-2 border-kolr-cyan animate-ping" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {tImage("dropzone")}
                    </h3>
                    <p className="text-base">{tImage("orBrowse")}</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </Reveal>

            {/* Results Zone */}
            <div className="flex flex-col">
              <Reveal animation="reveal-scale" delay={2}>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 flex flex-col gap-3 min-h-[400px] backdrop-blur-xl">
                  {palette.length > 0 ? (
                    palette.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-5 p-4 bg-white/[0.03] rounded-xl border border-transparent transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10 hover:translate-x-2 animate-in slide-in-from-bottom duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className="w-12 h-12 rounded-[14px] shadow-[0_5px_15px_rgba(0,0,0,0.3)] shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-mono text-xl font-extrabold tracking-wider flex-1">
                          {color}
                        </span>
                        <button
                          onClick={() => copyToClipboard(color, index)}
                          className={`
                            w-9 h-9 rounded-xl flex items-center justify-center
                            transition-all duration-200
                            ${
                              copiedIndex === index
                                ? "bg-[#2EFFB0] text-black border-[#2EFFB0]"
                                : "bg-white/5 text-white border-white/10 hover:bg-kolr-cyan hover:text-black hover:border-kolr-cyan"
                            }
                            border
                          `}
                        >
                          {copiedIndex === index ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-kolr-text-muted text-center p-8">
                      <ImageIcon size={48} className="opacity-10 mb-4" />
                      <p>{tImage("placeholder")}</p>
                    </div>
                  )}
                </div>

                {/* Re-extract Button */}
                {image && (
                  <button
                    onClick={extractPalette}
                    disabled={isExtracting}
                    className="mt-6 w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/10 hover:border-kolr-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw
                      size={18}
                      className={isExtracting ? "animate-spin" : ""}
                    />
                    <span>
                      {isExtracting
                        ? tImage("extracting")
                        : tImage("reextract")}
                    </span>
                  </button>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// Helpers
function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
