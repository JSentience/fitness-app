export type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getApiErrorMessage(data: unknown): string | null {
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

export async function parseApiResponse<T>(response: Response): Promise<{
  rawText: string;
  data: T | ApiErrorResponse | null;
}> {
  const rawText = await response.text();

  if (!rawText) {
    return {
      rawText,
      data: null,
    };
  }

  try {
    return {
      rawText,
      data: JSON.parse(rawText) as T | ApiErrorResponse,
    };
  } catch {
    return {
      rawText,
      data: null,
    };
  }
}

export function buildApiError(
  response: Response,
  data: unknown,
  fallbackMessage: string,
): ApiError {
  return new ApiError(
    getApiErrorMessage(data) || fallbackMessage,
    response.status,
  );
}

export function requireApiData<T>(
  response: Response,
  data: T | ApiErrorResponse | null,
  emptyMessage: string,
): T {
  if (data === null) {
    throw new ApiError(emptyMessage, response.status);
  }

  return data as T;
}
