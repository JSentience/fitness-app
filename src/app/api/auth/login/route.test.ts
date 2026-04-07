/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError } from '@/lib/auth-api';

const mockLoginUser =
  jest.fn<(payload: { email: string; password: string }) => Promise<{ token: string }>>();
const mockCreateAuthSuccessResponse =
  jest.fn<(token: string, fallbackEmail?: string) => Promise<Response>>();
let POST: typeof import('@/app/api/auth/login/route').POST;

jest.mock('@/lib/auth-api', () => {
  const actual = jest.requireActual('@/lib/auth-api') as typeof import('@/lib/auth-api');

  return {
    ...actual,
    loginUser: (payload: { email: string; password: string }) => mockLoginUser(payload),
  };
});

jest.mock('@/lib/auth-route', () => {
  const actual = jest.requireActual('@/lib/auth-route') as typeof import('@/lib/auth-route');

  return {
    ...actual,
    createAuthSuccessResponse: (token: string, fallbackEmail?: string) =>
      mockCreateAuthSuccessResponse(token, fallbackEmail),
  };
});

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    ({ POST } = await import('@/app/api/auth/login/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAuthSuccessResponse.mockResolvedValue(
      Response.json({
        user: { email: 'user@example.com', name: 'User' },
        selectedCourses: [],
      }),
    );
  });

  it('возвращает 400, если email или password не переданы', async () => {
    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: '   ', password: '' }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Введите email и пароль',
    });
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от loginUser', async () => {
    mockLoginUser.mockRejectedValueOnce(new ApiError('Неверный пароль', 401));

    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', password: 'secret' }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: 'Неверный пароль',
    });
  });

  it('передает token и email в auth success helper', async () => {
    mockLoginUser.mockResolvedValueOnce({ token: 'token-123' });

    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: ' user@example.com ', password: 'secret' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mockCreateAuthSuccessResponse).toHaveBeenCalledWith('token-123', 'user@example.com');
  });
});
