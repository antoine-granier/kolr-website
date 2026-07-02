import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Abuse protection for the dynamic /color/[hex] pages.
//
// The hex space is effectively infinite (~16M combinations), so every unseen
// hex triggers a fresh ISR render = a Vercel function invocation. Automated
// agents that scan that space (ignoring robots.txt) can generate unlimited
// billable renders. Because this check runs in the middleware/edge layer,
// returning a response here SHORT-CIRCUITS the request before the page
// function runs — blocked hits cost nothing.
//
// Primary gate: require genuine browser-navigation signals. Every mainstream
// browser (Chrome/Firefox/Safari/Edge, incl. mobile) sends `Sec-Fetch-Mode:
// navigate` / `Sec-Fetch-Dest: document` on a top-level page load. HTTP
// libraries used by scrapers/AI agents (requests, axios, node-fetch, curl,
// Go-http, Java, ...) do NOT — and this holds even when they spoof a Chrome
// User-Agent, which is why it beats a UA blocklist alone.
//
// Backstop: a per-IP rate limit (per warm serverless instance) to throttle a
// headless-browser scraper that does replay the sec-fetch headers.
//
// Trade-off (accepted): non-browser clients — link-preview unfurlers, search
// crawlers, RSS fetchers — are blocked on these pages too. The rest of the
// site (tools, blog, static pages) is untouched and fully crawlable.
// ---------------------------------------------------------------------------

const COLOR_PAGE_RE = /^\/(fr|en)\/color\/[0-9a-fA-F]{3,8}$/;

// Extra hard block: obviously non-browser / bot user agents.
const BOT_UA_RE =
  /bot|crawl|spider|slurp|curl|wget|python|scrapy|http[-_]?client|okhttp|axios|node-fetch|go-http|java\/|libwww|headless|phantom|puppeteer|playwright|gpt|claude|anthropic|bytespider|ccbot|semrush|ahrefs|mj12|dotbot/i;

const colorRateLimit = new Map<string, { count: number; resetAt: number }>();
const COLOR_RATE_LIMIT_WINDOW = 60_000; // 1 minute
const COLOR_RATE_LIMIT_MAX = 25; // color pages per minute per IP (per instance)

function isColorRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = colorRateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    colorRateLimit.set(ip, { count: 1, resetAt: now + COLOR_RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > COLOR_RATE_LIMIT_MAX;
}

function blocked(status: number, message: string): NextResponse {
  return new NextResponse(message, {
    status,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (COLOR_PAGE_RE.test(pathname)) {
    const ua = request.headers.get("user-agent") || "";
    const secFetchMode = request.headers.get("sec-fetch-mode");
    const secFetchDest = request.headers.get("sec-fetch-dest");

    // Require real browser-navigation signals. A programmatic fetch (missing
    // these headers, or an API-style fetch/xhr) never renders these pages.
    const isBrowserNavigation =
      secFetchMode === "navigate" || secFetchDest === "document";

    if (!isBrowserNavigation || !ua || BOT_UA_RE.test(ua)) {
      return blocked(403, "Forbidden");
    }

    // Backstop against headless-browser scrapers that replay sec-fetch headers.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isColorRateLimited(ip)) {
      return blocked(429, "Too Many Requests");
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
