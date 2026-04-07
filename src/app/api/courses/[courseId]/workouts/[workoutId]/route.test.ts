/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError } from '@/lib/workouts-api';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockSaveWorkoutProgress =
  jest.fn<
    (courseId: string, workoutId: string, progressData: number[], token: string) => Promise<void>
  >();
let PATCH: typeof import('@/app/api/courses/[courseId]/workouts/[workoutId]/route').PATCH;

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
    saveWorkoutProgress: (
      courseId: string,
      workoutId: string,
      progressData: number[],
      token: string,
    ) => mockSaveWorkoutProgress(courseId, workoutId, progressData, token),
  };
});

describe('PATCH /api/courses/[courseId]/workouts/[workoutId]', () => {
  beforeAll(async () => {
    ({ PATCH } = await import('@/app/api/courses/[courseId]/workouts/[workoutId]/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
  });

  it('возвращает 400, если workoutId пустой', async () => {
    const response = await PATCH(
      new Request('http://localhost/api/courses/course-1/workouts/%20', {
        method: 'PATCH',
        body: JSON.stringify({ progressData: [10, 20] }),
      }),
      {
        params: Promise.resolve({ courseId: 'course-1', workoutId: '   ' }),
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Не указан идентификатор тренировки',
    });
    expect(mockSaveWorkoutProgress).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от saveWorkoutProgress', async () => {
    mockSaveWorkoutProgress.mockRejectedValueOnce(new ApiError('Прогресс не сохранен', 422));

    const response = await PATCH(
      new Request('http://localhost/api/courses/course-1/workouts/workout-1', {
        method: 'PATCH',
        body: JSON.stringify({ progressData: [10, 20] }),
      }),
      {
        params: Promise.resolve({ courseId: 'course-1', workoutId: 'workout-1' }),
      },
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      message: 'Прогресс не сохранен',
    });
  });
});
