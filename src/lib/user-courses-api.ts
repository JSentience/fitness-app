const API_BASE_URL =
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, "") ||
  "https://wedev-api.sky.pro/api/fitness";

export type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export type CourseMutationResponse = {
  message: string;
};

type RequestOptions = {
  method: "POST" | "DELETE";
  token: string;
  body?: unknown;
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

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  { method, token, body }: RequestOptions,
): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
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
    const message = getApiErrorMessage(data);

    const bodyDescription = body ? JSON.stringify(body) : "without body";

    throw new ApiError(
      message ||
        `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}. Payload: ${bodyDescription}`,
      response.status,
    );
  }

  if (data === null) {
    throw new ApiError(`Пустой ответ от API для ${endpoint}`, response.status);
  }

  return data as T;
}

export async function addUserCourse(
  courseId: string,
  token: string,
): Promise<CourseMutationResponse> {
  return request<CourseMutationResponse>("/users/me/courses", {
    method: "POST",
    token,
    body: { courseId },
  });
}

export async function removeUserCourse(
  courseId: string,
  token: string,
): Promise<CourseMutationResponse> {
  return request<CourseMutationResponse>(`/users/me/courses/${courseId}`, {
    method: "DELETE",
    token,
  });
}

export { API_BASE_URL };
