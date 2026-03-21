import { loginUser } from "@/lib/auth-api";
import { createAuthSuccessResponse } from "@/lib/auth-route";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Введите email и пароль" },
        { status: 400 },
      );
    }

    const { token } = await loginUser({ email, password });
    return await createAuthSuccessResponse(token, email);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Не удалось выполнить вход",
      },
      { status: 401 },
    );
  }
}
