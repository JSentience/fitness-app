import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

type ShowToastPayload = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastStore = {
  toasts: Toast[];
  show: (payload: ShowToastPayload) => string;
  dismiss: (toastId: string) => void;
  clear: () => void;
};

const DEFAULT_TOAST_DURATION: Record<ToastVariant, number> = {
  success: 3000,
  error: 4500,
  info: 3500,
};

const toastTimers = new Map<string, number>();
let nextToastId = 0;

function clearToastTimer(toastId: string) {
  const timer = toastTimers.get(toastId);

  if (timer === undefined) {
    return;
  }

  if (typeof window !== 'undefined') {
    window.clearTimeout(timer);
  }

  toastTimers.delete(toastId);
}

function scheduleToastRemoval(toastId: string, duration: number) {
  clearToastTimer(toastId);

  if (duration <= 0 || typeof window === 'undefined') {
    return;
  }

  const timer = window.setTimeout(() => {
    toastTimers.delete(toastId);
    useToastStore.getState().dismiss(toastId);
  }, duration);

  toastTimers.set(toastId, timer);
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  show: ({ message, variant = 'info', duration }) => {
    const toastId = `toast-${Date.now()}-${(nextToastId += 1)}`;
    const resolvedDuration = duration ?? DEFAULT_TOAST_DURATION[variant];

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: toastId,
          message,
          variant,
          duration: resolvedDuration,
        },
      ],
    }));

    scheduleToastRemoval(toastId, resolvedDuration);

    return toastId;
  },

  dismiss: (toastId) => {
    clearToastTimer(toastId);

    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    }));
  },

  clear: () => {
    for (const toast of get().toasts) {
      clearToastTimer(toast.id);
    }

    set({ toasts: [] });
  },
}));
