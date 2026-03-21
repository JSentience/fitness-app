import { AUTH_COOKIE_NAME } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true as const });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
