"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, Download, FileCode } from "lucide-react";

interface PaletteExportProps {
  colors: string[];
}

type ExportFormat = "css" | "tailwind" | "scss" | "json";

export default function PaletteExport({ colors }: PaletteExportProps) {
  const t = useTranslations("export");
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const generateCode = (): string => {
    switch (activeFormat) {
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
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSVG = () => {
    const width = 500;
    const colorWidth = width / colors.length;
    const rects = colors
      .map((c, i) => `<rect x="${i * colorWidth}" y="0" width="${colorWidth}" height="100" fill="${c}"/>`)
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="100">${rects}</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formats: ExportFormat[] = ["css", "tailwind", "scss", "json"];

  return (
    <div className="bg-kolr-surface border border-kolr-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-kolr-border">
        <FileCode size={16} className="text-kolr-cyan" />
        <span className="text-sm font-bold text-white">{t("title")}</span>
      </div>

      {/* Format Tabs */}
      <div className="flex border-b border-kolr-border">
        {formats.map((fmt) => (
          <button
            key={fmt}
            onClick={() => { setActiveFormat(fmt); setCopied(false); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeFormat === fmt
                ? "text-kolr-cyan border-b-2 border-kolr-cyan bg-white/3"
                : "text-kolr-text-muted hover:text-white"
            }`}
          >
            {t(fmt)}
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
      <div className="flex gap-2 p-3 border-t border-kolr-border">
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
        <button
          onClick={downloadSVG}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-kolr-text-muted hover:text-white hover:border-kolr-purple transition-all duration-300"
        >
          <Download size={14} />
          SVG
        </button>
      </div>
    </div>
  );
}
