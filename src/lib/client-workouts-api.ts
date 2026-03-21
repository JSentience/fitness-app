import { clientRequest } from "@/lib/client-api";
import type {
  CourseProgress,
  Workout,
  WorkoutProgress,
} from "@/lib/workouts-api";

export async function getCourseProgressClient(
  courseId: string,
): Promise<CourseProgress | null> {
  return clientRequest<CourseProgress | null>(
    `/api/users/me/progress?courseId=${encodeURIComponent(courseId)}`,
  );
}

export async function getWorkoutProgressClient(
  courseId: string,
  workoutId: string,
): Promise<WorkoutProgress | null> {
  return clientRequest<WorkoutProgress | null>(
    `/api/users/me/progress?courseId=${encodeURIComponent(courseId)}&workoutId=${encodeURIComponent(workoutId)}`,
  );
}

export async function getCourseWorkoutsClient(
  courseId: string,
): Promise<Workout[]> {
  return clientRequest<Workout[]>(`/api/courses/${courseId}/workouts`);
}

export async function getWorkoutByIdClient(
  workoutId: string,
): Promise<Workout> {
  return clientRequest<Workout>(`/api/workouts/${workoutId}`);
}

export async function saveWorkoutProgressClient(
  courseId: string,
  workoutId: string,
  progressData: number[],
): Promise<{ ok: true }> {
  return clientRequest<{ ok: true }>(
    `/api/courses/${courseId}/workouts/${workoutId}`,
    {
      method: "PATCH",
      body: { progressData },
    },
  );
}
