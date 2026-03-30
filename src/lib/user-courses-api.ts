import {
  ApiError,
  buildApiError,
  parseApiResponse,
  requireApiData,
  type ApiErrorResponse,
} from '@/lib/api-response';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FITNESS_API_URL?.replace(/\/$/, '') ||
  'https://wedev-api.sky.pro/api/fitness';

export type CourseMutationResponse = {
  message: string;
};

type RequestOptions = {
  method: 'POST' | 'DELETE';
  token: string;
  body?: unknown;
};

async function request<T>(endpoint: string, { method, token, body }: RequestOptions): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const { data } = await parseApiResponse<T>(response);

  if (!response.ok) {
    const bodyDescription = body ? JSON.stringify(body) : 'without body';

    throw buildApiError(
      response,
      data,
      `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}. Payload: ${bodyDescription}`,
    );
  }

  return requireApiData<T>(response, data, `Пустой ответ от API для ${endpoint}`);
}

export async function addUserCourse(
  courseId: string,
  token: string,
): Promise<CourseMutationResponse> {
  return request<CourseMutationResponse>('/users/me/courses', {
    method: 'POST',
    token,
    body: { courseId },
  });
}

export async function removeUserCourse(
  courseId: string,
  token: string,
): Promise<CourseMutationResponse> {
  return request<CourseMutationResponse>(`/users/me/courses/${courseId}`, {
    method: 'DELETE',
    token,
  });
}

export { API_BASE_URL, ApiError };
export type { ApiErrorResponse };
