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

export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type MeResponse = {
  email: string;
  name?: string;
  selectedCourses: string[];
};

type RawMeResponse = {
  email?: string;
  name?: string;
  selectedCourses?: unknown;
  user?: {
    email?: string;
    name?: string;
    selectedCourses?: unknown;
  };
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  cache?: RequestCache;
};

async function request<T>(
  endpoint: string,
  { method = 'GET', body, token, cache }: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });
  const { data } = await parseApiResponse<T>(response);

  if (!response.ok) {
    throw buildApiError(
      response,
      data,
      `Ошибка запроса к ${endpoint}: ${response.status} ${response.statusText}`,
    );
  }

  return requireApiData<T>(response, data, `Пустой ответ от API для ${endpoint}`);
}

function normalizeSelectedCourses(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeMeResponse(data: RawMeResponse): MeResponse {
  const user = data.user && typeof data.user === 'object' ? data.user : data;
  const email = typeof user.email === 'string' ? user.email.trim() : '';

  if (!email) {
    throw new ApiError('Не удалось получить email пользователя', 500);
  }

  const name = typeof user.name === 'string' ? user.name.trim() : undefined;

  return {
    email,
    name,
    selectedCourses: normalizeSelectedCourses(user.selectedCourses),
  };
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function getCurrentUser(token: string): Promise<MeResponse> {
  const response = await request<RawMeResponse>('/users/me', {
    method: 'GET',
    token,
  });

  return normalizeMeResponse(response);
}

export async function getCurrentUserServer(token: string): Promise<MeResponse> {
  const response = await request<RawMeResponse>('/users/me', {
    method: 'GET',
    token,
    cache: 'no-store',
  });

  return normalizeMeResponse(response);
}

export { API_BASE_URL, ApiError };
export type { ApiErrorResponse };
