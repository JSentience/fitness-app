import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const AUTH_COOKIE_NAME = 'fitness-auth-token';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
export const NO_STORE_CACHE_HEADER = 'no-store, no-cache, must-revalidate';

type AuthTokenResult = { token: string } | { response: NextResponse };

export async function getAuthTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export function createUnauthorizedResponse() {
  return NextResponse.json(
    { message: 'Требуется авторизация' },
    {
      status: 401,
      headers: {
        'Cache-Control': NO_STORE_CACHE_HEADER,
      },
    },
  );
}

export async function requireAuthToken(): Promise<AuthTokenResult> {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return {
      response: createUnauthorizedResponse(),
    };
  }

  return {
    token,
  };
}
