"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";

import { ProgressModal } from "@/components/WorkoutPage/ProgressModal";
import { ProgressSuccessModal } from "@/components/WorkoutPage/ProgressSuccessModal";
import { WorkoutSession } from "@/components/WorkoutPage/WorkoutSession";
import { useActiveWorkout } from "@/components/WorkoutPage/hooks/useActiveWorkout";
import type { Workout } from "@/lib/workouts-api";

type WorkoutLessonClientProps = {
  courseId: string;
  workoutId: string;
  initialCourseName?: string;
  initialProgressData?: number[] | null;
  initialWorkout?: Workout | null;
};

export const WorkoutLessonClient = ({
  courseId,
  workoutId,
  initialCourseName = "",
  initialProgressData = null,
  initialWorkout = null,
}: WorkoutLessonClientProps) => {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isProgressAcceptedOpen, setIsProgressAcceptedOpen] = useState(false);
  const isAuthorized = useAuthStore((state) => state.isAuthorized);

  const {
    activeWorkout,
    activeWorkoutError,
    hasProgress,
    isLoadingActiveWorkout,
    isSavingProgress,
    progressValues,
    saveCurrentProgress,
    saveProgressError,
    setSaveProgressError,
    updateProgressValue,
  } = useActiveWorkout({
    courseId,
    currentCourse: null,
    initialProgressData,
    initialWorkout,
    isAuthorized,
    workoutId,
  });

  const progressTitle = activeWorkout?.name
    ? `Мой прогресс по тренировке "${activeWorkout.name}":`
    : "Мой прогресс";

  return (
    <main className="min-h-screen bg-white px-4 py-12.5 md:px-35">
      <WorkoutSession
        activeWorkout={activeWorkout}
        activeWorkoutError={activeWorkoutError}
        courseName={initialCourseName}
        hasProgress={hasProgress}
        isLoadingActiveWorkout={isLoadingActiveWorkout}
        onOpenProgressAction={() => {
          setIsProgressAcceptedOpen(false);
          setSaveProgressError("");
          setIsProgressModalOpen(true);
        }}
        progressValues={progressValues}
      />

      <ProgressModal
        isOpen={isProgressModalOpen}
        title={progressTitle}
        exercises={activeWorkout?.exercises ?? []}
        progressValues={progressValues}
        isSaving={isSavingProgress}
        saveError={saveProgressError}
        onCloseAction={() => {
          setIsProgressModalOpen(false);
        }}
        onSubmitAction={() => {
          void saveCurrentProgress().then(() => {
            setIsProgressModalOpen(false);
            setIsProgressAcceptedOpen(true);
          });
        }}
        onProgressChangeAction={updateProgressValue}
      />

      <ProgressSuccessModal
        isOpen={isProgressAcceptedOpen}
        onCloseAction={() => {
          setIsProgressAcceptedOpen(false);
        }}
      />
    </main>
  );
};
