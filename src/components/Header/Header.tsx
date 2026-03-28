'use client';

import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { UserMenu } from '../UserMenu/UserMenu';

export const Header = () => {
  const {
    isAuthorized,
    user,
    isLoading,
    error,
    isAuthModalOpen,
    isUserMenuOpen,
    openAuthModal,
    closeAuthModal,
    toggleUserMenu,
    closeUserMenu,
    hydrateUser,
    logout,
  } = useAuthStore();

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        closeUserMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeUserMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isUserMenuOpen, closeUserMenu]);

  const handleProfileClick = () => {
    closeUserMenu();
    router.push('/profile');
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-start justify-between px-4 py-10 md:px-35 md:py-12.5">
        <Link href="/" className="flex flex-col gap-2">
          <Image
            src="/brand/logo.svg"
            alt="SkyFitnessPro"
            width={220}
            height={35}
            className="h-auto w-auto"
            priority
          />
          <p className="hidden md:block text-[18px] text-black opacity-50">
            Онлайн-тренировки для занятий дома
          </p>
        </Link>

        {isLoading ? (
          <div className="px-6 py-4 text-[18px] leading-[1.1] text-black/50">Загрузка...</div>
        ) : !isAuthorized ? (
          <div className="flex flex-col items-end gap-2">
            <Button onClick={openAuthModal}>Войти</Button>
            {error && (
              <p className="max-w-[260px] text-right text-[14px] leading-[1.1] text-[#DB0030]">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="relative flex items-center gap-2 md:gap-4"
              onClick={toggleUserMenu}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              aria-label="Открыть меню пользователя"
            >
              <div className="relative h-[32px] w-[32px] md:h-[50px] md:w-[50px]">
                <Image
                  src="/users/profile-avatar.svg"
                  alt={user?.name ?? 'Пользователь'}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <span className="hidden text-[18px] md:text-[24px] sm:block leading-[1.1] text-black">
                {user?.name ?? 'Пользователь'}
              </span>

              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <UserMenu
              isOpen={isUserMenuOpen}
              userName={user?.name ?? 'Пользователь'}
              userEmail={user?.email ?? ''}
              onProfileClickAction={handleProfileClick}
              onLogoutClickAction={handleLogoutClick}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isAuthModalOpen} closeAction={closeAuthModal} />
    </header>
  );
};
