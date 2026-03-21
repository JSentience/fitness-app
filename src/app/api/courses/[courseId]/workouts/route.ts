import {
  createUnauthorizedResponse,
  getAuthTokenFromCookies,
} from "@/lib/server-auth";
import { getCourseWorkouts } from "@/lib/workouts-api";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const { courseId } = await params;
    const result = await getCourseWorkouts(courseId, token);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Не удалось загрузить тренировки курса",
      },
      { status: 400 },
    );
  }
}
