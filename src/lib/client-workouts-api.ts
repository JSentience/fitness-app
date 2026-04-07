import { clientNullableRequest, clientRequest } from '@/lib/client-api';
import { clientEndpoints } from '@/lib/client-endpoints';
import type { CourseProgress, Workout, WorkoutProgress } from '@/lib/workouts-api';

export async function getCourseProgressClient(courseId: string): Promise<CourseProgress | null> {
  return clientNullableRequest<CourseProgress>(clientEndpoints.userProgress(courseId));
}

export async function getWorkoutProgressClient(
  courseId: string,
  workoutId: string,
): Promise<WorkoutProgress | null> {
  return clientNullableRequest<WorkoutProgress>(clientEndpoints.userProgress(courseId, workoutId));
}

export async function getCourseWorkoutsClient(courseId: string): Promise<Workout[]> {
  return clientRequest<Workout[]>(clientEndpoints.courseWorkouts(courseId));
}

export async function getWorkoutByIdClient(workoutId: string): Promise<Workout> {
  return clientRequest<Workout>(clientEndpoints.workout(workoutId));
}

export async function saveWorkoutProgressClient(
  courseId: string,
  workoutId: string,
  progressData: number[],
): Promise<{ ok: true }> {
  return clientRequest<{ ok: true }>(clientEndpoints.workoutProgress(courseId, workoutId), {
    method: 'PATCH',
    body: { progressData },
  });
}
