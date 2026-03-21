import { getCurrentUserServer } from "@/lib/auth-api";
import { toUser } from "@/lib/auth-user";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export async function createAuthSuccessResponse(
  token: string,
  fallbackEmail?: string,
) {
  const me = await getCurrentUserServer(token);
  const email = me.email?.trim() || fallbackEmail?.trim();

  const response = NextResponse.json({
    user: toUser(email, me.name),
    selectedCourses: me.selectedCourses ?? [],
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  return response;
}
