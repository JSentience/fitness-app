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
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, "") ||
  "https://wedev-api.sky.pro/api/fitness";

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

export type ApiErrorResponse = {
  message?: string;
  error?: string;
};

function getApiErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("message" in data && typeof data.message === "string") {
    return data.message;
  }

  if ("error" in data && typeof data.error === "string") {
    return data.error;
  }

  return null;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  token?: string;
};

async function request<T>(
  endpoint: string,
  { token }: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const rawText = await response.text();
  let data: T | ApiErrorResponse | null = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText) as T | ApiErrorResponse;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = getApiErrorMessage(data);

    throw new ApiError(
      message ||
        `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  if (data === null) {
    throw new ApiError(`Пустой ответ от API для ${endpoint}`, response.status);
  }

  return data as T;
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
    "Content-Type": "text/plain",
  };

  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/workouts/${workoutId}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ progressData }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const rawText = await response.text();
    let message: string | null = null;
    try {
      const data = JSON.parse(rawText) as { message?: string };
      message = data.message ?? null;
    } catch {
      // ignore
    }
    throw new ApiError(
      message ??
        `Ошибка сохранения прогресса: ${response.status} ${response.statusText}`,
      response.status,
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
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;

  const rawText = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    // ignore
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `Ошибка получения прогресса: ${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status);
  }

  if (!data || typeof data !== "object") return null;

  const d = data as Record<string, unknown>;
  if (!("workoutId" in d) || !Array.isArray(d.progressData)) return null;

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
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;

  const rawText = await response.text();
  let data: unknown = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    // ignore
  }

  if (!response.ok) return null;

  if (!data || typeof data !== "object") return null;

  const d = data as Record<string, unknown>;
  if (!("courseId" in d) || !Array.isArray(d.workoutsProgress)) return null;

  return {
    courseId: String(d.courseId),
    courseCompleted: Boolean(d.courseCompleted),
    workoutsProgress: (d.workoutsProgress as Record<string, unknown>[]).map(
      (w) => ({
        workoutId: String(w.workoutId),
        workoutCompleted: Boolean(w.workoutCompleted),
        progressData: Array.isArray(w.progressData)
          ? (w.progressData as unknown[]).map((v) => Number(v))
          : [],
      }),
    ),
  };
}

export async function getCourseWorkouts(
  courseId: string,
  token: string,
): Promise<Workout[]> {
  return request<Workout[]>(`/courses/${courseId}/workouts`, { token });
}

export async function getWorkoutById(
  workoutId: string,
  token: string,
): Promise<Workout> {
  return request<Workout>(`/workouts/${workoutId}`, { token });
}

export { API_BASE_URL };
