/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockGetAuthTokenFromCookies = jest.fn<() => Promise<string | null>>();
const mockGetCurrentUserServer =
  jest.fn<
    (token: string) => Promise<{ email: string; name?: string; selectedCourses?: string[] }>
  >();
let GET: typeof import('@/app/api/auth/me/route').GET;

jest.mock('@/lib/server-auth', () => {
  const actual = jest.requireActual('@/lib/server-auth') as typeof import('@/lib/server-auth');

  return {
    ...actual,
    getAuthTokenFromCookies: () => mockGetAuthTokenFromCookies(),
    requireAuthToken: async () => {
      const token = await mockGetAuthTokenFromCookies();

      if (!token) {
        return {
          response: (
            jest.requireActual('next/server') as typeof import('next/server')
          ).NextResponse.json(
            { message: 'Требуется авторизация' },
            {
              status: 401,
              headers: {
                'Cache-Control': actual.NO_STORE_CACHE_HEADER,
              },
            },
          ),
        };
      }

      return { token };
    },
  };
});

jest.mock('@/lib/auth-api', () => ({
  getCurrentUserServer: (token: string) => mockGetCurrentUserServer(token),
}));

describe('GET /api/auth/me', () => {
  beforeAll(async () => {
    ({ GET } = await import('@/app/api/auth/me/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthTokenFromCookies.mockResolvedValue('token');
  });

  it('возвращает 401, если токен отсутствует', async () => {
    mockGetAuthTokenFromCookies.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: 'Требуется авторизация',
    });
  });

  it('возвращает пользователя и no-store cache header', async () => {
    mockGetCurrentUserServer.mockResolvedValueOnce({
      email: 'user@example.com',
      name: 'User',
      selectedCourses: ['course-1'],
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
    await expect(response.json()).resolves.toEqual({
      user: {
        email: 'user@example.com',
        name: 'User',
      },
      selectedCourses: ['course-1'],
    });
  });

  it('возвращает 401, если нижележащий слой упал', async () => {
    mockGetCurrentUserServer.mockRejectedValueOnce(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: 'Требуется авторизация',
    });
  });
});
