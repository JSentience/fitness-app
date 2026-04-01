/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError } from '@/lib/user-courses-api';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockGetCurrentUser = jest.fn<(token: string) => Promise<{ selectedCourses?: string[] }>>();
const mockRemoveUserCourse =
  jest.fn<(courseId: string, token: string) => Promise<{ message: string }>>();
let deleteRoute: typeof import('@/app/api/users/me/courses/[courseId]/route').DELETE;

jest.mock('@/lib/server-auth', () => ({
  createUnauthorizedResponse: () =>
    (jest.requireActual('next/server') as typeof import('next/server')).NextResponse.json(
      { message: 'Требуется авторизация' },
      { status: 401 },
    ),
  getAuthTokenFromCookies: () => mockGetAuthTokenFromCookies(),
  requireAuthToken: async () => {
    const token = await mockGetAuthTokenFromCookies();

    if (!token) {
      return {
        response: (
          jest.requireActual('next/server') as typeof import('next/server')
        ).NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 }),
      };
    }

    return { token };
  },
}));

jest.mock('@/lib/auth-api', () => ({
  getCurrentUser: (token: string) => mockGetCurrentUser(token),
}));

jest.mock('@/lib/user-courses-api', () => {
  const actual = jest.requireActual(
    '@/lib/user-courses-api',
  ) as typeof import('@/lib/user-courses-api');

  return {
    ...actual,
    removeUserCourse: (courseId: string, token: string) => mockRemoveUserCourse(courseId, token),
  };
});

describe('DELETE /api/users/me/courses/[courseId]', () => {
  beforeAll(async () => {
    ({ DELETE: deleteRoute } = await import('@/app/api/users/me/courses/[courseId]/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
    mockGetCurrentUser.mockResolvedValue({ selectedCourses: ['course-1'] });
  });

  it('возвращает 400, если параметр courseId пустой', async () => {
    const response = await deleteRoute(new Request('http://localhost/api/users/me/courses/%20'), {
      params: Promise.resolve({ courseId: '   ' }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Не указан идентификатор курса',
    });
    expect(mockRemoveUserCourse).not.toHaveBeenCalled();
  });

  it('возвращает not-added без вызова removeUserCourse, если курса нет у пользователя', async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ selectedCourses: ['course-2'] });

    const response = await deleteRoute(
      new Request('http://localhost/api/users/me/courses/course-1'),
      {
        params: Promise.resolve({ courseId: 'course-1' }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Курс не был добавлен',
      courseState: 'not-added',
    });
    expect(mockRemoveUserCourse).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от removeUserCourse', async () => {
    mockRemoveUserCourse.mockRejectedValueOnce(new ApiError('Недостаточно прав', 403));

    const response = await deleteRoute(
      new Request('http://localhost/api/users/me/courses/course-1'),
      {
        params: Promise.resolve({ courseId: 'course-1' }),
      },
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Недостаточно прав',
    });
  });

  it('нормализует not-added ошибку внешнего API в успешный ответ', async () => {
    mockRemoveUserCourse.mockRejectedValueOnce(
      new ApiError('Курс отсутствует у пользователя', 400),
    );

    const response = await deleteRoute(
      new Request('http://localhost/api/users/me/courses/course-1'),
      {
        params: Promise.resolve({ courseId: 'course-1' }),
      },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Курс отсутствует у пользователя',
      courseState: 'not-added',
    });
  });
});
