/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError, type Workout } from '@/lib/workouts-api';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockGetCourseWorkouts = jest.fn<(courseId: string, token: string) => Promise<Workout[]>>();
let GET: typeof import('@/app/api/courses/[courseId]/workouts/route').GET;

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
    getCourseWorkouts: (courseId: string, token: string) => mockGetCourseWorkouts(courseId, token),
  };
});

describe('GET /api/courses/[courseId]/workouts', () => {
  beforeAll(async () => {
    ({ GET } = await import('@/app/api/courses/[courseId]/workouts/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
  });

  it('возвращает 400, если courseId пустой', async () => {
    const response = await GET(new Request('http://localhost/api/courses/%20/workouts'), {
      params: Promise.resolve({ courseId: '   ' }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Не указан идентификатор курса',
    });
    expect(mockGetCourseWorkouts).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от getCourseWorkouts', async () => {
    mockGetCourseWorkouts.mockRejectedValueOnce(new ApiError('Курс не найден', 404));

    const response = await GET(new Request('http://localhost/api/courses/course-1/workouts'), {
      params: Promise.resolve({ courseId: 'course-1' }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Курс не найден',
    });
  });
});
