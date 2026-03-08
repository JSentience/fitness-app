"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAFA]">
      <div className="flex justify-between items-center px-35 py-12.5">
        <div className="flex flex-col gap-2">
          <Image
            src="/images/logo.svg"
            alt="SkyFitnessPro"
            width={220}
            height={35}
            priority
          />
          <p className="text-[18px] text-black opacity-50">
            Онлайн-тренировки для занятий дома
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Войти</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};
