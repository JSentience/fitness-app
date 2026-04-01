import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type SectionTitleProps<T extends ElementType = 'h2'> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export const SectionTitle = <T extends ElementType = 'h2'>({
  as,
  children,
  className = '',
  ...props
}: SectionTitleProps<T>) => {
  const Component = as ?? 'h2';

  return (
    <Component
      className={`font-['StratosSkyeng'] text-[32px] leading-[1.1] text-black ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
