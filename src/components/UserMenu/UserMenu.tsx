'use client';

import { Button } from '@/components/Button/Button';

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
      <div className="flex flex-col items-center gap-8.5 rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-[18px] leading-[1.1] text-black">{userName}</p>
            <p className="text-[18px] leading-[1.1] text-[#999999]">{userEmail}</p>
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
      </div>
    </div>
  );
};

