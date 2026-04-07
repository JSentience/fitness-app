import { type ToastVariant, useToastStore } from "@/store/toast.store";

type NotifyOptions = {
  duration?: number;
};

function showToast(
  variant: ToastVariant,
  message: string,
  options?: NotifyOptions,
) {
  return useToastStore.getState().show({
    message,
    variant,
    duration: options?.duration,
  });
}

export const notify = {
  success: (message: string, options?: NotifyOptions) =>
    showToast("success", message, options),

  error: (message: string, options?: NotifyOptions) =>
    showToast("error", message, options),

  info: (message: string, options?: NotifyOptions) =>
    showToast("info", message, options),

  courseAdded: () => showToast("success", "Курс добавлен в профиль."),

  courseAlreadyAdded: () => showToast("info", "Курс уже есть в профиле."),

  courseRemoved: () => showToast("success", "Курс удален из профиля."),

  courseAlreadyRemoved: () =>
    showToast("info", "Курс уже был удален из профиля."),

  progressSaved: () => showToast("success", "Прогресс сохранен."),
};
