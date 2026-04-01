import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react';

import { ClientApiError } from '@/lib/client-api';
import type { User } from '@/types/user.types';

const mockGetCurrentUserClient = jest.fn<() => Promise<unknown>>();
const mockLoginUserClient =
  jest.fn<(payload: { email: string; password: string }) => Promise<unknown>>();
const mockLogoutUserClient = jest.fn<() => Promise<{ ok: true }>>();
const mockRegisterUserClient =
  jest.fn<(payload: { email: string; password: string }) => Promise<unknown>>();
let useAuthStore: typeof import('./auth.store').useAuthStore;

jest.mock('@/lib/client-auth-api', () => ({
  getCurrentUserClient: () => mockGetCurrentUserClient(),
  loginUserClient: (payload: { email: string; password: string }) => mockLoginUserClient(payload),
  logoutUserClient: () => mockLogoutUserClient(),
  registerUserClient: (payload: { email: string; password: string }) =>
    mockRegisterUserClient(payload),
}));

function resetAuthStore() {
  useAuthStore.setState({
    hasHydratedUser: false,
    isAuthorized: false,
    user: null,
    selectedCourses: [],
    isLoading: false,
    error: null,
    isAuthModalOpen: false,
    isUserMenuOpen: false,
  });
}

describe('auth.store', () => {
  beforeAll(async () => {
    ({ useAuthStore } = await import('./auth.store'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    document.cookie = 'fitness-auth-hint=; path=/; max-age=0; samesite=lax';
    resetAuthStore();
    mockLogoutUserClient.mockResolvedValue({ ok: true });
  });

  it('не запрашивает /api/auth/me без сохраненной сессии и cookie hint', async () => {
    await act(async () => {
      await useAuthStore.getState().hydrateUser();
    });

    expect(mockGetCurrentUserClient).not.toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({
      hasHydratedUser: true,
      isAuthorized: false,
      user: null,
      selectedCourses: [],
      isLoading: false,
      error: null,
    });
  });

  it('очищает состояние и localStorage при hydrateUser с 401', async () => {
    window.localStorage.setItem(
      'fitness-auth-user',
      JSON.stringify({ email: 'stored@example.com', name: 'Stored' }),
    );
    window.localStorage.setItem('fitness-selected-courses', JSON.stringify(['course-1']));
    document.cookie = 'fitness-auth-hint=1; path=/; samesite=lax';
    mockGetCurrentUserClient.mockRejectedValueOnce(new ClientApiError('Сессия истекла', 401));

    await act(async () => {
      await useAuthStore.getState().hydrateUser();
    });

    expect(useAuthStore.getState()).toMatchObject({
      isAuthorized: false,
      user: null,
      selectedCourses: [],
      isLoading: false,
      error: null,
    });
    expect(window.localStorage.getItem('fitness-auth-user')).toBeNull();
    expect(window.localStorage.getItem('fitness-selected-courses')).toBeNull();
  });

  it('сохраняет пользователя и выбранные курсы после успешного login', async () => {
    useAuthStore.setState({
      isAuthModalOpen: true,
      isUserMenuOpen: true,
    });
    mockLoginUserClient.mockResolvedValueOnce({
      user: {
        email: ' user@example.com ',
        name: '   ',
      },
      selectedCourses: ['course-1', 'course-2'],
    });

    await act(async () => {
      await useAuthStore.getState().login({
        email: 'user@example.com',
        password: 'password',
      });
    });

    expect(useAuthStore.getState()).toMatchObject({
      isAuthorized: true,
      user: {
        email: 'user@example.com',
        name: 'user',
      } satisfies User,
      selectedCourses: ['course-1', 'course-2'],
      isLoading: false,
      error: null,
      isAuthModalOpen: false,
      isUserMenuOpen: false,
    });
    expect(window.localStorage.getItem('fitness-auth-user')).toBe(
      JSON.stringify({
        email: 'user@example.com',
        name: 'user',
      }),
    );
    expect(window.localStorage.getItem('fitness-selected-courses')).toBe(
      JSON.stringify(['course-1', 'course-2']),
    );
    expect(document.cookie).toContain('fitness-auth-hint=1');
  });

  it('сбрасывает данные и сохраняет ошибку после неудачного login', async () => {
    window.localStorage.setItem(
      'fitness-auth-user',
      JSON.stringify({ email: 'stored@example.com', name: 'Stored' }),
    );
    window.localStorage.setItem('fitness-selected-courses', JSON.stringify(['course-1']));
    useAuthStore.setState({
      isAuthorized: true,
      user: {
        email: 'stored@example.com',
        name: 'Stored',
      },
      selectedCourses: ['course-1'],
    });
    mockLoginUserClient.mockRejectedValueOnce(new Error('Неверный логин или пароль'));

    let thrownError: unknown;

    await act(async () => {
      try {
        await useAuthStore.getState().login({
          email: 'user@example.com',
          password: 'wrong-password',
        });
      } catch (error) {
        thrownError = error;
      }
    });

    expect(thrownError).toBeInstanceOf(Error);
    expect(useAuthStore.getState()).toMatchObject({
      isAuthorized: false,
      user: null,
      selectedCourses: [],
      isLoading: false,
      error: 'Неверный логин или пароль',
    });
    expect(window.localStorage.getItem('fitness-auth-user')).toBeNull();
    expect(window.localStorage.getItem('fitness-selected-courses')).toBeNull();
  });

  it('очищает локальное состояние даже если logout API завершается ошибкой', async () => {
    window.localStorage.setItem(
      'fitness-auth-user',
      JSON.stringify({ email: 'stored@example.com', name: 'Stored' }),
    );
    window.localStorage.setItem('fitness-selected-courses', JSON.stringify(['course-1']));
    useAuthStore.setState({
      hasHydratedUser: true,
      isAuthorized: true,
      user: {
        email: 'stored@example.com',
        name: 'Stored',
      },
      selectedCourses: ['course-1'],
      isAuthModalOpen: true,
      isUserMenuOpen: true,
    });
    mockLogoutUserClient.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await expect(useAuthStore.getState().logout()).resolves.toBeUndefined();
    });

    expect(useAuthStore.getState()).toMatchObject({
      hasHydratedUser: true,
      isAuthorized: false,
      user: null,
      selectedCourses: [],
      isLoading: false,
      error: null,
      isAuthModalOpen: false,
      isUserMenuOpen: false,
    });
    expect(window.localStorage.getItem('fitness-auth-user')).toBeNull();
    expect(window.localStorage.getItem('fitness-selected-courses')).toBeNull();
    expect(document.cookie).not.toContain('fitness-auth-hint=1');
  });
});
