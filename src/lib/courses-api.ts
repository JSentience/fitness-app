import type { Course } from "@/types/course.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, "") ||
  "https://wedev-api.sky.pro/api/fitness";
export type CourseSummary = Course;
export type CourseDetails = Course;

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

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
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

export async function getCourses(): Promise<CourseSummary[]> {
  return request<CourseSummary[]>("/courses");
}

export async function getCourseById(courseId: string): Promise<CourseDetails> {
  return request<CourseDetails>(`/courses/${courseId}`);
}

export { API_BASE_URL };
