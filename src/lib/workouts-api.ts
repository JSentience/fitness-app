import { ApiError, type ApiErrorResponse } from '@/lib/api-response';
import {
  FITNESS_API_BASE_URL,
  fitnessApiNullableRequest,
  fitnessApiRequest,
} from '@/lib/fitness-api';

export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
};

export type Exercise = {
  _id: string;
  name: string;
  quantity: number;
};

export type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
};

function normalizeProgressNumber(value: unknown): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function createProgressEndpoint(courseId: string, workoutId?: string): string {
  const searchParams = new URLSearchParams({
    courseId,
  });

  if (workoutId) {
    searchParams.set('workoutId', workoutId);
  }

  return `/users/me/progress?${searchParams.toString()}`;
}

function normalizeWorkoutProgress(data: unknown): WorkoutProgress | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const progress = data as Record<string, unknown>;

  if (!('workoutId' in progress) || !Array.isArray(progress.progressData)) {
    return null;
  }

  return {
    workoutId: String(progress.workoutId),
    workoutCompleted: Boolean(progress.workoutCompleted),
    progressData: progress.progressData.map(normalizeProgressNumber),
  };
}

function normalizeCourseProgress(data: unknown): CourseProgress | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const progress = data as Record<string, unknown>;

  if (!('courseId' in progress) || !Array.isArray(progress.workoutsProgress)) {
    return null;
  }

  return {
    courseId: String(progress.courseId),
    courseCompleted: Boolean(progress.courseCompleted),
    workoutsProgress: progress.workoutsProgress.map((workoutProgress) => {
      if (!workoutProgress || typeof workoutProgress !== 'object') {
        return {
          workoutId: '',
          workoutCompleted: false,
          progressData: [],
        };
      }

      const normalizedWorkoutProgress = workoutProgress as Record<string, unknown>;

      return {
        workoutId: String(normalizedWorkoutProgress.workoutId ?? ''),
        workoutCompleted: Boolean(normalizedWorkoutProgress.workoutCompleted),
        progressData: Array.isArray(normalizedWorkoutProgress.progressData)
          ? normalizedWorkoutProgress.progressData.map(normalizeProgressNumber)
          : [],
      };
    }),
  };
}

export async function saveWorkoutProgress(
  courseId: string,
  workoutId: string,
  progressData: number[],
  token: string,
): Promise<void> {
  await fitnessApiRequest<void>(`/courses/${courseId}/workouts/${workoutId}`, {
    method: 'PATCH',
    token,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify({ progressData }),
    cache: 'no-store',
    allowEmpty: true,
    fallbackMessage: 'Не удалось сохранить прогресс',
  });
}

export async function getWorkoutProgress(
  courseId: string,
  workoutId: string,
  token: string,
): Promise<WorkoutProgress | null> {
  const data = await fitnessApiNullableRequest<unknown>(
    createProgressEndpoint(courseId, workoutId),
    {
      token,
      cache: 'no-store',
      nullStatuses: [404],
      fallbackMessage: 'Не удалось получить прогресс тренировки',
      timeoutMs: 2500,
    },
  );

  return normalizeWorkoutProgress(data);
}

export async function getCourseProgress(
  courseId: string,
  token: string,
): Promise<CourseProgress | null> {
  const data = await fitnessApiNullableRequest<unknown>(createProgressEndpoint(courseId), {
    token,
    cache: 'no-store',
    nullStatuses: [404],
    fallbackMessage: 'Не удалось получить прогресс курса',
    timeoutMs: 2500,
  });

  return normalizeCourseProgress(data);
}

export async function getCourseWorkouts(courseId: string, token: string): Promise<Workout[]> {
  return fitnessApiRequest<Workout[]>(`/courses/${courseId}/workouts`, {
    token,
    cache: 'no-store',
  });
}

export async function getWorkoutById(workoutId: string, token: string): Promise<Workout> {
  return fitnessApiRequest<Workout>(`/workouts/${workoutId}`, {
    token,
    cache: 'no-store',
  });
}

export { FITNESS_API_BASE_URL as API_BASE_URL, ApiError };
export type { ApiErrorResponse };
