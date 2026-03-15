import { getCurrentUser, loginUser, registerUser } from "@/lib/auth-api";
import type { User } from "@/types/user.type";
import { create } from "zustand";

type AuthStore = {
  isAuthorized: boolean;
  user: User | null;
  selectedCourses: string[];
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  isUserMenuOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toggleAuthModal: () => void;
  openUserMenu: () => void;
  closeUserMenu: () => void;
  toggleUserMenu: () => void;
  clearError: () => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { email: string; password: string }) => Promise<void>;
  hydrateUser: () => Promise<void>;
  logout: () => void;
  setAuthorized: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setSelectedCourses: (selectedCourses: string[]) => void;
};

const STORAGE_KEY = "fitness-auth-token";
const USER_STORAGE_KEY = "fitness-auth-user";
const SELECTED_COURSES_STORAGE_KEY = "fitness-selected-courses";
const COOKIE_KEY = "fitness-auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as unknown;
    return normalizeUser(parsedUser);
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
    const parsedSelectedCourses = JSON.parse(rawSelectedCourses) as unknown;
    return normalizeSelectedCourses(parsedSelectedCourses);
  } catch {
    return [];
  }
};

const setTokenCookie = (token: string | null) => {
  if (typeof document === "undefined") return;

  if (token) {
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(
      token,
    )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    return;
  }

  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
};

const setStoredToken = (token: string | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(STORAGE_KEY, token);
    setTokenCookie(token);
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  setTokenCookie(null);
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

function normalizeUserEmail(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
}

function normalizeSelectedCourses(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeUserName(email: string): string {
  if (!email) {
    return "Пользователь";
  }

  const [namePart] = email.split("@");
  return namePart?.trim() || "Пользователь";
}

function createFallbackUser(email: string): User | null {
  const normalizedEmail = normalizeUserEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  return {
    name: normalizeUserName(normalizedEmail),
    email: normalizedEmail,
  };
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
    name: normalizeUserName(email),
    email,
  };
}

async function resolveUserWithFallback(
  token: string,
  fallbackEmail: string,
): Promise<{ user: User; selectedCourses: string[] }> {
  try {
    const me = await getCurrentUser(token);
    const user = normalizeUser(me);

    if (user) {
      return {
        user,
        selectedCourses: normalizeSelectedCourses(
          (me as { selectedCourses?: unknown }).selectedCourses,
        ),
      };
    }
  } catch {
    // ignore and fallback to submitted email
  }

  const fallbackUser = createFallbackUser(fallbackEmail);

  if (fallbackUser) {
    return {
      user: fallbackUser,
      selectedCourses: [],
    };
  }

  throw new Error("Не удалось получить данные пользователя");
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthorized: false,
  user: null,
  selectedCourses: [],
  token: null,
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
  isUserMenuOpen: false,

  hydrateUser: async () => {
    const state = get();
    const existingToken = state.token ?? getStoredToken();
    const storedUser = state.user ?? getStoredUser();
    const storedSelectedCourses =
      state.selectedCourses.length > 0
        ? state.selectedCourses
        : getStoredSelectedCourses();

    if (!existingToken) {
      if (
        state.isAuthorized ||
        state.user ||
        state.selectedCourses.length > 0
      ) {
        setStoredUser(null);
        setStoredSelectedCourses([]);
        set({
          token: null,
          user: null,
          selectedCourses: [],
          isAuthorized: false,
          isLoading: false,
        });
      }
      return;
    }

    if (state.isLoading && state.token === existingToken) {
      return;
    }

    set({
      isLoading: true,
      error: null,
      token: existingToken,
      user: storedUser,
      selectedCourses: storedSelectedCourses,
      isAuthorized: Boolean(storedUser),
    });

    try {
      const me = await getCurrentUser(existingToken);
      const user = normalizeUser(me);

      if (!user) {
        throw new Error("Не удалось получить данные пользователя");
      }

      const normalizedSelectedCourses = normalizeSelectedCourses(
        (me as { selectedCourses?: unknown }).selectedCourses,
      );

      setStoredUser(user);
      setStoredSelectedCourses(normalizedSelectedCourses);

      set({
        token: existingToken,
        user,
        selectedCourses: normalizedSelectedCourses,
        isAuthorized: true,
        isLoading: false,
        error: null,
      });
    } catch {
      const latestToken = get().token ?? getStoredToken();

      if (latestToken !== existingToken) {
        return;
      }

      set({
        token: existingToken,
        user: storedUser,
        selectedCourses: storedSelectedCourses,
        isAuthorized: Boolean(storedUser),
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

  toggleAuthModal: () =>
    set((state) => ({
      isAuthModalOpen: !state.isAuthModalOpen,
      isUserMenuOpen: !state.isAuthModalOpen ? false : state.isUserMenuOpen,
      error: null,
    })),

  openUserMenu: () =>
    set((state) => ({
      isUserMenuOpen: state.isAuthorized,
      isAuthModalOpen: false,
    })),

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
      const { token } = await loginUser({ email, password });
      setStoredToken(token);

      const { user, selectedCourses } = await resolveUserWithFallback(
        token,
        email,
      );

      setStoredUser(user);
      setStoredSelectedCourses(selectedCourses);

      set({
        token,
        user,
        selectedCourses,
        isAuthorized: true,
        isLoading: false,
        error: null,
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    } catch (error) {
      setStoredToken(null);
      setStoredUser(null);
      setStoredSelectedCourses([]);
      set({
        token: null,
        user: null,
        selectedCourses: [],
        isAuthorized: false,
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
      await registerUser({ email, password });
      const { token } = await loginUser({ email, password });
      setStoredToken(token);

      const { user, selectedCourses } = await resolveUserWithFallback(
        token,
        email,
      );

      setStoredUser(user);
      setStoredSelectedCourses(selectedCourses);

      set({
        token,
        user,
        selectedCourses,
        isAuthorized: true,
        isLoading: false,
        error: null,
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    } catch (error) {
      setStoredToken(null);
      setStoredUser(null);
      setStoredSelectedCourses([]);
      set({
        token: null,
        user: null,
        selectedCourses: [],
        isAuthorized: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Не удалось выполнить регистрацию",
      });
      throw error;
    }
  },

  logout: () => {
    setStoredToken(null);
    setStoredUser(null);
    setStoredSelectedCourses([]);
    set({
      isAuthorized: false,
      user: null,
      selectedCourses: [],
      token: null,
      isLoading: false,
      error: null,
      isAuthModalOpen: false,
      isUserMenuOpen: false,
    });
  },

  setAuthorized: (value) =>
    set((state) => {
      if (!value) {
        setStoredToken(null);
        setStoredUser(null);
        setStoredSelectedCourses([]);
      }

      return {
        isAuthorized: value,
        user: value ? state.user : null,
        selectedCourses: value ? state.selectedCourses : [],
        token: value ? state.token : null,
        isUserMenuOpen: value ? state.isUserMenuOpen : false,
        isAuthModalOpen: value ? state.isAuthModalOpen : false,
        error: null,
      };
    }),

  setUser: (user) =>
    set((state) => {
      setStoredUser(user);

      return {
        user,
        isAuthorized: Boolean(user && state.token),
      };
    }),

  setSelectedCourses: (selectedCourses) => {
    setStoredSelectedCourses(selectedCourses);
    set({ selectedCourses });
  },
}));
