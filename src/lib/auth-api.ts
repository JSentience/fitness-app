import { ApiError, type ApiErrorResponse } from '@/lib/api-response';
import { FITNESS_API_BASE_URL, fitnessApiRequest } from '@/lib/fitness-api';

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
  return fitnessApiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return fitnessApiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function getCurrentUser(token: string): Promise<MeResponse> {
  const response = await fitnessApiRequest<RawMeResponse>('/users/me', {
    token,
  });

  return normalizeMeResponse(response);
}

export async function getCurrentUserServer(token: string): Promise<MeResponse> {
  const response = await fitnessApiRequest<RawMeResponse>('/users/me', {
    token,
    cache: 'no-store',
  });

  return normalizeMeResponse(response);
}

export { FITNESS_API_BASE_URL as API_BASE_URL, ApiError };
export type { ApiErrorResponse };
