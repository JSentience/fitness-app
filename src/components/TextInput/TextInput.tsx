import type { InputHTMLAttributes } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const TextInput = ({
  className = '',
  hasError = false,
  ...props
}: TextInputProps) => {
  const borderClassName = hasError ? 'border-[#DB0030]' : 'border-[#D0CECE]';

  return (
    <input
      className={`w-full rounded-lg border px-4.5 py-4 text-lg leading-[1.1] text-black outline-none transition-colors placeholder:text-[#D0CECE] focus:border-black disabled:bg-[#F7F7F7] disabled:text-[#999999] ${borderClassName} ${className}`}
      {...props}
    />
  );
};
