import { clientRequest } from '@/lib/client-api';
import { clientEndpoints } from '@/lib/client-endpoints';
import { User } from '@/types/user.types';

export type AuthUserResponse = {
  user: User;
  selectedCourses: string[];
};

export async function loginUserClient(payload: {
  email: string;
  password: string;
}): Promise<AuthUserResponse> {
  return clientRequest<AuthUserResponse>(clientEndpoints.authLogin, {
    method: 'POST',
    body: payload,
  });
}

export async function registerUserClient(payload: {
  email: string;
  password: string;
}): Promise<AuthUserResponse> {
  return clientRequest<AuthUserResponse>(clientEndpoints.authRegister, {
    method: 'POST',
    body: payload,
  });
}

export async function getCurrentUserClient(): Promise<AuthUserResponse> {
  return clientRequest<AuthUserResponse>(clientEndpoints.authMe);
}

export async function logoutUserClient(): Promise<{ ok: true }> {
  return clientRequest<{ ok: true }>(clientEndpoints.authLogout, {
    method: 'POST',
  });
}
