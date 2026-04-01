/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError } from '@/lib/user-courses-api';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockGetCurrentUser = jest.fn<(token: string) => Promise<{ selectedCourses?: string[] }>>();
const mockAddUserCourse =
  jest.fn<(courseId: string, token: string) => Promise<{ message: string }>>();
let POST: typeof import('@/app/api/users/me/courses/route').POST;

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
    addUserCourse: (courseId: string, token: string) => mockAddUserCourse(courseId, token),
  };
});

describe('POST /api/users/me/courses', () => {
  beforeAll(async () => {
    ({ POST } = await import('@/app/api/users/me/courses/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
    mockGetCurrentUser.mockResolvedValue({ selectedCourses: [] });
  });

  it('возвращает 400, если courseId не передан', async () => {
    const response = await POST(
      new Request('http://localhost/api/users/me/courses', {
        method: 'POST',
        body: JSON.stringify({ courseId: '   ' }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Не указан идентификатор курса',
    });
    expect(mockGetCurrentUser).not.toHaveBeenCalled();
    expect(mockAddUserCourse).not.toHaveBeenCalled();
  });

  it('возвращает already-added без вызова нижележащего слоя, если курс уже у пользователя', async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ selectedCourses: ['course-1'] });

    const response = await POST(
      new Request('http://localhost/api/users/me/courses', {
        method: 'POST',
        body: JSON.stringify({ courseId: 'course-1' }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Курс уже добавлен',
      courseState: 'already-added',
    });
    expect(mockAddUserCourse).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от addUserCourse', async () => {
    mockAddUserCourse.mockRejectedValueOnce(new ApiError('Конфликт данных', 409));

    const response = await POST(
      new Request('http://localhost/api/users/me/courses', {
        method: 'POST',
        body: JSON.stringify({ courseId: 'course-1' }),
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: 'Конфликт данных',
    });
  });

  it('нормализует duplicate-ошибку внешнего API в already-added', async () => {
    mockAddUserCourse.mockRejectedValueOnce(new ApiError('Курс уже был добавлен', 400));

    const response = await POST(
      new Request('http://localhost/api/users/me/courses', {
        method: 'POST',
        body: JSON.stringify({ courseId: 'course-1' }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Курс уже был добавлен',
      courseState: 'already-added',
    });
  });
});
