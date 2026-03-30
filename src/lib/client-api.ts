import { getApiErrorMessage, parseApiResponse } from '@/lib/api-response';

export class ClientApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ClientApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export async function clientRequest<T>(
  endpoint: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    headers: {},
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });
  const { rawText, data } = await parseApiResponse<T>(response);
  if (!response.ok) {
    throw new ClientApiError(
      getApiErrorMessage(data) ||
        rawText ||
        `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}`,
      response.status,
    );
  }
  if (data === null) {
    throw new ClientApiError(`Пустой ответ от API для ${endpoint}`, response.status);
  }
  return data as T;
}
