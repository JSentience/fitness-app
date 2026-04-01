import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const ControlButton = ({
  children,
  className = '',
  type = 'button',
  ...props
}: ControlButtonProps) => {
  return (
    <button
      type={type}
      className={`transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
