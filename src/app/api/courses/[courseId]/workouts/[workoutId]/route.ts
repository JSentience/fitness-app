import {
    createBadRequestResponse,
    createRouteErrorResponse,
    normalizeRouteParam,
    type RouteContext,
} from '@/lib/route-response';
import { requireAuthToken } from '@/lib/server-auth';
import { saveWorkoutProgress } from '@/lib/workouts-api';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: RouteContext<{ courseId: string; workoutId: string }>,
) {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as { progressData?: number[] };
    const { courseId, workoutId } = await params;
    const normalizedCourseId = normalizeRouteParam(courseId);
    const normalizedWorkoutId = normalizeRouteParam(workoutId);
    const progressData = Array.isArray(body.progressData)
      ? body.progressData.map((value) => Number(value))
      : [];

    if (!normalizedCourseId) {
      return createBadRequestResponse('Не указан идентификатор курса');
    }

    if (!normalizedWorkoutId) {
      return createBadRequestResponse('Не указан идентификатор тренировки');
    }

    await saveWorkoutProgress(
      normalizedCourseId,
      normalizedWorkoutId,
      progressData,
      auth.token,
    );

    return NextResponse.json({ ok: true as const });
  } catch (error) {
    return createRouteErrorResponse(error, 'Не удалось сохранить прогресс', 400);
  }
}
