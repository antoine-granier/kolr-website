import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";

// Rate limit for dynamic color pages (per serverless instance)
const colorRateLimit = new Map<string, { count: number; resetAt: number }>();
const COLOR_RATE_LIMIT_WINDOW = 60_000; // 1 minute
const COLOR_RATE_LIMIT_MAX = 30; // 30 color pages per minute per IP

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

  // Rate limit /color/[hex] routes to prevent bot spam
  const colorMatch = pathname.match(/^\/(fr|en)\/color\/[0-9a-fA-F]{3,8}$/);
  if (colorMatch) {
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
