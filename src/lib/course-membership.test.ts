import { describe, expect, it } from '@jest/globals';

import {
  addCourseId,
  isAlreadyAddedCourseErrorMessage,
  isAlreadyAddedCourseMutation,
  isAlreadyRemovedCourseMutation,
  isNotAddedCourseErrorMessage,
  isSuccessfulAddCourseMutation,
  isSuccessfulRemoveCourseMutation,
  normalizeCourseId,
  removeCourseId,
  resolveCourseId,
} from '@/lib/course-membership';

describe('course-membership helpers', () => {
  it('нормализует course id и не дублирует добавление', () => {
    expect(normalizeCourseId('  course-1  ')).toBe('course-1');
    expect(addCourseId(['course-1'], 'course-1')).toEqual(['course-1']);
    expect(addCourseId(['course-1'], 'course-2')).toEqual(['course-1', 'course-2']);
  });

  it('выбирает первый непустой course id', () => {
    expect(resolveCourseId('', '  ', 'course-2')).toBe('course-2');
    expect(resolveCourseId(undefined, ' course-3 ')).toBe('course-3');
    expect(resolveCourseId(undefined, '')).toBe('');
  });

  it('корректно удаляет курс из selected ids', () => {
    expect(removeCourseId(['course-1', 'course-2'], 'course-1')).toEqual(['course-2']);
  });

  it('правильно классифицирует mutation states', () => {
    expect(isSuccessfulAddCourseMutation(undefined)).toBe(true);
    expect(isSuccessfulAddCourseMutation('added')).toBe(true);
    expect(isSuccessfulAddCourseMutation('already-added')).toBe(true);
    expect(isAlreadyAddedCourseMutation('already-added')).toBe(true);

    expect(isSuccessfulRemoveCourseMutation(undefined)).toBe(true);
    expect(isSuccessfulRemoveCourseMutation('removed')).toBe(true);
    expect(isSuccessfulRemoveCourseMutation('not-added')).toBe(true);
    expect(isAlreadyRemovedCourseMutation('not-added')).toBe(true);
  });

  it('распознает backend-сообщения для идемпотентных course mutation ошибок', () => {
    expect(isAlreadyAddedCourseErrorMessage('Курс уже добавлен')).toBe(true);
    expect(isAlreadyAddedCourseErrorMessage('Этот курс уже был добавлен')).toBe(true);
    expect(isNotAddedCourseErrorMessage('Курс не найден у пользователя')).toBe(true);
    expect(isNotAddedCourseErrorMessage('Курс не был добавлен')).toBe(true);
  });
});
