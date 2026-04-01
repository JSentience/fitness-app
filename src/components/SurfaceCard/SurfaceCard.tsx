import type { ReactNode } from 'react';

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

const BASE_SURFACE_CARD_CLASS_NAME =
  'rounded-[30px] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]';

export const SurfaceCard = ({ children, className = '' }: SurfaceCardProps) => {
  const resolvedClassName = `${BASE_SURFACE_CARD_CLASS_NAME} ${className}`.trim();

  return <div className={resolvedClassName}>{children}</div>;
};
