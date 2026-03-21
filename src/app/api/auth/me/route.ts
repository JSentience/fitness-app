import { getCurrentUserServer } from "@/lib/auth-api";
import { toUser } from "@/lib/auth-user";
import {
  createUnauthorizedResponse,
  getAuthTokenFromCookies,
} from "@/lib/server-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const me = await getCurrentUserServer(token);

    return NextResponse.json(
      {
        user: toUser(me.email, me.name),
        selectedCourses: me.selectedCourses ?? [],
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch {
    return createUnauthorizedResponse();
  }
}
