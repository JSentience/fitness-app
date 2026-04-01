import {
  ApiError,
  buildApiError,
  parseApiResponse,
  requireApiData,
  type ApiErrorResponse,
} from '@/lib/api-response';

export const FITNESS_API_BASE_URL =
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, '') ||
  'https://wedev-api.sky.pro/api/fitness';

type FitnessApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type FitnessApiRequestOptions = {
  allowEmpty?: boolean;
  body?: BodyInit | object;
  cache?: RequestCache;
  fallbackMessage?: string;
  headers?: HeadersInit;
  method?: FitnessApiMethod;
  timeoutMs?: number;
  token?: string;
};

type FitnessApiNullableRequestOptions = FitnessApiRequestOptions & {
  nullStatuses?: number[];
};

function createHeaders({
  headers,
  token,
}: Pick<FitnessApiRequestOptions, 'headers' | 'token'>): Headers {
  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  return requestHeaders;
}

function serializeBody(body: FitnessApiRequestOptions['body']): BodyInit | undefined {
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

  return Buffer.from(JSON.stringify(body));
}

async function performRequest<T>(
  endpoint: string,
  {
    body,
    cache,
    fallbackMessage,
    headers,
    method = 'GET',
    timeoutMs,
    token,
  }: FitnessApiRequestOptions = {},
): Promise<{
  data: T | ApiErrorResponse | null;
  response: Response;
}> {
  const requestHeaders = createHeaders({ headers, token });
  let response: Response;
  const controller = timeoutMs ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => {
        controller.abort();
      }, timeoutMs)
    : null;

  try {
    response = await fetch(`${FITNESS_API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: serializeBody(body),
      cache,
      signal: controller?.signal,
    });
  } catch {
    throw new ApiError(
      fallbackMessage || `Не удалось выполнить запрос к внешнему API для ${endpoint}`,
      503,
    );
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  const { data } = await parseApiResponse<T>(response);

  return {
    data,
    response,
  };
}

function getFallbackMessage(
  endpoint: string,
  response: Response,
  customFallbackMessage?: string,
): string {
  return (
    customFallbackMessage ||
    `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}`
  );
}

export async function fitnessApiRequest<T>(
  endpoint: string,
  options: FitnessApiRequestOptions = {},
): Promise<T> {
  const { allowEmpty = false, fallbackMessage } = options;
  const { data, response } = await performRequest<T>(endpoint, options);

  if (!response.ok) {
    throw buildApiError(response, data, getFallbackMessage(endpoint, response, fallbackMessage));
  }

  if (allowEmpty && data === null) {
    return undefined as T;
  }

  return requireApiData<T>(response, data, `Пустой ответ от API для ${endpoint}`);
}

export async function fitnessApiNullableRequest<T>(
  endpoint: string,
  options: FitnessApiNullableRequestOptions = {},
): Promise<T | null> {
  const { nullStatuses = [], fallbackMessage } = options;
  const { data, response } = await performRequest<T>(endpoint, options);

  if (nullStatuses.includes(response.status)) {
    return null;
  }

  if (!response.ok) {
    throw buildApiError(response, data, getFallbackMessage(endpoint, response, fallbackMessage));
  }

  if (data === null) {
    return null;
  }

  return data as T;
}
