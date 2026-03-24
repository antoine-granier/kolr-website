import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

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

// Verify signed cookie in middleware (duplicated from lib to avoid import issues in edge)
const COOKIE_SECRET = process.env.TURNSTILE_SECRET_KEY || "fallback-dev-secret";
const COOKIE_NAME = "cf_verified";
const COOKIE_MAX_AGE = 900; // 15 minutes

function isValidSignedCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const ts = parseInt(timestamp);
  if (isNaN(ts)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now - ts > COOKIE_MAX_AGE) return false;

  const expected = createHmac("sha256", COOKIE_SECRET)
    .update(timestamp)
    .digest("hex");

  return signature === expected;
}

// Routes that require Turnstile verification
const PROTECTED_PATTERNS = [
  /^\/(fr|en)\/color\//,
  /^\/(fr|en)\/tools\//,
];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires Turnstile verification
  const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname));

  if (isProtected) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Rate limit color pages
    const isColorPage = /^\/(fr|en)\/color\/[0-9a-fA-F]{3,8}$/.test(pathname);
    if (isColorPage && isColorRateLimited(ip)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    // Check signed cookie — bots can't forge this
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!isValidSignedCookie(cookie)) {
      // Allow the page to load so the client-side TurnstileGate can show the captcha
      // But block if it looks like a bot (no accept header with text/html)
      const accept = request.headers.get("accept") || "";
      if (!accept.includes("text/html")) {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
