import {
    createBadRequestResponse,
    createRouteErrorResponse,
    normalizeRouteParam,
    type RouteContext,
} from '@/lib/route-response';
import { requireAuthToken } from '@/lib/server-auth';
import { getWorkoutById } from '@/lib/workouts-api';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: RouteContext<{ workoutId: string }>) {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const { workoutId } = await params;
    const normalizedWorkoutId = normalizeRouteParam(workoutId);

    if (!normalizedWorkoutId) {
      return createBadRequestResponse('Не указан идентификатор тренировки');
    }

    const result = await getWorkoutById(normalizedWorkoutId, auth.token);
    return NextResponse.json(result);
  } catch (error) {
    return createRouteErrorResponse(error, 'Не удалось загрузить тренировку', 400);
  }
}
