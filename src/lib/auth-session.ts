import {
  AUTH_SESSION_HINT_COOKIE_MAX_AGE,
  AUTH_SESSION_HINT_COOKIE_NAME,
  SELECTED_COURSES_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '@/lib/auth-session-keys';
import { toUser } from '@/lib/auth-user';
import type { User } from '@/types/user.types';

export type AuthSession = {
  user: User;
  selectedCourses: string[];
};

function normalizeSelectedCourses(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeUser(data: unknown): User | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const email = (data as { email?: unknown }).email;
  const name = (data as { name?: unknown }).name;

  if (typeof email !== 'string') {
    return null;
  }

  try {
    return toUser(email, typeof name === 'string' ? name : undefined);
  } catch {
    return null;
  }
}

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function getDocumentCookie() {
  if (typeof document === 'undefined') {
    return '';
  }

  return document.cookie;
}

export function hasAuthSessionHint(): boolean {
  return getDocumentCookie()
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${AUTH_SESSION_HINT_COOKIE_NAME}=`));
}

export function writeAuthSessionHint(enabled: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = enabled ? AUTH_SESSION_HINT_COOKIE_MAX_AGE : 0;
  const value = enabled ? '1' : '';

  document.cookie = `${AUTH_SESSION_HINT_COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function readStoredAuthUser(): User | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const rawUser = storage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(rawUser) as unknown);
  } catch {
    return null;
  }
}

export function readStoredSelectedCourses(): string[] {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  const rawSelectedCourses = storage.getItem(SELECTED_COURSES_STORAGE_KEY);

  if (!rawSelectedCourses) {
    return [];
  }

  try {
    return normalizeSelectedCourses(JSON.parse(rawSelectedCourses) as unknown);
  } catch {
    return [];
  }
}

export function writeStoredAuthUser(user: User | null) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (user) {
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  storage.removeItem(USER_STORAGE_KEY);
}

export function writeStoredSelectedCourses(selectedCourses: string[]) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  if (selectedCourses.length > 0) {
    storage.setItem(SELECTED_COURSES_STORAGE_KEY, JSON.stringify(selectedCourses));
    return;
  }

  storage.removeItem(SELECTED_COURSES_STORAGE_KEY);
}

export function clearStoredAuthSession() {
  writeStoredAuthUser(null);
  writeStoredSelectedCourses([]);
  writeAuthSessionHint(false);
}

export function persistAuthSession(session: AuthSession) {
  writeStoredAuthUser(session.user);
  writeStoredSelectedCourses(session.selectedCourses);
  writeAuthSessionHint(true);
}

export function resolveAuthSession(data: { user: unknown; selectedCourses: unknown }): AuthSession {
  const user = normalizeUser(data.user);

  if (!user) {
    throw new Error('Не удалось получить данные пользователя');
  }

  return {
    user,
    selectedCourses: normalizeSelectedCourses(data.selectedCourses),
  };
}
