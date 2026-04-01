'use client';

import { BodyText } from '@/components/BodyText/BodyText';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '../Button/Button';
import { ControlButton } from '../ControlButton/ControlButton';
import { Modal } from '../Modal/Modal';
import { UserMenu } from '../UserMenu/UserMenu';

export const Header = () => {
  const {
    closeAuthModal,
    closeUserMenu,
    error,
    hydrateUser,
    isAuthModalOpen,
    isAuthorized,
    isLoading,
    isUserMenuOpen,
    logout,
    openAuthModal,
    toggleUserMenu,
    user,
  } = useAuthStore(
    useShallow((state) => ({
      closeAuthModal: state.closeAuthModal,
      closeUserMenu: state.closeUserMenu,
      error: state.error,
      hydrateUser: state.hydrateUser,
      isAuthModalOpen: state.isAuthModalOpen,
      isAuthorized: state.isAuthorized,
      isLoading: state.isLoading,
      isUserMenuOpen: state.isUserMenuOpen,
      logout: state.logout,
      openAuthModal: state.openAuthModal,
      toggleUserMenu: state.toggleUserMenu,
      user: state.user,
    })),
  );

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const displayUserName = user?.name ?? 'Пользователь';

  useEffect(() => {
    void hydrateUser();
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
    void logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-start justify-between px-4 py-10 md:px-35 md:py-12.5">
        <Link href="/" className="flex flex-col gap-2">
          <div className="relative h-8.75 w-55">
            <Image
              src="/brand/logo.svg"
              alt="SkyFitnessPro"
              fill
              className="object-contain"
              sizes="220px"
              priority
            />
          </div>
          <p className="hidden md:block text-[18px] text-black opacity-50">
            Онлайн-тренировки для занятий дома
          </p>
        </Link>

        {isLoading ? (
          <BodyText as="div" tone="muted" className="px-6 py-4">
            Загрузка...
          </BodyText>
        ) : !isAuthorized ? (
          <div className="flex flex-col items-end gap-2">
            <Button onClick={openAuthModal}>Войти</Button>
            {error && (
              <p className="max-w-65 text-right text-[14px] leading-[1.1] text-[#DB0030]">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="relative" ref={userMenuRef}>
            <ControlButton
              className="relative flex items-center gap-2 md:gap-4"
              onClick={toggleUserMenu}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              aria-label="Открыть меню пользователя"
            >
              <div className="relative h-8 w-8 md:h-12.5 md:w-12.5">
                <Image
                  src="/users/profile-avatar.svg"
                  alt={displayUserName}
                  fill
                  sizes="(max-width: 768px) 32px, 50px"
                  className="object-contain"
                  priority
                />
              </div>

              <span className="hidden text-[18px] md:text-[24px] sm:block leading-[1.1] text-black">
                {displayUserName}
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
            </ControlButton>

            <UserMenu
              isOpen={isUserMenuOpen}
              userName={displayUserName}
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
