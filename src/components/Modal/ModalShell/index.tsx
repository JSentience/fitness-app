'use client';

import { useEffect, type ReactNode } from 'react';

type ModalShellProps = {
  ariaLabelledBy?: string;
  backdropClassName?: string;
  children: ReactNode;
  contentClassName: string;
  isOpen: boolean;
  onCloseAction: () => void;
};

const DEFAULT_BACKDROP_CLASS_NAME =
  'fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4';

export const ModalShell = ({
  ariaLabelledBy,
  backdropClassName = DEFAULT_BACKDROP_CLASS_NAME,
  children,
  contentClassName,
  isOpen,
  onCloseAction,
}: ModalShellProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseAction();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCloseAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={backdropClassName} onClick={onCloseAction}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={contentClassName}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
