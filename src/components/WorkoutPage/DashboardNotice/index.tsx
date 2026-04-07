import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import type { ReactNode } from 'react';

type DashboardNoticeProps = {
  children: ReactNode;
  tone?: 'default' | 'danger' | 'muted';
};

const TONE_CLASS_NAME: Record<NonNullable<DashboardNoticeProps['tone']>, string> = {
  default: 'text-black',
  muted: 'text-black/60',
  danger: 'text-[#DB0030]',
};

export const DashboardNotice = ({ children, tone = 'default' }: DashboardNoticeProps) => {
  return (
    <SurfaceCard className="p-7.5">
      <p className={`text-[24px] leading-[1.1] ${TONE_CLASS_NAME[tone]}`}>{children}</p>
    </SurfaceCard>
  );
};
