"use client";

import { useState, useEffect, startTransition } from "react";
import { useTranslations } from "next-intl";
import { Clock, Trash2, RotateCcw, X } from "lucide-react";

interface HistoryItem {
  id: string;
  colors: string[];
  timestamp: number;
}

interface PaletteHistoryProps {
  onRestore?: (colors: string[]) => void;
}

export default function PaletteHistory({ onRestore }: PaletteHistoryProps) {
  const t = useTranslations("history");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("kolr-palette-history");
    startTransition(() => {
      if (stored) {
        setHistory(JSON.parse(stored));
      }
      setNow(Date.now());
    });
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const deleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("kolr-palette-history", JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem("kolr-palette-history");
  };

  const timeAgo = (timestamp: number): string => {
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "< 1 min";
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  if (history.length === 0) {
    return (
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-kolr-cyan" />
          <span className="text-sm font-bold text-white">{t("title")}</span>
        </div>
        <p className="text-sm text-kolr-text-muted text-center py-4">
          {t("empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] overflow-hidden backdrop-blur-xl">
      <div className="flex items-center justify-between p-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-kolr-cyan" />
          <span className="text-sm font-bold text-white">{t("title")}</span>
        </div>
        <button
          onClick={clearAll}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-kolr-text-muted hover:text-kolr-red transition-colors"
        >
          <X size={12} />
          {t("clearAll")}
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/3 transition-colors group"
          >
            {/* Color swatches */}
            <div className="flex rounded-lg overflow-hidden flex-1 h-8">
              {item.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Time */}
            <span className="text-[10px] text-kolr-text-muted font-mono whitespace-nowrap">
              {timeAgo(item.timestamp)} {t("ago")}
            </span>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onRestore && (
                <button
                  onClick={() => onRestore(item.colors)}
                  className="p-1.5 rounded-lg text-kolr-text-muted hover:text-kolr-cyan transition-colors"
                  title={t("restore")}
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button
                onClick={() => deleteItem(item.id)}
                className="p-1.5 rounded-lg text-kolr-text-muted hover:text-kolr-red transition-colors"
                title={t("delete")}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to add a palette to history (call from other components)
export function addToHistory(colors: string[]) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("kolr-palette-history");
  const history: HistoryItem[] = stored ? JSON.parse(stored) : [];

  const newItem: HistoryItem = {
    id: Date.now().toString(),
    colors,
    timestamp: Date.now(),
  };

  const updated = [newItem, ...history].slice(0, 50);
  localStorage.setItem("kolr-palette-history", JSON.stringify(updated));
}
