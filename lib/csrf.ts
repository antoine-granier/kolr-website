import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://kolr-app.vercel.app",
  "http://localhost:3000",
];

export function checkCsrf(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
