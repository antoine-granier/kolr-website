import { NextRequest, NextResponse } from "next/server";
import { verifySignedValue } from "@/lib/signed-cookie";

const COOKIE_NAME = "cf_verified";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  if (!cookie || !verifySignedValue(cookie)) {
    return NextResponse.json({ verified: false });
  }

  return NextResponse.json({ verified: true });
}
