"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, Download, FileCode, ChevronDown } from "lucide-react";

interface PaletteExportProps {
  colors: string[];
}

type ExportFormat = "css" | "tailwind" | "scss" | "json" | "figma" | "ase";

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

export default function PaletteExport({ colors }: PaletteExportProps) {
  const t = useTranslations("export");
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const generateCode = (format?: ExportFormat): string => {
    const fmt = format || activeFormat;
    switch (fmt) {
      case "css":
        return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
      case "tailwind":
        return `// tailwind.config.js\ncolors: {\n  palette: {\n${colors.map((c, i) => `    '${i + 1}': '${c}',`).join("\n")}\n  }\n}`;
      case "scss":
        return colors.map((c, i) => `$color-${i + 1}: ${c};`).join("\n");
      case "json":
        return JSON.stringify(
          { palette: colors.reduce((acc, c, i) => ({ ...acc, [`color${i + 1}`]: c }), {}) },
          null,
          2
        );
      case "figma":
        return JSON.stringify({
          "kolr-palette": Object.fromEntries(
            colors.map((c, i) => {
              const [r, g, b] = hexToRgb(c);
              return [`color-${i + 1}`, {
                "$type": "color",
                "$value": `rgba(${r}, ${g}, ${b}, 1)`,
                "$description": `Palette color ${i + 1}`
              }];
            })
          )
        }, null, 2);
      case "ase":
        return colors.map((c, i) => {
          const [r, g, b] = hexToRgb(c);
          return `Color ${i + 1}: ${c} | RGB(${r}, ${g}, ${b}) | ${(r/255).toFixed(4)} ${(g/255).toFixed(4)} ${(b/255).toFixed(4)}`;
        }).join("\n");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (type: "css" | "svg" | "json" | "figma") => {
    let content: string;
    let filename: string;
    let mime: string;

    switch (type) {
      case "css":
        content = generateCode("css");
        filename = "palette.css";
        mime = "text/css";
        break;
      case "svg": {
        const width = 500;
        const colorWidth = width / colors.length;
        const rects = colors
          .map((c, i) => `<rect x="${i * colorWidth}" y="0" width="${colorWidth}" height="100" fill="${c}"/>`)
          .join("");
        content = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="100">${rects}</svg>`;
        filename = "palette.svg";
        mime = "image/svg+xml";
        break;
      }
      case "json":
        content = generateCode("json");
        filename = "palette.json";
        mime = "application/json";
        break;
      case "figma":
        content = generateCode("figma");
        filename = "palette.tokens.json";
        mime = "application/json";
        break;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadOpen(false);
  };

  const codeFormats: ExportFormat[] = ["css", "tailwind", "scss", "json", "figma", "ase"];

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] overflow-hidden backdrop-blur-xl">
      <div className="flex items-center gap-2 p-4 border-b border-white/[0.08]">
        <FileCode size={16} className="text-kolr-cyan" />
        <span className="text-sm font-bold text-white">{t("title")}</span>
      </div>

      {/* Format Tabs */}
      <div className="flex border-b border-white/[0.08] overflow-x-auto">
        {codeFormats.map((fmt) => (
          <button
            key={fmt}
            onClick={() => { setActiveFormat(fmt); setCopied(false); }}
            className={`flex-1 py-2.5 px-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeFormat === fmt
                ? "text-kolr-cyan border-b-2 border-kolr-cyan bg-white/3"
                : "text-kolr-text-muted hover:text-white"
            }`}
          >
            {fmt === "figma" ? "Figma Tokens" : fmt === "ase" ? "ASE" : t(fmt)}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="p-4">
        <pre className="text-xs font-mono text-kolr-text-muted bg-black/30 rounded-xl p-4 overflow-x-auto whitespace-pre max-h-[200px]">
          {generateCode()}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-3 border-t border-white/[0.08]">
        <button
          onClick={copyCode}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            copied
              ? "bg-kolr-green text-black"
              : "bg-kolr-cyan text-black hover:opacity-90"
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? t("copied") : t("copy")}
        </button>

        {/* Download Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDownloadOpen(!downloadOpen)}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-kolr-text-muted hover:text-white hover:border-kolr-purple transition-all duration-300"
          >
            <Download size={14} />
            <ChevronDown size={12} className={`transition-transform duration-200 ${downloadOpen ? "rotate-180" : ""}`} />
          </button>

          {downloadOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 min-w-[140px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
              {([
                { key: "css", label: ".css" },
                { key: "svg", label: ".svg" },
                { key: "json", label: ".json" },
                { key: "figma", label: "Figma Tokens" },
              ] as const).map((item) => (
                <button
                  key={item.key}
                  onClick={() => downloadFile(item.key)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-kolr-text-muted hover:text-white hover:bg-white/5 transition-all"
                >
                  <Download size={12} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
