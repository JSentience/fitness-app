import { createUnauthorizedResponse, getAuthTokenFromCookies } from '@/lib/server-auth';
import { ApiError, getCourseProgress, getWorkoutProgress } from '@/lib/workouts-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId')?.trim() ?? '';
    const workoutId = searchParams.get('workoutId')?.trim() ?? '';

    if (!courseId) {
      return NextResponse.json({ message: 'Не указан courseId' }, { status: 400 });
    }

    const result = workoutId
      ? await getWorkoutProgress(courseId, workoutId, token)
      : await getCourseProgress(courseId, token);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Не удалось получить прогресс',
      },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}
