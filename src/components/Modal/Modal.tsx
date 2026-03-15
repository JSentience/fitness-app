"use client";

import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  closeAction: () => void;
};

type AuthMode = "login" | "register";

export const Modal = ({ isOpen, closeAction }: ModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => {
    if (!isOpen) return;
    clearError();
  }, [isOpen, clearError]);

  const resetForm = () => {
    setMode("login");
    setLoginEmail("");
    setRegisterEmail("");
    setLoginPassword("");
    setRegisterPassword("");
    setRepeatPassword("");
    clearError();
  };

  const handleClose = () => {
    closeAction();
    resetForm();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    handleClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== repeatPassword) {
      return;
    }

    await register({
      email: registerEmail.trim(),
      password: registerPassword,
    });
    handleClose();
  };

  const switchToRegister = () => {
    setMode("register");
    clearError();
  };

  const switchToLogin = () => {
    setMode("login");
    clearError();
  };

  const passwordsMismatch =
    mode === "register" &&
    repeatPassword.length > 0 &&
    registerPassword !== repeatPassword;

  const currentError = passwordsMismatch ? "Пароли не совпадают." : error;

  const inputBase =
    "w-full px-4.5 py-4 text-lg leading-[1.1] border rounded-lg outline-none placeholder:text-[#D0CECE] focus:border-black transition-colors disabled:bg-[#F7F7F7] disabled:text-[#999999]";

  const btnPrimary =
    "w-full py-4 px-6.5 bg-[#BCEC30] text-black text-lg leading-[1.1] rounded-[46px] hover:bg-[#C6FF00] active:bg-[#BCEC30] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  const btnOutline =
    "w-full py-4 px-6.5 border border-black text-black text-lg leading-[1.1] rounded-[46px] hover:bg-[#F7F7F7] active:bg-[#E9ECED] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={handleClose}
    >
      <div
        className="flex flex-col items-center gap-12 p-10 bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] w-90"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src="/brand/logo.svg"
          alt="SkyFitnessPro"
          width={220}
          height={35}
          priority
        />

        {mode === "login" && (
          <form
            className="flex flex-col items-center gap-8.5 w-full"
            onSubmit={handleLoginSubmit}
          >
            <div className="flex flex-col gap-2.5 w-full">
              <input
                type="email"
                placeholder="Эл. почта"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  clearError();
                }}
                className={`${inputBase} border-[#D0CECE]`}
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  clearError();
                }}
                className={`${inputBase} ${
                  currentError ? "border-[#DB0030]" : "border-[#D0CECE]"
                }`}
                disabled={isLoading}
              />
              {currentError && (
                <p className="text-sm text-[#DB0030] leading-[1.1] text-center">
                  {currentError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button type="submit" className={btnPrimary} disabled={isLoading}>
                {isLoading ? "Входим..." : "Войти"}
              </button>
              <button
                type="button"
                onClick={switchToRegister}
                className={btnOutline}
                disabled={isLoading}
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form
            className="flex flex-col items-center gap-8.5 w-full"
            onSubmit={handleRegisterSubmit}
          >
            <div className="flex flex-col items-center gap-2.5 w-full">
              <input
                type="email"
                placeholder="Эл. почта"
                value={registerEmail}
                onChange={(e) => {
                  setRegisterEmail(e.target.value);
                  clearError();
                }}
                className={`${inputBase} ${
                  currentError ? "border-[#DB0030]" : "border-[#D0CECE]"
                }`}
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={registerPassword}
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                  clearError();
                }}
                className={`${inputBase} ${
                  currentError ? "border-[#DB0030]" : "border-[#D0CECE]"
                }`}
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={(e) => {
                  setRepeatPassword(e.target.value);
                  clearError();
                }}
                className={`${inputBase} ${
                  currentError ? "border-[#DB0030]" : "border-[#D0CECE]"
                }`}
                disabled={isLoading}
              />
              {currentError && (
                <p className="text-sm text-[#DB0030] leading-[1.1] text-center">
                  {currentError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="submit"
                className={btnPrimary}
                disabled={isLoading || passwordsMismatch}
              >
                {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
              </button>
              <button
                type="button"
                onClick={switchToLogin}
                className={btnOutline}
                disabled={isLoading}
              >
                Войти
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
