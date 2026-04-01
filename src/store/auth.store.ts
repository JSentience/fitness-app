import {
  type AuthSession,
  clearStoredAuthSession,
  hasAuthSessionHint,
  persistAuthSession,
  readStoredAuthUser,
  readStoredSelectedCourses,
  resolveAuthSession,
  writeStoredSelectedCourses,
} from '@/lib/auth-session';
import { ClientApiError } from '@/lib/client-api';
import {
  getCurrentUserClient,
  loginUserClient,
  logoutUserClient,
  registerUserClient,
} from '@/lib/client-auth-api';
import { getErrorMessage } from '@/lib/error-utils';
import type { User } from '@/types/user.types';
import { create } from 'zustand';

type AuthStore = {
  hasHydratedUser: boolean;
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

function createAuthorizedState(session: AuthSession) {
  return {
    hasHydratedUser: true,
    isAuthorized: true,
    user: session.user,
    selectedCourses: session.selectedCourses,
    isLoading: false,
    error: null,
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  hasHydratedUser: false,
  isAuthorized: false,
  user: null,
  selectedCourses: [],
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
  isUserMenuOpen: false,

  hydrateUser: async () => {
    const state = get();
    const storedUser = state.user ?? readStoredAuthUser();
    const storedSelectedCourses =
      state.selectedCourses.length > 0 ? state.selectedCourses : readStoredSelectedCourses();
    const hasSessionHint = hasAuthSessionHint();

    if (state.isLoading) {
      return;
    }

    if (!storedUser && !hasSessionHint) {
      set({
        hasHydratedUser: true,
        isAuthorized: false,
        user: null,
        selectedCourses: [],
        isLoading: false,
        error: null,
      });
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
      const session = resolveAuthSession(await getCurrentUserClient());

      persistAuthSession(session);

      set(createAuthorizedState(session));
    } catch (error) {
      if (error instanceof ClientApiError && error.status === 401) {
        clearStoredAuthSession();
        set({
          hasHydratedUser: true,
          isAuthorized: false,
          user: null,
          selectedCourses: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      set({
        hasHydratedUser: true,
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
      const session = resolveAuthSession(await loginUserClient({ email, password }));

      persistAuthSession(session);

      set({
        ...createAuthorizedState(session),
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    } catch (error) {
      clearStoredAuthSession();
      set({
        isAuthorized: false,
        user: null,
        selectedCourses: [],
        hasHydratedUser: true,
        isLoading: false,
        error: getErrorMessage(error, 'Не удалось выполнить вход'),
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
      const session = resolveAuthSession(await registerUserClient({ email, password }));

      persistAuthSession(session);

      set({
        ...createAuthorizedState(session),
        isAuthModalOpen: false,
        isUserMenuOpen: false,
      });
    } catch (error) {
      clearStoredAuthSession();
      set({
        isAuthorized: false,
        user: null,
        selectedCourses: [],
        hasHydratedUser: true,
        isLoading: false,
        error: getErrorMessage(error, 'Не удалось выполнить регистрацию'),
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutUserClient();
    } catch {
    } finally {
      clearStoredAuthSession();
      set({
        hasHydratedUser: true,
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
    writeStoredSelectedCourses(selectedCourses);
    set({ selectedCourses });
  },
}));
