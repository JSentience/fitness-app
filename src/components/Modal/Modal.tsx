"use client";

import Image from "next/image";
import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type AuthMode = "login" | "register";

export const Modal = ({ isOpen, onClose }: ModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setMode("login");
    setError("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("Пароль введен неверно, попробуйте еще раз.");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("Данная почта уже используется. Попробуйте войти.");
  };

  const switchToRegister = () => {
    setMode("register");
    setError("");
  };

  const switchToLogin = () => {
    setMode("login");
    setError("");
  };

  const inputBase =
    "w-full px-4.5 py-4 text-lg leading-[1.1] border rounded-lg outline-none placeholder:text-[#D0CECE] focus:border-black transition-colors";

  const btnPrimary =
    "w-full py-4 px-6.5 bg-[#BCEC30] text-black text-lg leading-[1.1] rounded-[46px] hover:bg-[#C6FF00] active:bg-[#BCEC30] transition-colors";

  const btnOutline =
    "w-full py-4 px-6.5 border border-black text-black text-lg leading-[1.1] rounded-[46px] hover:bg-[#F7F7F7] active:bg-[#E9ECED] transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={handleClose}
    >
      <div
        className="flex flex-col items-center gap-12 p-10 bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] w-90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <Image
          src="/images/logo.svg"
          alt="SkyFitnessPro"
          width={220}
          height={35}
          priority
        />

        {/* Login form */}
        {mode === "login" && (
          <form
            className="flex flex-col items-center gap-8.5 w-full"
            onSubmit={handleLoginSubmit}
          >
            <div className="flex flex-col gap-2.5 w-full">
              <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className={`${inputBase} border-[#D0CECE]`}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`${inputBase} ${error ? "border-[#DB0030]" : "border-[#D0CECE]"}`}
              />
              {error && (
                <p className="text-sm text-[#DB0030] leading-[1.1] text-center">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button type="submit" className={btnPrimary}>
                Войти
              </button>
              <button
                type="button"
                onClick={switchToRegister}
                className={btnOutline}
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        )}

        {/* Register form */}
        {mode === "register" && (
          <form
            className="flex flex-col items-center gap-8.5 w-full"
            onSubmit={handleRegisterSubmit}
          >
            <div className="flex flex-col items-center gap-2.5 w-full">
              <input
                type="email"
                placeholder="Эл. почта"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={`${inputBase} ${error ? "border-[#DB0030]" : "border-[#D0CECE]"}`}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBase} border-[#D0CECE]`}
              />
              <input
                type="password"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className={`${inputBase} border-[#D0CECE]`}
              />
              {error && (
                <p className="text-sm text-[#DB0030] leading-[1.1] text-center">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button type="submit" className={btnPrimary}>
                Зарегистрироваться
              </button>
              <button
                type="button"
                onClick={switchToLogin}
                className={btnOutline}
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
