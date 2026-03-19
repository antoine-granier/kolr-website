"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

function hexToHsv(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length < 6) return [0, 0, 0];
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, v * 100];
}

function hsvToHex(h: number, s: number, v: number): string {
  h /= 360; s /= 100; v /= 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return `#${[r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function hueToHex(h: number): string {
  return hsvToHex(h, 100, 100);
}

function useDrag(onDrag: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onDrag(
      Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    );
  }, [onDrag]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    const pos = "touches" in e ? e.touches[0] : e;
    handleMove(pos.clientX, pos.clientY);
  }, [handleMove]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const pos = "touches" in e ? e.touches[0] : e;
      handleMove(pos.clientX, pos.clientY);
    };
    const onEnd = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [handleMove]);

  return { ref, handleStart };
}

export default function ColorPicker({ value, onChange, size = "md", children }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
  const [hexInput, setHexInput] = useState(value);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const newHsv = hexToHsv(value);
    if (Math.abs(newHsv[0] - hsv[0]) > 1 || Math.abs(newHsv[1] - hsv[1]) > 1 || Math.abs(newHsv[2] - hsv[2]) > 1) {
      setHsv(newHsv);
    }
    setHexInput(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handler); };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const openPicker = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const panelW = 290;
      const panelH = 310;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > panelH + 8 ? rect.bottom + 8 : rect.top - panelH - 8;
      const left = Math.min(rect.left, window.innerWidth - panelW - 8);
      setPos({ top: Math.max(8, top), left: Math.max(8, left) });
    }
    setOpen(!open);
  };

  const updateFromHsv = useCallback((h: number, s: number, v: number) => {
    setHsv([h, s, v]);
    const hex = hsvToHex(h, s, v);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  const handleHexInput = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setHsv(hexToHsv(val));
      onChange(val.toUpperCase());
    }
  };

  const svDrag = useDrag(useCallback((x: number, y: number) => {
    updateFromHsv(hsv[0], x * 100, (1 - y) * 100);
  }, [hsv, updateFromHsv]));

  const hueDrag = useDrag(useCallback((x: number) => {
    updateFromHsv(x * 360, hsv[1], hsv[2]);
  }, [hsv, updateFromHsv]));

  const sizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-12 h-12 rounded-xl",
    lg: "w-14 h-14 rounded-xl",
  };

  const panel = open && mounted ? createPortal(
    <div
      ref={panelRef}
      className="fixed z-[9999] w-[290px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col gap-3"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* SV Panel */}
      <div
        ref={svDrag.ref}
        onMouseDown={svDrag.handleStart}
        onTouchStart={svDrag.handleStart}
        className="relative w-full h-[180px] rounded-xl cursor-crosshair overflow-hidden select-none"
        style={{ backgroundColor: hueToHex(hsv[0]) }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{ left: `${hsv[1]}%`, top: `${100 - hsv[2]}%` }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueDrag.ref}
        onMouseDown={hueDrag.handleStart}
        onTouchStart={hueDrag.handleStart}
        className="relative w-full h-3 rounded-full cursor-pointer select-none"
        style={{
          background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
      >
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-[2px] rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{ left: `${(hsv[0] / 360) * 100}%`, backgroundColor: hueToHex(hsv[0]) }}
        />
      </div>

      {/* Preview + Hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg border border-white/10 shrink-0"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexInput(e.target.value.toUpperCase())}
          maxLength={7}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-white outline-none focus:border-kolr-cyan transition-colors text-center uppercase"
        />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* Trigger */}
      {children ? (
        <div ref={triggerRef} onClick={openPicker} className="cursor-pointer flex-1 h-full">
          {children}
        </div>
      ) : (
        <div ref={triggerRef} className="shrink-0">
          <button
            type="button"
            onClick={openPicker}
            aria-label={`Pick color, current: ${value}`}
            className={`${sizes[size]} relative cursor-pointer group border-2 border-white/15 transition-all duration-200 hover:border-white/40 hover:scale-105 shadow-[0_2px_10px_rgba(0,0,0,0.3)] overflow-hidden`}
            style={{ backgroundColor: value }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          </button>
        </div>
      )}

      {panel}
    </>
  );
}
