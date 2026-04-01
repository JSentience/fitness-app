import { describe, expect, it } from '@jest/globals';

import {
  resolveAddCourseMutation,
  resolveRemoveCourseMutation,
} from '@/lib/client-course-mutation';

describe('client-course-mutation', () => {
  it('возвращает nextSelectedCourses для already-added без дубликатов', () => {
    expect(
      resolveAddCourseMutation(['course-1'], 'course-1', {
        courseState: 'already-added',
        message: 'already',
      }),
    ).toEqual({
      nextSelectedCourses: ['course-1'],
      wasAlreadyApplied: true,
    });
  });

  it('возвращает nextSelectedCourses для removed/not-added', () => {
    expect(
      resolveRemoveCourseMutation(['course-1', 'course-2'], 'course-1', {
        courseState: 'not-added',
        message: 'not-added',
      }),
    ).toEqual({
      nextSelectedCourses: ['course-2'],
      wasAlreadyApplied: true,
    });
  });

  it('возвращает null для неуспешного состояния мутации', () => {
    expect(
      resolveAddCourseMutation(['course-1'], 'course-2', {
        courseState: 'removed' as never,
        message: 'unknown',
      }),
    ).toBeNull();
  });
});
