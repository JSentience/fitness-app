/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError, type CourseProgress, type WorkoutProgress } from '@/lib/workouts-api';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockGetCourseProgress =
  jest.fn<(courseId: string, token: string) => Promise<CourseProgress | null>>();
const mockGetWorkoutProgress =
  jest.fn<
    (courseId: string, workoutId: string, token: string) => Promise<WorkoutProgress | null>
  >();
let GET: typeof import('@/app/api/users/me/progress/route').GET;

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

jest.mock('@/lib/workouts-api', () => {
  const actual = jest.requireActual('@/lib/workouts-api') as typeof import('@/lib/workouts-api');

  return {
    ...actual,
    getCourseProgress: (courseId: string, token: string) => mockGetCourseProgress(courseId, token),
    getWorkoutProgress: (courseId: string, workoutId: string, token: string) =>
      mockGetWorkoutProgress(courseId, workoutId, token),
  };
});

describe('GET /api/users/me/progress', () => {
  beforeAll(async () => {
    ({ GET } = await import('@/app/api/users/me/progress/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
  });

  it('возвращает 400, если courseId не передан', async () => {
    const response = await GET(new Request('http://localhost/api/users/me/progress'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Не указан courseId',
    });
    expect(mockGetCourseProgress).not.toHaveBeenCalled();
    expect(mockGetWorkoutProgress).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от нижележащего слоя', async () => {
    mockGetCourseProgress.mockRejectedValueOnce(new ApiError('Сессия истекла', 401));

    const response = await GET(
      new Request('http://localhost/api/users/me/progress?courseId=course-1'),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: 'Сессия истекла',
    });
  });

  it('возвращает null при временной недоступности внешнего API прогресса', async () => {
    mockGetCourseProgress.mockRejectedValueOnce(new ApiError('Внешний API недоступен', 503));

    const response = await GET(
      new Request('http://localhost/api/users/me/progress?courseId=course-1'),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toBeNull();
  });

  it('возвращает 500 для неожиданных ошибок', async () => {
    mockGetCourseProgress.mockRejectedValueOnce(new Error('Внутренняя ошибка'));

    const response = await GET(
      new Request('http://localhost/api/users/me/progress?courseId=course-1'),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Внутренняя ошибка',
    });
  });
});
