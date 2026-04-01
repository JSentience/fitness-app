import { getCurrentUserServer } from '@/lib/auth-api';
import {
  AUTH_SESSION_HINT_COOKIE_MAX_AGE,
  AUTH_SESSION_HINT_COOKIE_NAME,
} from '@/lib/auth-session-keys';
import { toUser } from '@/lib/auth-user';
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME, NO_STORE_CACHE_HEADER } from '@/lib/server-auth';
import { NextResponse } from 'next/server';

export type AuthCredentials = {
  email: string;
  password: string;
};

export async function parseAuthCredentialsRequest(request: Request): Promise<AuthCredentials> {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  return {
    email: body.email?.trim() ?? '',
    password: body.password ?? '',
  };
}

export async function createAuthSuccessResponse(token: string, fallbackEmail?: string) {
  const me = await getCurrentUserServer(token);
  const email = me.email?.trim() || fallbackEmail?.trim();

  const response = NextResponse.json({
    user: toUser(email, me.name),
    selectedCourses: me.selectedCourses ?? [],
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
  response.cookies.set(AUTH_SESSION_HINT_COOKIE_NAME, '1', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_SESSION_HINT_COOKIE_MAX_AGE,
  });
  response.headers.set('Cache-Control', NO_STORE_CACHE_HEADER);

  return response;
}

export function createLogoutResponse() {
  const response = NextResponse.json({ ok: true as const });

  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  response.cookies.set(AUTH_SESSION_HINT_COOKIE_NAME, '', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  response.headers.set('Cache-Control', NO_STORE_CACHE_HEADER);

  return response;
}
