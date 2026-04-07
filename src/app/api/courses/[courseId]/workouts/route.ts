import {
    createBadRequestResponse,
    createRouteErrorResponse,
    normalizeRouteParam,
    type RouteContext,
} from '@/lib/route-response';
import { requireAuthToken } from '@/lib/server-auth';
import { getCourseWorkouts } from '@/lib/workouts-api';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: RouteContext<{ courseId: string }>) {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const { courseId } = await params;
    const normalizedCourseId = normalizeRouteParam(courseId);

    if (!normalizedCourseId) {
      return createBadRequestResponse('Не указан идентификатор курса');
    }

    const result = await getCourseWorkouts(normalizedCourseId, auth.token);
    return NextResponse.json(result);
  } catch (error) {
    return createRouteErrorResponse(error, 'Не удалось загрузить тренировки курса', 400);
  }
}
