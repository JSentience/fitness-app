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
let GET: typeof import('./route').GET;

jest.mock('@/lib/server-auth', () => ({
  createUnauthorizedResponse: () =>
    (jest.requireActual('next/server') as typeof import('next/server')).NextResponse.json(
      { message: 'Требуется авторизация' },
      { status: 401 },
    ),
  getAuthTokenFromCookies: () => mockGetAuthTokenFromCookies(),
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
    ({ GET } = await import('./route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
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
