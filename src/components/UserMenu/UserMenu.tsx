'use client';

import { BodyText } from '@/components/BodyText/BodyText';
import { Button } from '@/components/Button/Button';
import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';

export type UserMenuProps = {
  isOpen: boolean;
  userName: string;
  userEmail: string;
  onProfileClickAction?: () => void;
  onLogoutClickAction?: () => void;
};

export const UserMenu = ({
  isOpen,
  userName,
  userEmail,
  onProfileClickAction,
  onLogoutClickAction,
}: UserMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-18.5 z-50 w-[256px]">
      <SurfaceCard className="flex flex-col items-center gap-8.5 p-7.5">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex flex-col items-center gap-2.5">
            <BodyText>{userName}</BodyText>
            <BodyText tone="secondary">{userEmail}</BodyText>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <Button className="w-full justify-center" onClick={onProfileClickAction} type="button">
            Мой профиль
          </Button>

          <Button
            className="w-full justify-center"
            onClick={onLogoutClickAction}
            type="button"
            variant="outline"
          >
            Выйти
          </Button>
        </div>
      </SurfaceCard>
    </div>
  );
};
