import {
  createUnauthorizedResponse,
  getAuthTokenFromCookies,
} from "@/lib/server-auth";
import { saveWorkoutProgress } from "@/lib/workouts-api";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    courseId: string;
    workoutId: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const body = (await request.json()) as { progressData?: number[] };
    const { courseId, workoutId } = await params;
    const progressData = Array.isArray(body.progressData)
      ? body.progressData.map((value) => Number(value))
      : [];

    await saveWorkoutProgress(courseId, workoutId, progressData, token);

    return NextResponse.json({ ok: true as const });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Не удалось сохранить прогресс",
      },
      { status: 400 },
    );
  }
}
