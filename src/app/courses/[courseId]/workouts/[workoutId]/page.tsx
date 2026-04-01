import { resolveOrFallback, resolveOrNull } from '@/lib/async-utils';
import { getCourseById } from '@/lib/courses-api';
import { AUTH_COOKIE_NAME } from '@/lib/server-auth';
import { getWorkoutById, getWorkoutProgress, type Workout } from '@/lib/workouts-api';
import type { PageWithParamsProps } from '@/types/page-props.types';
import { cookies } from 'next/headers';

import { WorkoutLessonClient } from './WorkoutLessonClient';

export default async function WorkoutLessonPage({
  params,
}: PageWithParamsProps<{
  courseId: string;
  workoutId: string;
}>) {
  const { courseId, workoutId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  let initialWorkout: Workout | null = null;
  let initialProgressData: number[] | null = null;
  const initialCourseName = await resolveOrFallback(
    () => getCourseById(courseId).then((course) => course.nameRU),
    '',
  );

  if (token) {
    const [resolvedWorkout, resolvedProgress] = await Promise.all([
      resolveOrNull(() => getWorkoutById(workoutId, token)),
      resolveOrNull(() => getWorkoutProgress(courseId, workoutId, token)),
    ]);

    initialWorkout = resolvedWorkout;
    initialProgressData = resolvedProgress?.progressData ?? null;
  }

  return (
    <WorkoutLessonClient
      courseId={courseId}
      workoutId={workoutId}
      initialWorkout={initialWorkout}
      initialProgressData={initialProgressData}
      initialCourseName={initialCourseName}
    />
  );
}
