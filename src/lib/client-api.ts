import { getApiErrorMessage, parseApiResponse } from '@/lib/api-response';

export class ClientApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ClientApiError';
    this.status = status;
  }
}

type QueryValue = string | number | boolean | null | undefined;

type RequestOptions = {
  headers?: HeadersInit;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
};

function isJsonSerializableBody(body: unknown): body is Record<string, unknown> | unknown[] {
  return Array.isArray(body) || (typeof body === 'object' && body !== null);
}

function serializeClientRequestBody(body: unknown): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob
  ) {
    return body;
  }

  return JSON.stringify(body);
}

function createClientRequestHeaders(body: unknown, headers?: HeadersInit): Headers {
  const requestHeaders = new Headers(headers);

  if (isJsonSerializableBody(body) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  return requestHeaders;
}

export function encodeClientPathSegment(value: string): string {
  return encodeURIComponent(value);
}

export function buildClientApiPath(pathname: string, query?: Record<string, QueryValue>): string {
  if (!query) {
    return pathname;
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

async function performClientRequest<T>(
  endpoint: string,
  { method = 'GET', body, headers, query }: RequestOptions = {},
): Promise<{
  data: T | null;
  rawText: string;
  requestUrl: string;
  response: Response;
}> {
  const requestUrl = buildClientApiPath(endpoint, query);
  const response = await fetch(requestUrl, {
    method,
    headers: createClientRequestHeaders(body, headers),
    body: serializeClientRequestBody(body),
    credentials: 'same-origin',
  });
  const { rawText, data } = await parseApiResponse<T>(response);

  return {
    data: data as T | null,
    rawText,
    requestUrl,
    response,
  };
}

export async function clientRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, rawText, requestUrl, response } = await performClientRequest<T>(endpoint, options);

  if (!response.ok) {
    throw new ClientApiError(
      getApiErrorMessage(data) ||
        rawText ||
        `Ошибка запроса к ${requestUrl}: ${response.status} ${response.statusText}`,
      response.status,
    );
  }
  if (data === null) {
    throw new ClientApiError(`Пустой ответ от API для ${requestUrl}`, response.status);
  }
  return data as T;
}

export async function clientNullableRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T | null> {
  const { data, rawText, requestUrl, response } = await performClientRequest<T>(endpoint, options);

  if (!response.ok) {
    throw new ClientApiError(
      getApiErrorMessage(data) ||
        rawText ||
        `Ошибка запроса к ${requestUrl}: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return data;
}
