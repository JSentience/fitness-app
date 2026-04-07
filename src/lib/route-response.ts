import { getErrorMessage, getErrorStatus } from '@/lib/error-utils';
import { NextResponse } from 'next/server';

export type RouteContext<TParams extends Record<string, string>> = {
  params: Promise<TParams>;
};

export function normalizeRouteParam(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

export function createRouteMessageResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export function createBadRequestResponse(message: string) {
  return createRouteMessageResponse(message, 400);
}

export function createRouteErrorResponse(
  error: unknown,
  fallbackMessage: string,
  fallbackStatus: number,
) {
  return NextResponse.json(
    {
      message: getErrorMessage(error, fallbackMessage),
    },
    {
      status: getErrorStatus(error, fallbackStatus),
    },
  );
}
