import { getErrorStatus } from '@/lib/error-utils';
import {
  createBadRequestResponse,
  createRouteErrorResponse,
  normalizeRouteParam,
} from '@/lib/route-response';
import { requireAuthToken } from '@/lib/server-auth';
import { getCourseProgress, getWorkoutProgress } from '@/lib/workouts-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = normalizeRouteParam(searchParams.get('courseId'));
    const workoutId = normalizeRouteParam(searchParams.get('workoutId'));

    if (!courseId) {
      return createBadRequestResponse('Не указан courseId');
    }

    const result = workoutId
      ? await getWorkoutProgress(courseId, workoutId, auth.token)
      : await getCourseProgress(courseId, auth.token);

    return NextResponse.json(result);
  } catch (error) {
    if (getErrorStatus(error, 500) === 503) {
      return NextResponse.json(null);
    }

    return createRouteErrorResponse(error, 'Не удалось получить прогресс', 500);
  }
}
