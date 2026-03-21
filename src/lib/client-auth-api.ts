import { User } from "@/types/user.types";
import { clientRequest } from "./client-api";

export type AuthUserResponse = {
  user: User;
  selectedCourses: string[];
};

export async function loginUserClient(payload: {
  email: string;
  password: string;
}): Promise<AuthUserResponse> {
  return clientRequest<AuthUserResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function registerUserClient(payload: {
  email: string;
  password: string;
}): Promise<AuthUserResponse> {
  return clientRequest<AuthUserResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getCurrentUserClient(): Promise<AuthUserResponse> {
  return clientRequest<AuthUserResponse>("/api/auth/me");
}

export async function logoutUserClient(): Promise<{ ok: true }> {
  return clientRequest<{ ok: true }>("/api/auth/logout", {
    method: "POST",
  });
}
