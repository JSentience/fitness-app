/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError, type Workout } from '@/lib/workouts-api';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockGetWorkoutById = jest.fn<(workoutId: string, token: string) => Promise<Workout>>();
let GET: typeof import('@/app/api/workouts/[workoutId]/route').GET;

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
    getWorkoutById: (workoutId: string, token: string) => mockGetWorkoutById(workoutId, token),
  };
});

describe('GET /api/workouts/[workoutId]', () => {
  beforeAll(async () => {
    ({ GET } = await import('@/app/api/workouts/[workoutId]/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
  });

  it('возвращает 400, если workoutId пустой', async () => {
    const response = await GET(new Request('http://localhost/api/workouts/%20'), {
      params: Promise.resolve({ workoutId: '   ' }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Не указан идентификатор тренировки',
    });
    expect(mockGetWorkoutById).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от getWorkoutById', async () => {
    mockGetWorkoutById.mockRejectedValueOnce(new ApiError('Тренировка не найдена', 404));

    const response = await GET(new Request('http://localhost/api/workouts/workout-1'), {
      params: Promise.resolve({ workoutId: 'workout-1' }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Тренировка не найдена',
    });
  });
});
