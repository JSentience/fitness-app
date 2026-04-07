import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export const Button = ({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const base =
    'rounded-[46px] px-6.5 py-4 text-lg leading-[1.1] transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[#BCEC30] text-black hover:bg-[#C6FF00] active:bg-[#BCEC30] focus-visible:ring-2 focus-visible:ring-[#BCEC30]/50',
    outline:
      'border border-black text-black hover:bg-[#F7F7F7] active:bg-[#E9ECED] focus-visible:ring-2 focus-visible:ring-black/20',
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
