"use client";

import { Button } from "@/components/Button/Button";
import Image from "next/image";

type ProgressSuccessModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export const ProgressSuccessModal = ({
  isOpen,
  onCloseAction,
}: ProgressSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
      <div className="flex w-full max-w-106.5 flex-col items-center gap-8.5 rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <h2 className="text-center text-[40px] font-semibold leading-[1.1] text-black">
          Ваш прогресс
          <br />
          засчитан!
        </h2>

        <div className="flex items-center justify-center">
          <Image
            src="/icons/check-in-circle-selected.svg"
            alt="Прогресс засчитан"
            width={68}
            height={68}
            className="h-[68px] w-[68px]"
            priority
          />
        </div>

        <Button className="w-full" onClick={onCloseAction} type="button">
          Отлично
        </Button>
      </div>
    </div>
  );
};
