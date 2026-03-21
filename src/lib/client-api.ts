type ApiErrorResponse = {
  message?: string;
  error?: string;
};

function getApiErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  if ("message" in data && typeof data.message === "string") {
    return data.message;
  }
  if ("error" in data && typeof data.error === "string") {
    return data.error;
  }
  return null;
}

export class ClientApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ClientApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function clientRequest<T>(
  endpoint: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    headers: {},
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
  });

  const rawText = await response.text();
  let data: T | ApiErrorResponse | null = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText) as T | ApiErrorResponse;
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    throw new ClientApiError(
      getApiErrorMessage(data) ||
        rawText ||
        `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}`,
      response.status,
    );
  }
  if (data === null) {
    throw new ClientApiError(
      `Пустой ответ от API для ${endpoint}`,
      response.status,
    );
  }
  return data as T;
}
