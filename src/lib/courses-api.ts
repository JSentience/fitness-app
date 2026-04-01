import { ApiError, type ApiErrorResponse } from '@/lib/api-response';
import { FITNESS_API_BASE_URL, fitnessApiRequest } from '@/lib/fitness-api';
import type { Course } from '@/types/course.types';

export type CourseSummary = Course;
export type CourseDetails = Course;

export async function getCourses(): Promise<CourseSummary[]> {
  return fitnessApiRequest<CourseSummary[]>('/courses', {
    cache: 'no-store',
    fallbackMessage: 'Не удалось загрузить список курсов',
  });
}

export async function getCourseById(courseId: string): Promise<CourseDetails> {
  return fitnessApiRequest<CourseDetails>(`/courses/${courseId}`, {
    cache: 'no-store',
    fallbackMessage: 'Не удалось загрузить курс',
  });
}

export { FITNESS_API_BASE_URL as API_BASE_URL, ApiError };
export type { ApiErrorResponse };
