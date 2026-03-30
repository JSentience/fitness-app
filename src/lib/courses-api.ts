import {
  ApiError,
  buildApiError,
  parseApiResponse,
  requireApiData,
  type ApiErrorResponse,
} from '@/lib/api-response';
import type { Course } from '@/types/course.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, '') ||
  'https://wedev-api.sky.pro/api/fitness';
export type CourseSummary = Course;
export type CourseDetails = Course;

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
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

export async function getCourses(): Promise<CourseSummary[]> {
  return request<CourseSummary[]>('/courses');
}

export async function getCourseById(courseId: string): Promise<CourseDetails> {
  return request<CourseDetails>(`/courses/${courseId}`);
}

export { API_BASE_URL, ApiError };
export type { ApiErrorResponse };
