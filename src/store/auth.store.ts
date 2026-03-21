import {
  getCurrentUserClient,
  loginUserClient,
  logoutUserClient,
  registerUserClient,
} from "@/lib/client-auth-api";
import { ClientApiError } from "@/lib/client-api";
import type { User } from "@/types/user.types";
import { create } from "zustand";

type AuthStore = {
  isAuthorized: boolean;
  user: User | null;
  selectedCourses: string[];
  isLoading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  isUserMenuOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  closeUserMenu: () => void;
  toggleUserMenu: () => void;
  clearError: () => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string }) => Promise<void>;
  hydrateUser: () => Promise<void>;
  logout: () => Promise<void>;
  setSelectedCourses: (selectedCourses: string[]) => void;
};

const USER_STORAGE_KEY = "fitness-auth-user";
const SELECTED_COURSES_STORAGE_KEY = "fitness-selected-courses";

function normalizeUserEmail(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
}

function normalizeUserName(email: string, value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (!email) {
    return "Пользователь";
  }

  const [namePart] = email.split("@");
  return namePart?.trim() || "Пользователь";
}

function normalizeSelectedCourses(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeUser(data: unknown): User | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const email = normalizeUserEmail((data as { email?: unknown }).email);

  if (!email) {
    return null;
  }

  return {
    email,
    name: normalizeUserName(email, (data as { name?: unknown }).name),
  };
}

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(rawUser) as unknown);
  } catch {
    return null;
  }
};

const getStoredSelectedCourses = (): string[] => {
  if (typeof window === "undefined") return [];

  const rawSelectedCourses = window.localStorage.getItem(
    SELECTED_COURSES_STORAGE_KEY,
  );

  if (!rawSelectedCourses) {
    return [];
  }

  try {
    return normalizeSelectedCourses(JSON.parse(rawSelectedCourses) as unknown);
  } catch {
    return [];
  }
};

const setStoredUser = (user: User | null) => {
  if (typeof window === "undefined") return;

  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
};

const setStoredSelectedCourses = (selectedCourses: string[]) => {
  if (typeof window === "undefined") return;

  if (selectedCourses.length > 0) {
    window.localStorage.setItem(
      SELECTED_COURSES_STORAGE_KEY,
      JSON.stringify(selectedCourses),
    );
    return;
  }

  window.localStorage.removeItem(SELECTED_COURSES_STORAGE_KEY);
};

const clearStoredAuthData = () => {
  setStoredUser(null);
  setStoredSelectedCourses([]);
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthorized: false,
  user: null,
  selectedCourses: [],
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
  isUserMenuOpen: false,

  hydrateUser: async () => {
    const state = get();
    const storedUser = state.user ?? getStoredUser();
    const storedSelectedCourses =
      state.selectedCourses.length > 0
        ? state.selectedCourses
        : getStoredSelectedCourses();

    if (state.isLoading) {
      return;
    }

    set({
      isLoading: true,
      error: null,
      user: storedUser,
      selectedCourses: storedSelectedCourses,
      isAuthorized: Boolean(storedUser),
    });

    try {
      const response = await getCurrentUserClient();
      const user = normalizeUser(response.user);
      const selectedCourses = normalizeSelectedCourses(
        response.selectedCourses,
      );

      if (!user) {
        throw new Error("Не удалось получить данные пользователя");
      }

      setStoredUser(user);
      setStoredSelectedCourses(selectedCourses);

      set({
        isAuthorized: true,
        user,
        selectedCourses,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      if (error instanceof ClientApiError && error.status === 401) {
        clearStoredAuthData();
        set({
          isAuthorized: false,
          user: null,
          selectedCourses: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      set({
        isAuthorized: Boolean(storedUser),
        user: storedUser,
        selectedCourses: storedSelectedCourses,
        isLoading: false,
        error: null,
      });
    }
  },

  openAuthModal: () =>
    set({
      isAuthModalOpen: true,
      isUserMenuOpen: false,
      error: null,
    }),

  closeAuthModal: () =>
    set({
      isAuthModalOpen: false,
      error: null,
    }),

  closeUserMenu: () =>
    set({
      isUserMenuOpen: false,
    }),

  toggleUserMenu: () =>
    set((state) => ({
      isUserMenuOpen: state.isAuthorized ? !state.isUserMenuOpen : false,
      isAuthModalOpen: false,
    })),

  clearError: () =>
    set({
      error: null,
    }),

  login: async ({ email, password }) => {
    set({
      isLoading: true,
      error: null,
      isUserMenuOpen: false,
    });

    try {
      const response = await loginUserClient({ email, password });
      const user = normalizeUser(response.user);
      const selectedCourses = normalizeSelectedCourses(
        response.selectedCourses,
      );

      if (!user) {
        throw new Error("Не удалось получить данные пользователя");
      }

      setStoredUser(user);
      setStoredSelectedCourses(selectedCourses);

      set({
        isAuthorized: true,
        user,
        selectedCourses,
        isLoading: false,
        error: null,
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    } catch (error) {
      clearStoredAuthData();
      set({
        isAuthorized: false,
        user: null,
        selectedCourses: [],
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Не удалось выполнить вход",
      });
      throw error;
    }
  },

  register: async ({ email, password }) => {
    set({
      isLoading: true,
      error: null,
      isUserMenuOpen: false,
    });

    try {
      const response = await registerUserClient({ email, password });
      const user = normalizeUser(response.user);
      const selectedCourses = normalizeSelectedCourses(
        response.selectedCourses,
      );

      if (!user) {
        throw new Error("Не удалось получить данные пользователя");
      }

      setStoredUser(user);
      setStoredSelectedCourses(selectedCourses);

      set({
        isAuthorized: true,
        user,
        selectedCourses,
        isLoading: false,
        error: null,
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    } catch (error) {
      clearStoredAuthData();
      set({
        isAuthorized: false,
        user: null,
        selectedCourses: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Не удалось выполнить регистрацию",
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutUserClient();
    } finally {
      clearStoredAuthData();
      set({
        isAuthorized: false,
        user: null,
        selectedCourses: [],
        isLoading: false,
        error: null,
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    }
  },

  setSelectedCourses: (selectedCourses) => {
    setStoredSelectedCourses(selectedCourses);
    set({ selectedCourses });
  },
}));
