"use client";

import { useState, useEffect, useCallback } from "react";
import { Accessibility, X, Type, Sun, Zap, Eye, MousePointer, Focus } from "lucide-react";

interface A11ySettings {
  textSize: "normal" | "lg" | "xl";
  highContrast: boolean;
  noMotion: boolean;
  colorblind: "" | "protanopia" | "deuteranopia" | "tritanopia";
  focusVisible: boolean;
  bigCursor: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  textSize: "normal",
  highContrast: false,
  noMotion: false,
  colorblind: "",
  focusVisible: false,
  bigCursor: false,
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kolr-a11y");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {}
  }, []);

  function applyStyleTag(id: string, css: string) {
    let tag = document.getElementById(id) as HTMLStyleElement | null;
    if (!css) {
      tag?.remove();
      return;
    }
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = css;
  }

  // Apply styles directly via JS (avoids Tailwind CSS purging)
  useEffect(() => {
    const html = document.documentElement;

    // Text size
    html.style.fontSize = settings.textSize === "xl" ? "140%" : settings.textSize === "lg" ? "120%" : "";

    // High contrast — inject/update a <style> tag
    applyStyleTag("a11y-high-contrast", settings.highContrast ? `
      body { background: #000 !important; }
      * { border-color: rgba(255,255,255,0.4) !important; }
      [class*="text-muted"], [class*="opacity-"] { color: #dddddd !important; opacity: 1 !important; }
    ` : "");

    // Reduced animations
    applyStyleTag("a11y-no-motion", settings.noMotion ? `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .reveal, .reveal-up, .reveal-scale { opacity: 1 !important; transform: none !important; }
    ` : "");

    // Colorblind filter
    html.style.filter = settings.colorblind ? `url(#${settings.colorblind})` : "";

    // Enhanced focus
    applyStyleTag("a11y-focus", settings.focusVisible ? `
      *:focus-visible {
        outline: 3px solid #ffff00 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 6px rgba(255,255,0,0.3) !important;
      }
    ` : "");

    // Large cursor
    applyStyleTag("a11y-cursor", settings.bigCursor ? `
      *, *::before, *::after {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M5 2l20 14-9 2 5 10-4 2-5-10-7 7z' fill='%23fff' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E") 5 2, auto !important;
      }
    ` : "");

    localStorage.setItem("kolr-a11y", JSON.stringify(settings));
  }, [settings]);

  const update = useCallback((key: keyof A11ySettings, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS);

  return (
    <>
      {/* Colorblind SVG filters */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[5.5rem] left-6 z-[9998] w-12 h-12 rounded-full bg-kolr-cyan text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Accessibility settings"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Accessibility size={20} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-40 left-6 z-[9998] w-[300px] bg-kolr-surface border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          role="dialog"
          aria-label="Accessibility settings"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Accessibility size={16} className="text-kolr-cyan" />
              <span className="text-sm font-bold text-white">Accessibility</span>
            </div>
            {hasChanges && (
              <button
                onClick={reset}
                className="text-xs text-kolr-text-muted hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
            {/* Text Size */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-kolr-text-muted uppercase tracking-wide mb-2">
                <Type size={14} /> Text size
              </label>
              <div className="flex gap-2">
                {(["normal", "lg", "xl"] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => update("textSize", size)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      settings.textSize === size
                        ? "bg-kolr-cyan text-black"
                        : "bg-white/5 text-kolr-text-muted hover:bg-white/10"
                    }`}
                  >
                    {size === "normal" ? "A" : size === "lg" ? "A+" : "A++"}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle options */}
            <ToggleOption
              icon={<Sun size={14} />}
              label="High contrast"
              active={settings.highContrast}
              onToggle={() => update("highContrast", !settings.highContrast)}
            />

            <ToggleOption
              icon={<Zap size={14} />}
              label="Reduce animations"
              active={settings.noMotion}
              onToggle={() => update("noMotion", !settings.noMotion)}
            />

            <ToggleOption
              icon={<Focus size={14} />}
              label="Enhanced focus"
              active={settings.focusVisible}
              onToggle={() => update("focusVisible", !settings.focusVisible)}
            />

            <ToggleOption
              icon={<MousePointer size={14} />}
              label="Large cursor"
              active={settings.bigCursor}
              onToggle={() => update("bigCursor", !settings.bigCursor)}
            />

            {/* Colorblind mode */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-kolr-text-muted uppercase tracking-wide mb-2">
                <Eye size={14} /> Colorblind mode
              </label>
              <div className="flex flex-col gap-1.5">
                {([
                  { value: "", label: "None" },
                  { value: "protanopia", label: "Protanopia (red-blind)" },
                  { value: "deuteranopia", label: "Deuteranopia (green-blind)" },
                  { value: "tritanopia", label: "Tritanopia (blue-blind)" },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update("colorblind", opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      settings.colorblind === opt.value
                        ? "bg-kolr-cyan text-black"
                        : "bg-white/5 text-kolr-text-muted hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleOption({ icon, label, active, onToggle }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
        active ? "bg-kolr-cyan text-black" : "bg-white/5 text-kolr-text-muted hover:bg-white/10"
      }`}
      role="switch"
      aria-checked={active}
    >
      <span className="flex items-center gap-2">{icon} {label}</span>
      <span className={`w-8 h-4 rounded-full relative transition-colors ${active ? "bg-black/20" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${active ? "left-4 bg-black" : "left-0.5 bg-white/40"}`} />
      </span>
    </button>
  );
}
