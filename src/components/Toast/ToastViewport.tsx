'use client';

import { ControlButton } from '@/components/ControlButton/ControlButton';
import { useToastStore, type ToastVariant } from '@/store/toast.store';

type ToastTone = {
  accent: string;
  bg: string;
  border: string;
  iconBg: string;
  text: string;
};

const TOAST_TONES: Record<ToastVariant, ToastTone> = {
  success: {
    accent: 'bg-[#BCEC30]',
    bg: 'bg-[#F7FBE9]',
    border: 'border-[#DCEEA8]',
    iconBg: 'bg-[#E8F7BF]',
    text: 'text-black',
  },
  error: {
    accent: 'bg-[#DB0030]',
    bg: 'bg-[#FFF4F6]',
    border: 'border-[#F5C5D0]',
    iconBg: 'bg-[#FFE1E8]',
    text: 'text-[#6B1127]',
  },
  info: {
    accent: 'bg-[#00C1FF]',
    bg: 'bg-[#F4FAFF]',
    border: 'border-[#CBEAFA]',
    iconBg: 'bg-[#DFF4FF]',
    text: 'text-[#15364D]',
  },
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === 'success') {
    return (
      <svg
        className="h-4.5 w-4.5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.1665 10.4167L7.9165 14.1667L15.8332 6.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === 'error') {
    return (
      <svg
        className="h-4.5 w-4.5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M10 6.25V10.4167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="13.75" r="1.04167" fill="currentColor" />
        <path
          d="M10.0003 18.3334C14.6027 18.3334 18.3337 14.6024 18.3337 10C18.3337 5.39767 14.6027 1.66669 10.0003 1.66669C5.39795 1.66669 1.66699 5.39767 1.66699 10C1.66699 14.6024 5.39795 18.3334 10.0003 18.3334Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-4.5 w-4.5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10 13.75V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.66667" r="1.04167" fill="currentColor" />
      <path
        d="M10.0003 18.3334C14.6027 18.3334 18.3337 14.6024 18.3337 10C18.3337 5.39767 14.6027 1.66669 10.0003 1.66669C5.39795 1.66669 1.66699 5.39767 1.66699 10C1.66699 14.6024 5.39795 18.3334 10.0003 18.3334Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      aria-relevant="additions text"
      className="pointer-events-none fixed bottom-4 right-4 z-60 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => {
        const tone = TOAST_TONES[toast.variant];

        return (
          <div
            key={toast.id}
            role={toast.variant === 'error' ? 'alert' : 'status'}
            aria-atomic="true"
            className={`pointer-events-auto relative overflow-hidden rounded-[28px] border ${tone.border} ${tone.bg} shadow-[0px_16px_40px_-20px_rgba(0,0,0,0.35)] animate-[toast-slide-in_180ms_ease-out]`}
          >
            <div className={`absolute inset-y-0 left-0 w-1.5 ${tone.accent}`} />

            <div className="flex items-start gap-3 p-4 pl-5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone.iconBg} ${tone.text}`}
              >
                <ToastIcon variant={toast.variant} />
              </div>

              <p className={`flex-1 pt-1 text-[15px] leading-[1.2] ${tone.text}`}>
                {toast.message}
              </p>

              <ControlButton
                onClick={() => dismiss(toast.id)}
                className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[20px] leading-none hover:bg-black/5 ${tone.text}`}
                aria-label="Закрыть уведомление"
              >
                <span aria-hidden="true">&times;</span>
              </ControlButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
