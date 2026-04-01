import { getCurrentUserServer } from '@/lib/auth-api';
import { toUser } from '@/lib/auth-user';
import {
  createUnauthorizedResponse,
  NO_STORE_CACHE_HEADER,
  requireAuthToken,
} from '@/lib/server-auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const me = await getCurrentUserServer(auth.token);

    return NextResponse.json(
      {
        user: toUser(me.email, me.name),
        selectedCourses: me.selectedCourses ?? [],
      },
      {
        headers: {
          'Cache-Control': NO_STORE_CACHE_HEADER,
        },
      },
    );
  } catch {
    return createUnauthorizedResponse();
  }
}
