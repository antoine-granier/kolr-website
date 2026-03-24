import { NextRequest, NextResponse } from "next/server";
import { checkCsrf } from "@/lib/csrf";

// Simple in-memory rate limiter (per serverless instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Max response size from external sites (1 MB)
const MAX_RESPONSE_SIZE = 1_000_000;

function extractColorsFromText(text: string): string[] {
  const colorSet = new Set<string>();

  // Match hex colors: #RGB, #RRGGBB, #RRGGBBAA
  const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;
  let match;
  while ((match = hexRegex.exec(text)) !== null) {
    let hex = match[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 6 || hex.length === 8) {
      colorSet.add(`#${hex.substring(0, 6).toLowerCase()}`);
    }
  }

  // Match rgb/rgba
  const rgbRegex = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  while ((match = rgbRegex.exec(text)) !== null) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      colorSet.add(
        `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`
      );
    }
  }

  // Match hsl
  const hslRegex = /hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/g;
  while ((match = hslRegex.exec(text)) !== null) {
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    if (h <= 360 && s <= 100 && l <= 100) {
      colorSet.add(hslToHex(h, s, l));
    }
  }

  // Match CSS named colors commonly used
  const namedColors: Record<string, string> = {
    white: "#ffffff",
    black: "#000000",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    gray: "#808080",
    grey: "#808080",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    navy: "#000080",
    teal: "#008080",
    maroon: "#800000",
    olive: "#808000",
    coral: "#ff7f50",
    salmon: "#fa8072",
    gold: "#ffd700",
    indigo: "#4b0082",
    violet: "#ee82ee",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    crimson: "#dc143c",
    chocolate: "#d2691e",
    steelblue: "#4682b4",
    darkblue: "#00008b",
    darkgreen: "#006400",
    darkred: "#8b0000",
    lightblue: "#add8e6",
    lightgreen: "#90ee90",
    lightgray: "#d3d3d3",
    lightgrey: "#d3d3d3",
    darkgray: "#a9a9a9",
    darkgrey: "#a9a9a9",
    whitesmoke: "#f5f5f5",
    ghostwhite: "#f8f8ff",
    beige: "#f5f5dc",
    ivory: "#fffff0",
    linen: "#faf0e6",
    lavender: "#e6e6fa",
    mintcream: "#f5fffa",
    aliceblue: "#f0f8ff",
    seashell: "#fff5ee",
    honeydew: "#f0fff0",
    azure: "#f0ffff",
    snow: "#fffafa",
  };

  // Match named colors in CSS properties
  const cssPropertyRegex = /(?:color|background|background-color|border-color|fill|stroke)\s*:\s*([a-zA-Z]+)/gi;
  while ((match = cssPropertyRegex.exec(text)) !== null) {
    const name = match[1].toLowerCase();
    if (namedColors[name]) {
      colorSet.add(namedColors[name]);
    }
  }

  return Array.from(colorSet);
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

// Filter out very common/boring colors and sort by visual importance
function filterAndRankColors(colors: string[]): string[] {
  const boring = new Set([
    "#000000", "#ffffff", "#000", "#fff",
    "#111111", "#222222", "#333333", "#444444",
    "#555555", "#666666", "#777777", "#888888",
    "#999999", "#aaaaaa", "#bbbbbb", "#cccccc",
    "#dddddd", "#eeeeee", "#f5f5f5", "#f8f8f8",
    "#fafafa", "#f0f0f0", "#e0e0e0", "#d0d0d0",
    "#808080", "#c0c0c0",
  ]);

  // Separate into interesting and neutral
  const interesting: string[] = [];
  const neutral: string[] = [];

  for (const color of colors) {
    const hex = color.toLowerCase();
    if (boring.has(hex)) {
      neutral.push(color);
    } else {
      // Check if it's a near-gray
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;

      if (saturation < 0.08) {
        neutral.push(color);
      } else {
        interesting.push(color);
      }
    }
  }

  // Return interesting first, then neutrals
  return [...interesting, ...neutral];
}

export async function POST(request: NextRequest) {
  try {
    // CSRF check
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { url } = await request.json();

    if (!url || typeof url !== "string" || url.length > 2048) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Block private/internal IPs
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.startsWith("127.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("172.") ||
      hostname.startsWith("169.254.") ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname === "[::1]" ||
      hostname.startsWith("fe80:") ||
      hostname.startsWith("[fe80:") ||
      hostname.startsWith("fc00:") ||
      hostname.startsWith("[fc00:") ||
      hostname.startsWith("fd") ||
      hostname === "metadata.google.internal" ||
      hostname.includes("internal")
    ) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the website HTML
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let html: string;
    try {
      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,*/*",
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch: HTTP ${response.status}` },
          { status: 502 }
        );
      }

      // Check content length before downloading
      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
        return NextResponse.json(
          { error: "Page too large to analyze" },
          { status: 413 }
        );
      }

      html = await response.text();
      if (html.length > MAX_RESPONSE_SIZE) {
        html = html.substring(0, MAX_RESPONSE_SIZE);
      }
    } catch (err: unknown) {
      clearTimeout(timeout);
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message.includes("abort")) {
        return NextResponse.json(
          { error: "Request timed out (10s)" },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch website: ${message}` },
        { status: 502 }
      );
    }

    // Also try to fetch external CSS files referenced in the HTML
    const cssLinks: string[] = [];
    const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      let cssUrl = linkMatch[1];
      if (cssUrl.startsWith("//")) {
        cssUrl = `https:${cssUrl}`;
      } else if (cssUrl.startsWith("/")) {
        cssUrl = `${parsedUrl.origin}${cssUrl}`;
      } else if (!cssUrl.startsWith("http")) {
        cssUrl = `${parsedUrl.origin}/${cssUrl}`;
      }
      cssLinks.push(cssUrl);
    }

    // Also match href first pattern: <link href="..." rel="stylesheet">
    const linkRegex2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi;
    while ((linkMatch = linkRegex2.exec(html)) !== null) {
      let cssUrl = linkMatch[1];
      if (cssUrl.startsWith("//")) {
        cssUrl = `https:${cssUrl}`;
      } else if (cssUrl.startsWith("/")) {
        cssUrl = `${parsedUrl.origin}${cssUrl}`;
      } else if (!cssUrl.startsWith("http")) {
        cssUrl = `${parsedUrl.origin}/${cssUrl}`;
      }
      if (!cssLinks.includes(cssUrl)) {
        cssLinks.push(cssUrl);
      }
    }

    // Fetch up to 5 CSS files
    let allText = html;
    const cssPromises = cssLinks.slice(0, 5).map(async (cssUrl) => {
      try {
        const cssController = new AbortController();
        const cssTimeout = setTimeout(() => cssController.abort(), 5000);
        const cssResponse = await fetch(cssUrl, {
          signal: cssController.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        clearTimeout(cssTimeout);
        if (cssResponse.ok) {
          return await cssResponse.text();
        }
      } catch {
        // Ignore CSS fetch errors
      }
      return "";
    });

    const cssResults = await Promise.all(cssPromises);
    for (const css of cssResults) {
      allText += "\n" + css;
    }

    // Extract colors from all content
    const rawColors = extractColorsFromText(allText);
    const colors = filterAndRankColors(rawColors);

    return NextResponse.json(
      {
        colors,
        url: parsedUrl.toString(),
        cssFilesAnalyzed: cssLinks.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 }
    );
  }
}
