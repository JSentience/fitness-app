/** @jest-environment node */

import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ApiError } from '@/lib/auth-api';

const mockRegisterUser =
  jest.fn<(payload: { email: string; password: string }) => Promise<{ message: string }>>();
const mockLoginUser =
  jest.fn<(payload: { email: string; password: string }) => Promise<{ token: string }>>();
const mockCreateAuthSuccessResponse =
  jest.fn<(token: string, fallbackEmail?: string) => Promise<Response>>();
let POST: typeof import('@/app/api/auth/register/route').POST;

jest.mock('@/lib/auth-api', () => {
  const actual = jest.requireActual('@/lib/auth-api') as typeof import('@/lib/auth-api');

  return {
    ...actual,
    registerUser: (payload: { email: string; password: string }) => mockRegisterUser(payload),
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

describe('POST /api/auth/register', () => {
  beforeAll(async () => {
    ({ POST } = await import('@/app/api/auth/register/route'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterUser.mockResolvedValue({ message: 'ok' });
    mockLoginUser.mockResolvedValue({ token: 'token-123' });
    mockCreateAuthSuccessResponse.mockResolvedValue(
      Response.json({
        user: { email: 'user@example.com', name: 'User' },
        selectedCourses: [],
      }),
    );
  });

  it('возвращает 400, если email или password не переданы', async () => {
    const response = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: '', password: '' }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Введите email и пароль',
    });
    expect(mockRegisterUser).not.toHaveBeenCalled();
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('сохраняет статус ApiError от registerUser', async () => {
    mockRegisterUser.mockRejectedValueOnce(new ApiError('Пользователь уже существует', 409));

    const response = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', password: 'secret' }),
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: 'Пользователь уже существует',
    });
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('выполняет login после register и передает token в auth success helper', async () => {
    const response = await POST(
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: ' user@example.com ', password: 'secret' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret',
    });
    expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret',
    });
    expect(mockCreateAuthSuccessResponse).toHaveBeenCalledWith('token-123', 'user@example.com');
  });
});
