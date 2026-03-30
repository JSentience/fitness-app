import { clientRequest } from '@/lib/client-api';

export type CourseMutationState = 'added' | 'already-added' | 'removed' | 'not-added';

export type CourseMutationResponse = {
  message: string;
  courseState?: CourseMutationState;
};

export async function addUserCourseClient(courseId: string): Promise<CourseMutationResponse> {
  return clientRequest<CourseMutationResponse>('/api/users/me/courses', {
    method: 'POST',
    body: { courseId },
  });
}

export async function removeUserCourseClient(courseId: string): Promise<CourseMutationResponse> {
  return clientRequest<CourseMutationResponse>(`/api/users/me/courses/${courseId}`, {
    method: 'DELETE',
  });
}
