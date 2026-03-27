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

// Bot User-Agents to block on protected routes
const BOT_PATTERNS = [
  /Mediapartners-Google/i,
  /AdsBot-Google/i,
  /Googlebot/i,
  /bingbot/i,
  /Baiduspider/i,
  /YandexBot/i,
  /Sogou/i,
  /DotBot/i,
  /PetalBot/i,
  /SemrushBot/i,
  /AhrefsBot/i,
  /MJ12bot/i,
  /DataForSeoBot/i,
  /GPTBot/i,
  /ChatGPT-User/i,
  /CCBot/i,
  /ClaudeBot/i,
  /anthropic-ai/i,
  /Bytespider/i,
  /crawl/i,
  /spider/i,
  /bot\b/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
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

    // Block known bots on protected routes
    const ua = request.headers.get("user-agent");
    if (isBot(ua)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check signed cookie — block server-side rendering if not verified
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!isValidSignedCookie(cookie)) {
      const accept = request.headers.get("accept") || "";
      // Non-browser requests (no text/html) → 403
      if (!accept.includes("text/html")) {
        return new NextResponse("Forbidden", { status: 403 });
      }
      // Browser requests without cookie → serve a minimal captcha page
      // This prevents SSR from leaking the real page content
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
      const captchaHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Check - Kolr</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; font-family: system-ui, -apple-system, sans-serif; }
    .gate { background: #111; border: 1px solid #222; border-radius: 16px; padding: 40px; max-width: 380px; width: 100%; margin: 16px; text-align: center; }
    .icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(0,242,255,0.1); border: 1px solid rgba(0,242,255,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
    .icon svg { color: #00f2ff; }
    h2 { color: #fff; font-size: 18px; margin-bottom: 6px; }
    p { color: #888; font-size: 14px; margin-bottom: 24px; }
    .cf-turnstile { display: flex; justify-content: center; margin-bottom: 16px; }
    .footer { color: rgba(136,136,136,0.5); font-size: 12px; margin-top: 16px; }
    .error { color: #ff4d4d; font-size: 13px; display: none; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="gate">
    <div class="icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    </div>
    <h2>Security Check</h2>
    <p>Quick verification to access this page.</p>
    <div class="cf-turnstile" data-sitekey="${siteKey}" data-callback="onVerify" data-theme="dark"></div>
    <p class="error" id="error">Verification failed. Please try again.</p>
    <p class="footer">Protected by Cloudflare Turnstile</p>
  </div>
  <script>
    function onVerify(token) {
      fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      }).then(res => {
        if (res.ok) {
          window.location.reload();
        } else {
          document.getElementById("error").style.display = "block";
        }
      });
    }
  </script>
</body>
</html>`;
      return new NextResponse(captchaHtml, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
