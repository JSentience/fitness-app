'use client';

import { Button } from '@/components/Button/Button';
import { ModalShell } from '@/components/Modal/ModalShell';
import { TextInput } from '@/components/TextInput/TextInput';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
import { useEffect, useId, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

type ModalProps = {
  isOpen: boolean;
  closeAction: () => void;
};

type AuthMode = 'login' | 'register';

type AuthFormValues = {
  loginEmail: string;
  loginPassword: string;
  registerEmail: string;
  registerPassword: string;
  repeatPassword: string;
};

const INITIAL_FORM_VALUES: AuthFormValues = {
  loginEmail: '',
  loginPassword: '',
  registerEmail: '',
  registerPassword: '',
  repeatPassword: '',
};

export const Modal = ({ isOpen, closeAction }: ModalProps) => {
  const titleId = useId();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formValues, setFormValues] = useState<AuthFormValues>(INITIAL_FORM_VALUES);

  const { clearError, error, isLoading, login, register } = useAuthStore(
    useShallow((state) => ({
      clearError: state.clearError,
      error: state.error,
      isLoading: state.isLoading,
      login: state.login,
      register: state.register,
    })),
  );

  useEffect(() => {
    if (!isOpen) return;
    clearError();
  }, [isOpen, clearError]);

  const updateValue = (field: keyof AuthFormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    clearError();
  };

  const resetForm = () => {
    setMode('login');
    setFormValues(INITIAL_FORM_VALUES);
    clearError();
  };

  const handleClose = () => {
    closeAction();
    resetForm();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({
        email: formValues.loginEmail.trim(),
        password: formValues.loginPassword,
      });
      handleClose();
    } catch {}
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formValues.registerPassword !== formValues.repeatPassword) {
      return;
    }

    try {
      await register({
        email: formValues.registerEmail.trim(),
        password: formValues.registerPassword,
      });
      handleClose();
    } catch {}
  };

  const switchToRegister = () => {
    setMode('register');
    clearError();
  };

  const switchToLogin = () => {
    setMode('login');
    clearError();
  };

  const passwordsMismatch =
    mode === 'register' &&
    formValues.repeatPassword.length > 0 &&
    formValues.registerPassword !== formValues.repeatPassword;

  const currentError = passwordsMismatch ? 'Пароли не совпадают.' : error;

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onCloseAction={handleClose}
      ariaLabelledBy={titleId}
      backdropClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      contentClassName="flex w-90 flex-col items-center gap-12 rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]"
    >
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
      <h2 id={titleId} className="sr-only">
        {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
      </h2>

      {mode === 'login' && (
        <form className="flex w-full flex-col items-center gap-8.5" onSubmit={handleLoginSubmit}>
          <div className="flex w-full flex-col gap-2.5">
            <TextInput
              type="email"
              placeholder="Эл. почта"
              value={formValues.loginEmail}
              onChange={(e) => {
                updateValue('loginEmail', e.target.value);
              }}
              disabled={isLoading}
            />
            <TextInput
              type="password"
              placeholder="Пароль"
              value={formValues.loginPassword}
              onChange={(e) => {
                updateValue('loginPassword', e.target.value);
              }}
              hasError={Boolean(currentError)}
              disabled={isLoading}
            />
            {currentError && (
              <p className="text-center text-sm leading-[1.1] text-[#DB0030]">{currentError}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Входим...' : 'Войти'}
            </Button>
            <Button
              type="button"
              onClick={switchToRegister}
              className="w-full"
              variant="outline"
              disabled={isLoading}
            >
              Зарегистрироваться
            </Button>
          </div>
        </form>
      )}

      {mode === 'register' && (
        <form className="flex w-full flex-col items-center gap-8.5" onSubmit={handleRegisterSubmit}>
          <div className="flex w-full flex-col items-center gap-2.5">
            <TextInput
              type="email"
              placeholder="Эл. почта"
              value={formValues.registerEmail}
              onChange={(e) => {
                updateValue('registerEmail', e.target.value);
              }}
              hasError={Boolean(currentError)}
              disabled={isLoading}
            />
            <TextInput
              type="password"
              placeholder="Пароль"
              value={formValues.registerPassword}
              onChange={(e) => {
                updateValue('registerPassword', e.target.value);
              }}
              hasError={Boolean(currentError)}
              disabled={isLoading}
            />
            <TextInput
              type="password"
              placeholder="Повторите пароль"
              value={formValues.repeatPassword}
              onChange={(e) => {
                updateValue('repeatPassword', e.target.value);
              }}
              hasError={Boolean(currentError)}
              disabled={isLoading}
            />
            {currentError && (
              <p className="text-center text-sm leading-[1.1] text-[#DB0030]">{currentError}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <Button type="submit" className="w-full" disabled={isLoading || passwordsMismatch}>
              {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
            </Button>
            <Button
              type="button"
              onClick={switchToLogin}
              className="w-full"
              variant="outline"
              disabled={isLoading}
            >
              Войти
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  );
};
