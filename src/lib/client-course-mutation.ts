import type { CourseMutationResponse } from '@/lib/course-membership';
import {
    addCourseId,
    isAlreadyAddedCourseMutation,
    isAlreadyRemovedCourseMutation,
    isSuccessfulAddCourseMutation,
    isSuccessfulRemoveCourseMutation,
    removeCourseId,
} from '@/lib/course-membership';

type SuccessfulCourseMutation = {
  nextSelectedCourses: string[];
  wasAlreadyApplied: boolean;
};

export function resolveAddCourseMutation(
  selectedCourses: string[],
  courseId: string,
  response: CourseMutationResponse,
): SuccessfulCourseMutation | null {
  if (!isSuccessfulAddCourseMutation(response.courseState)) {
    return null;
  }

  return {
    nextSelectedCourses: addCourseId(selectedCourses, courseId),
    wasAlreadyApplied: isAlreadyAddedCourseMutation(response.courseState),
  };
}

export function resolveRemoveCourseMutation(
  selectedCourses: string[],
  courseId: string,
  response: CourseMutationResponse,
): SuccessfulCourseMutation | null {
  if (!isSuccessfulRemoveCourseMutation(response.courseState)) {
    return null;
  }

  return {
    nextSelectedCourses: removeCourseId(selectedCourses, courseId),
    wasAlreadyApplied: isAlreadyRemovedCourseMutation(response.courseState),
  };
}
