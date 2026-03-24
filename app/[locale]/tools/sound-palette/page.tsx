"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Mic,
  MicOff,
  Copy,
  Check,
  Play,
  Square,
  Music,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ToolContent from "@/components/ToolContent";

// --- Audio analysis helpers ---

function analyzeFrequencyBands(analyser: AnalyserNode): number[] {
  const bufferLength = analyser.frequencyBinCount;
  const data = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(data);

  // Use perceptual frequency ranges (Hz) mapped to FFT bins
  // sampleRate is typically 48000, so each bin = sampleRate / fftSize
  const sampleRate = 48000;
  const binSize = sampleRate / (bufferLength * 2); // fftSize = bufferLength * 2

  // Frequency ranges for each band
  const ranges = [
    [20, 80],      // Sub-bass
    [80, 300],     // Bass
    [300, 2000],   // Mid
    [2000, 6000],  // Upper-mid
    [6000, 20000], // Treble
  ];

  return ranges.map(([low, high]) => {
    const startBin = Math.max(1, Math.floor(low / binSize));
    const endBin = Math.min(bufferLength - 1, Math.floor(high / binSize));
    if (startBin >= endBin) return 0;

    let sum = 0;
    for (let j = startBin; j <= endBin; j++) {
      sum += data[j];
    }
    return sum / (endBin - startBin + 1) / 255;
  });
}

function bandsToColors(bands: number[]): string[] {
  const totalEnergy = bands.reduce((a, b) => a + b, 0) || 1;
  const ratios = bands.map((b) => b / totalEnergy);

  // Find dominant band — it determines the base hue of the palette
  const dominantIndex = bands.indexOf(Math.max(...bands));

  // Base hue rotates based on which band dominates and its energy ratio
  // This means bass-heavy songs ≠ treble-heavy songs
  const dominantHues = [10, 35, 160, 220, 290];
  const baseHue = dominantHues[dominantIndex] + ratios[dominantIndex] * 60;

  // Spread: if energy is evenly distributed → wide hue spread (varied palette)
  // If one band dominates → narrow spread (monochromatic feel)
  const evenness = 1 - Math.max(...ratios); // 0 = one band dominates, ~0.8 = very even
  const hueSpread = 40 + evenness * 200; // 40° to 240° range

  return bands.map((energy, i) => {
    // Each color's hue is offset from baseHue based on its position and energy
    const positionOffset = (i / 4) * hueSpread - hueSpread / 2;
    const energyShift = (ratios[i] - 0.2) * 40; // shift based on relative energy
    const hue = (baseHue + positionOffset + energyShift + 360) % 360;

    // Saturation: high energy = vivid, low energy = muted
    const saturation = 40 + energy * 50;

    // Lightness: use the contrast between this band and the dominant one
    const contrast = Math.abs(energy - bands[dominantIndex]);
    const lightness = 20 + energy * 35 + contrast * 15;

    return hslToHex(hue, Math.min(saturation, 95), Math.min(lightness, 70));
  });
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export default function SoundPalettePage() {
  const t = useTranslations("nav");
  const tTool = useTranslations("toolSoundPalette");
  const locale = useLocale();

  const [colors, setColors] = useState<string[]>([
    "#1A1A2E",
    "#16213E",
    "#0F3460",
    "#533483",
    "#E94560",
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const samplesRef = useRef<number[][]>([]);

  const cleanup = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    sourceRef.current = null;
    analyserRef.current = null;
    audioContextRef.current = null;
    streamRef.current = null;
    animationRef.current = null;
    samplesRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContext();
    }
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;
    return { ctx: audioContextRef.current, analyser };
  }, []);

  const startVisualization = useCallback(() => {
    const loop = () => {
      if (!analyserRef.current) return;
      const bands = analyzeFrequencyBands(analyserRef.current);
      setVisualizerData([...bands]);
      samplesRef.current.push(bands);
      animationRef.current = requestAnimationFrame(loop);
    };
    loop();
  }, []);

  const computeFinalPalette = useCallback(() => {
    const samples = samplesRef.current;
    if (samples.length === 0) return;

    // Average all samples
    const avg = [0, 0, 0, 0, 0];
    for (const sample of samples) {
      for (let i = 0; i < 5; i++) {
        avg[i] += sample[i];
      }
    }
    for (let i = 0; i < 5; i++) {
      avg[i] /= samples.length;
    }

    // Also find peak values for more contrast
    const peaks = [0, 0, 0, 0, 0];
    for (const sample of samples) {
      for (let i = 0; i < 5; i++) {
        peaks[i] = Math.max(peaks[i], sample[i]);
      }
    }

    // Blend avg and peaks
    const blended = avg.map((a, i) => a * 0.6 + peaks[i] * 0.4);
    setColors(bandsToColors(blended));
    samplesRef.current = [];
  }, []);

  // --- File upload ---
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      cleanup();
      setFileName(file.name);
      setIsPlaying(true);

      const { ctx, analyser } = initAudio();
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = URL.createObjectURL(file);
      audioElementRef.current = audio;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      sourceRef.current = source;

      audio.play();
      startVisualization();

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        computeFinalPalette();
      });
    },
    [cleanup, initAudio, startVisualization, computeFinalPalette]
  );

  // --- Microphone ---
  const toggleMicrophone = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      computeFinalPalette();
      return;
    }

    cleanup();
    setFileName(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const { ctx, analyser } = initAudio();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsRecording(true);
      startVisualization();
    } catch {
      // Permission denied or no mic
    }
  }, [isRecording, cleanup, initAudio, startVisualization, computeFinalPalette]);

  // --- Stop playback ---
  const stopPlayback = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    computeFinalPalette();
  }, [computeFinalPalette]);

  // --- Copy color ---
  const copyColor = useCallback((hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  // --- Live palette during visualization ---
  const liveColors =
    isPlaying || isRecording ? bandsToColors(visualizerData) : colors;

  return (
    <section className="section">
      <div className="container max-w-[900px]">
        {/* Header */}
        <Reveal animation="reveal-up">
          <Link
            href={`/${locale}/tools/random`}
            className="inline-flex items-center gap-2 text-kolr-text-muted hover:text-kolr-cyan transition-colors mb-8 no-underline"
          >
            <ArrowLeft size={16} />
            {t("tools")}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {tTool("title")}
          </h1>
          <p className="text-kolr-text-muted text-lg mb-12">
            {tTool("description")}
          </p>
        </Reveal>

        {/* Controls */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Upload button */}
              <label className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-kolr-bg border-2 border-dashed border-kolr-border rounded-xl cursor-pointer hover:border-kolr-cyan transition-colors group">
                <Upload
                  size={20}
                  className="text-kolr-text-muted group-hover:text-kolr-cyan transition-colors"
                />
                <span className="text-kolr-text-muted group-hover:text-kolr-cyan transition-colors font-medium">
                  {fileName || tTool("uploadAudio")}
                </span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Mic button */}
              <button
                onClick={toggleMicrophone}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-kolr-bg border-2 border-kolr-border hover:border-kolr-purple text-kolr-text-muted hover:text-kolr-purple"
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                {isRecording ? tTool("stopRecording") : tTool("useMic")}
              </button>
            </div>

            {/* Playback controls */}
            {isPlaying && (
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={stopPlayback}
                  className="flex items-center gap-2 px-4 py-2 bg-kolr-bg border border-kolr-border rounded-lg hover:border-red-400 text-kolr-text-muted hover:text-red-400 transition-colors"
                >
                  <Square size={16} />
                  {tTool("stop")}
                </button>
                <div className="flex items-center gap-2 text-kolr-cyan text-sm">
                  <Play size={14} />
                  {tTool("analyzing")}
                </div>
              </div>
            )}

            {/* Visualizer */}
            <div className="flex items-end gap-2 h-32 mb-8 px-4">
              {visualizerData.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg transition-all duration-100"
                  style={{
                    height: `${Math.max(8, v * 100)}%`,
                    backgroundColor: liveColors[i],
                    opacity: isPlaying || isRecording ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            {/* Band labels */}
            <div className="flex gap-2 px-4 mb-2">
              {[
                tTool("bandSubBass"),
                tTool("bandBass"),
                tTool("bandMid"),
                tTool("bandUpperMid"),
                tTool("bandTreble"),
              ].map((label, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-xs text-kolr-text-muted"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Generated palette */}
        <Reveal animation="reveal-up" delay={2}>
          <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Music size={20} className="text-kolr-cyan" />
                {tTool("generatedPalette")}
              </h2>
              {!isPlaying && !isRecording && (
                <button
                  onClick={() => {
                    const randomBands = Array.from({ length: 5 }, () =>
                      Math.random()
                    );
                    setColors(bandsToColors(randomBands));
                    setVisualizerData(randomBands);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-kolr-bg border border-kolr-border rounded-lg hover:border-kolr-cyan text-kolr-text-muted hover:text-kolr-cyan transition-colors"
                >
                  <RefreshCw size={16} />
                  {tTool("randomize")}
                </button>
              )}
            </div>

            {/* Color swatches */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {liveColors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => copyColor(color, i)}
                  className="group relative aspect-square rounded-xl transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: color }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: getContrastColor(color) }}
                  >
                    {copiedIndex === i ? (
                      <Check size={20} />
                    ) : (
                      <Copy size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Color codes */}
            <div className="grid grid-cols-5 gap-3">
              {liveColors.map((color, i) => (
                <div key={i} className="text-center">
                  <span className="text-sm font-mono text-kolr-text-muted">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Explanation */}
        <Reveal animation="reveal-up" delay={3}>
          <div className="mt-8 bg-kolr-surface border border-kolr-border rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-4">{tTool("howTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                {
                  band: tTool("bandSubBass"),
                  range: "20-60 Hz",
                  color: tTool("colorDeepRed"),
                },
                {
                  band: tTool("bandBass"),
                  range: "60-250 Hz",
                  color: tTool("colorOrangeYellow"),
                },
                {
                  band: tTool("bandMid"),
                  range: "250-2k Hz",
                  color: tTool("colorGreenTeal"),
                },
                {
                  band: tTool("bandUpperMid"),
                  range: "2k-6k Hz",
                  color: tTool("colorBlueCyan"),
                },
                {
                  band: tTool("bandTreble"),
                  range: "6k-20k Hz",
                  color: tTool("colorPurplePink"),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center p-3 bg-kolr-bg rounded-xl border border-kolr-border"
                >
                  <div className="font-semibold text-sm mb-1">{item.band}</div>
                  <div className="text-xs text-kolr-text-muted mb-1">
                    {item.range}
                  </div>
                  <div className="text-xs text-kolr-cyan">{item.color}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* SEO content */}
        <ToolContent
          aboutContent={tTool.raw("aboutContent")}
          howToContent={tTool.raw("howToContent")}
          faqJson={tTool.raw("faq")}
        />
      </div>
    </section>
  );
}
