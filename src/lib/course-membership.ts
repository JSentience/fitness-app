export type CourseMutationState = 'added' | 'already-added' | 'removed' | 'not-added';

export type CourseMutationResponse = {
  message: string;
  courseState?: CourseMutationState;
};

const ALREADY_ADDED_MESSAGE_PATTERN = /курс уже добавлен|курс уже был добавлен/i;
const NOT_ADDED_MESSAGE_PATTERN =
  /курс не добавлен|курс не был добавлен|курс не найден у пользователя|курс отсутствует/i;

export function normalizeCourseId(courseId: string): string {
  return courseId.trim();
}

export function resolveCourseId(...courseIds: Array<string | null | undefined>): string {
  for (const courseId of courseIds) {
    const normalizedCourseId = normalizeCourseId(courseId ?? '');

    if (normalizedCourseId) {
      return normalizedCourseId;
    }
  }

  return '';
}

export function hasCourseId(courseIds: string[], courseId: string): boolean {
  return courseIds.includes(courseId);
}

export function addCourseId(courseIds: string[], courseId: string): string[] {
  return hasCourseId(courseIds, courseId) ? courseIds : [...courseIds, courseId];
}

export function removeCourseId(courseIds: string[], courseId: string): string[] {
  return courseIds.filter((id) => id !== courseId);
}

export function isSuccessfulAddCourseMutation(state?: CourseMutationState): boolean {
  return state === undefined || state === 'added' || state === 'already-added';
}

export function isSuccessfulRemoveCourseMutation(state?: CourseMutationState): boolean {
  return state === undefined || state === 'removed' || state === 'not-added';
}

export function isAlreadyAddedCourseMutation(state?: CourseMutationState): boolean {
  return state === 'already-added';
}

export function isAlreadyRemovedCourseMutation(state?: CourseMutationState): boolean {
  return state === 'not-added';
}

export function isAlreadyAddedCourseErrorMessage(message: string): boolean {
  return ALREADY_ADDED_MESSAGE_PATTERN.test(message);
}

export function isNotAddedCourseErrorMessage(message: string): boolean {
  return NOT_ADDED_MESSAGE_PATTERN.test(message);
}
