import { beforeEach, describe, expect, it } from '@jest/globals';

import {
  clearStoredAuthSession,
  hasAuthSessionHint,
  persistAuthSession,
  readStoredAuthUser,
  readStoredSelectedCourses,
  resolveAuthSession,
} from '@/lib/auth-session';

describe('auth-session', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.cookie = 'fitness-auth-hint=; path=/; max-age=0; samesite=lax';
  });

  it('нормализует user и selectedCourses из API-сессии', () => {
    expect(
      resolveAuthSession({
        user: {
          email: ' user@example.com ',
          name: ' ',
        },
        selectedCourses: ['course-1', 123, 'course-2'],
      }),
    ).toEqual({
      user: {
        email: 'user@example.com',
        name: 'user',
      },
      selectedCourses: ['course-1', 'course-2'],
    });
  });

  it('читает и сохраняет session в localStorage', () => {
    persistAuthSession({
      user: {
        email: 'user@example.com',
        name: 'User',
      },
      selectedCourses: ['course-1'],
    });

    expect(readStoredAuthUser()).toEqual({
      email: 'user@example.com',
      name: 'User',
    });
    expect(readStoredSelectedCourses()).toEqual(['course-1']);
    expect(hasAuthSessionHint()).toBe(true);
  });

  it('очищает localStorage для auth session', () => {
    persistAuthSession({
      user: {
        email: 'user@example.com',
        name: 'User',
      },
      selectedCourses: ['course-1'],
    });

    clearStoredAuthSession();

    expect(readStoredAuthUser()).toBeNull();
    expect(readStoredSelectedCourses()).toEqual([]);
    expect(hasAuthSessionHint()).toBe(false);
  });
});
