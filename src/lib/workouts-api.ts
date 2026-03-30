import {
  ApiError,
  buildApiError,
  parseApiResponse,
  requireApiData,
  type ApiErrorResponse,
} from '@/lib/api-response';

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, '') ||
  'https://wedev-api.sky.pro/api/fitness';

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

type RequestOptions = {
  token?: string;
};

async function request<T>(endpoint: string, { token }: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });
  const { data } = await parseApiResponse<T>(response);

  if (!response.ok) {
    throw buildApiError(
      response,
      data,
      `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}`,
    );
  }

  return requireApiData<T>(response, data, `Пустой ответ от API для ${endpoint}`);
}

/**
 * Сохранить прогресс тренировки.
 * progressData — массив чисел по порядку упражнений тренировки.
 * API требует Content-Type: text/plain (не application/json).
 */
export async function saveWorkoutProgress(
  courseId: string,
  workoutId: string,
  progressData: number[],
  token: string,
): Promise<void> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'text/plain',
  };

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/workouts/${workoutId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ progressData }),
    cache: 'no-store',
  });
  const { data } = await parseApiResponse<{ message?: string }>(response);

  if (!response.ok) {
    throw buildApiError(
      response,
      data,
      `Ошибка сохранения прогресса: ${response.status} ${response.statusText}`,
    );
  }
}

/**
 * Получить прогресс пользователя по конкретной тренировке.
 * Возвращает null если прогресс ещё не записан.
 */
export async function getWorkoutProgress(
  courseId: string,
  workoutId: string,
  token: string,
): Promise<WorkoutProgress | null> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(
    `${API_BASE_URL}/users/me/progress?courseId=${encodeURIComponent(courseId)}&workoutId=${encodeURIComponent(workoutId)}`,
    {
      method: 'GET',
      headers,
      cache: 'no-store',
    },
  );

  if (response.status === 404) return null;
  const { data } = await parseApiResponse<unknown>(response);

  if (!response.ok) {
    throw buildApiError(
      response,
      data,
      `Ошибка получения прогресса: ${response.status} ${response.statusText}`,
    );
  }

  if (!data || typeof data !== 'object') return null;

  const d = data as Record<string, unknown>;
  if (!('workoutId' in d) || !Array.isArray(d.progressData)) return null;

  return {
    workoutId: String(d.workoutId),
    workoutCompleted: Boolean(d.workoutCompleted),
    progressData: (d.progressData as unknown[]).map((v) => Number(v)),
  };
}

/**
 * Получить прогресс пользователя по всему курсу.
 * Возвращает null если прогресс ещё не записан.
 */
export async function getCourseProgress(
  courseId: string,
  token: string,
): Promise<CourseProgress | null> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(
    `${API_BASE_URL}/users/me/progress?courseId=${encodeURIComponent(courseId)}`,
    {
      method: 'GET',
      headers,
      cache: 'no-store',
    },
  );

  if (response.status === 404) return null;
  const { data } = await parseApiResponse<unknown>(response);

  if (!response.ok) {
    throw buildApiError(
      response,
      data,
      `Ошибка получения прогресса: ${response.status} ${response.statusText}`,
    );
  }

  if (!data || typeof data !== 'object') return null;

  const d = data as Record<string, unknown>;
  if (!('courseId' in d) || !Array.isArray(d.workoutsProgress)) return null;

  return {
    courseId: String(d.courseId),
    courseCompleted: Boolean(d.courseCompleted),
    workoutsProgress: (d.workoutsProgress as Record<string, unknown>[]).map((w) => ({
      workoutId: String(w.workoutId),
      workoutCompleted: Boolean(w.workoutCompleted),
      progressData: Array.isArray(w.progressData)
        ? (w.progressData as unknown[]).map((v) => Number(v))
        : [],
    })),
  };
}

export async function getCourseWorkouts(courseId: string, token: string): Promise<Workout[]> {
  return request<Workout[]>(`/courses/${courseId}/workouts`, { token });
}

export async function getWorkoutById(workoutId: string, token: string): Promise<Workout> {
  return request<Workout>(`/workouts/${workoutId}`, { token });
}

export { API_BASE_URL, ApiError };
export type { ApiErrorResponse };
