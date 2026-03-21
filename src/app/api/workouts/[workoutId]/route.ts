import {
  createUnauthorizedResponse,
  getAuthTokenFromCookies,
} from "@/lib/server-auth";
import { getWorkoutById } from "@/lib/workouts-api";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    workoutId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const { workoutId } = await params;
    const result = await getWorkoutById(workoutId, token);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить тренировку",
      },
      { status: 400 },
    );
  }
}
