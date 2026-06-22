import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";

// Rate limit for dynamic color pages (per serverless instance).
// The /color/[hex] space is effectively infinite, so we cap how fast a single
// IP can generate those pages to avoid crawl/cost abuse. Everything else —
// including the web tools — is fully open and indexable by search engines.
const colorRateLimit = new Map<string, { count: number; resetAt: number }>();
const COLOR_RATE_LIMIT_WINDOW = 60_000; // 1 minute
const COLOR_RATE_LIMIT_MAX = 40; // color pages per minute per IP

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

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only the dynamic color pages are rate-limited. The web tools are the core
  // product and must open in one click — no security challenge, and crawlable
  // so Google/AdSense can index them. The sensitive server endpoint
  // (/api/extract-url) is protected on its own with CSRF + rate limiting.
  const isColorPage = /^\/(fr|en)\/color\/[0-9a-fA-F]{3,8}$/.test(pathname);
  if (isColorPage) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isColorRateLimited(ip)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
