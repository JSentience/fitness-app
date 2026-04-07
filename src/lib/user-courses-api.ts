import { ApiError, type ApiErrorResponse } from '@/lib/api-response';
import type { CourseMutationResponse } from '@/lib/course-membership';
import { FITNESS_API_BASE_URL, fitnessApiRequest } from '@/lib/fitness-api';

export async function addUserCourse(
  courseId: string,
  token: string,
): Promise<CourseMutationResponse> {
  return fitnessApiRequest<CourseMutationResponse>('/users/me/courses', {
    method: 'POST',
    token,
    body: { courseId },
  });
}

export async function removeUserCourse(
  courseId: string,
  token: string,
): Promise<CourseMutationResponse> {
  return fitnessApiRequest<CourseMutationResponse>(`/users/me/courses/${courseId}`, {
    method: 'DELETE',
    token,
  });
}

export { FITNESS_API_BASE_URL as API_BASE_URL, ApiError };
export type { ApiErrorResponse };
