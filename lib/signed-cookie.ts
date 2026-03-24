import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.TURNSTILE_SECRET_KEY || "fallback-dev-secret";

export function createSignedValue(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", SECRET)
    .update(timestamp)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifySignedValue(value: string, maxAgeSeconds = 900): boolean {
  const parts = value.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const ts = parseInt(timestamp);
  if (isNaN(ts)) return false;

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > maxAgeSeconds) return false;

  // Check signature with constant-time comparison
  const expected = createHmac("sha256", SECRET)
    .update(timestamp)
    .digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;

  return timingSafeEqual(sigBuf, expBuf);
}
