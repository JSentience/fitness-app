import { User } from "@/types/user.types";

export function normalizeUserName(email: string, name?: string): string {
  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  const [namePart] = email.split("@");
  return namePart?.trim() || "Пользователь";
}

export function toUser(email: string | undefined, name?: string): User {
  const normalizedEmail = email?.trim() ?? "";

  if (!normalizedEmail) {
    throw new Error("Не удалось получить email пользователя");
  }

  return {
    email: normalizedEmail,
    name: normalizeUserName(normalizedEmail, name),
  };
}
