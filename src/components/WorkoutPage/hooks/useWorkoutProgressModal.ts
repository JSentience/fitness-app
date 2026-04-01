'use client';

import { notify } from '@/lib/notify';
import { useState } from 'react';

type SaveProgressResult = {
  saved: true;
} | null;

type UseWorkoutProgressModalArgs = {
  activeWorkoutName?: string;
  saveCurrentProgressAction: () => Promise<SaveProgressResult>;
  setSaveProgressErrorAction: (error: string) => void;
};

export function useWorkoutProgressModal({
  activeWorkoutName = '',
  saveCurrentProgressAction,
  setSaveProgressErrorAction,
}: UseWorkoutProgressModalArgs) {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const progressTitle = activeWorkoutName
    ? `Мой прогресс по тренировке "${activeWorkoutName}":`
    : 'Мой прогресс';

  const openProgressModal = () => {
    setSaveProgressErrorAction('');
    setIsProgressModalOpen(true);
  };

  const closeProgressModal = () => {
    setIsProgressModalOpen(false);
  };

  const submitProgress = async () => {
    const result = await saveCurrentProgressAction();

    if (!result) {
      return;
    }

    closeProgressModal();
    notify.progressSaved();
  };

  return {
    closeProgressModal,
    isProgressModalOpen,
    openProgressModal,
    progressTitle,
    submitProgress,
  };
}
