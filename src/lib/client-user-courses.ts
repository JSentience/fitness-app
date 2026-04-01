import { clientRequest } from '@/lib/client-api';
import { clientEndpoints } from '@/lib/client-endpoints';
import type { CourseMutationResponse } from '@/lib/course-membership';

export async function addUserCourseClient(courseId: string): Promise<CourseMutationResponse> {
  return clientRequest<CourseMutationResponse>(clientEndpoints.userCourses, {
    method: 'POST',
    body: { courseId },
  });
}

export async function removeUserCourseClient(courseId: string): Promise<CourseMutationResponse> {
  return clientRequest<CourseMutationResponse>(clientEndpoints.userCourse(courseId), {
    method: 'DELETE',
  });
}
