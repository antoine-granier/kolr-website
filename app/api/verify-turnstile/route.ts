import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { createSignedValue } from "@/lib/signed-cookie";
import { checkCsrf } from "@/lib/csrf";

const COOKIE_NAME = "cf_verified";
const COOKIE_MAX_AGE = 900; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    // CSRF check
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    const { token } = await request.json();

    if (!token || typeof token !== "string" || token.length > 4096) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const valid = await verifyTurnstile(token);

    if (!valid) {
      return NextResponse.json({ error: "Invalid" }, { status: 403 });
    }

    const signedValue = createSignedValue();
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, signedValue, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
