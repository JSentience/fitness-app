import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type BodyTextTone = 'default' | 'muted' | 'secondary' | 'danger';
type BodyTextSize = 'md' | 'sm';

type BodyTextProps<T extends ElementType = 'p'> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: BodyTextSize;
  tone?: BodyTextTone;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const SIZE_CLASS_NAME: Record<BodyTextSize, string> = {
  md: 'text-[18px] leading-[1.1]',
  sm: 'text-[14px] leading-[1.2]',
};

const TONE_CLASS_NAME: Record<BodyTextTone, string> = {
  default: 'text-black',
  muted: 'text-black/50',
  secondary: 'text-[#999999]',
  danger: 'text-[#DB0030]',
};

export const BodyText = <T extends ElementType = 'p'>({
  as,
  children,
  className = '',
  size = 'md',
  tone = 'default',
  ...props
}: BodyTextProps<T>) => {
  const Component = as ?? 'p';

  return (
    <Component
      className={`${SIZE_CLASS_NAME[size]} ${TONE_CLASS_NAME[tone]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
