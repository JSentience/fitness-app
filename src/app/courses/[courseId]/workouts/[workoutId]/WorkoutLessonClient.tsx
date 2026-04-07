'use client';

import { useAuthStore } from '@/store/auth.store';

import { ProgressModal } from '@/components/WorkoutPage/ProgressModal';
import { WorkoutSession } from '@/components/WorkoutPage/WorkoutSession';
import { useActiveWorkout } from '@/components/WorkoutPage/hooks/useActiveWorkout';
import { useWorkoutProgressModal } from '@/components/WorkoutPage/hooks/useWorkoutProgressModal';
import type { Workout } from '@/lib/workouts-api';

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
  initialCourseName = '',
  initialProgressData = null,
  initialWorkout = null,
}: WorkoutLessonClientProps) => {
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

  const {
    closeProgressModal,
    isProgressModalOpen,
    openProgressModal,
    progressTitle,
    submitProgress,
  } = useWorkoutProgressModal({
    activeWorkoutName: activeWorkout?.name,
    saveCurrentProgressAction: saveCurrentProgress,
    setSaveProgressErrorAction: setSaveProgressError,
  });

  return (
    <main className="min-h-screen bg-white px-4 py-12.5 md:px-35">
      <WorkoutSession
        activeWorkout={activeWorkout}
        activeWorkoutError={activeWorkoutError}
        courseName={initialCourseName}
        hasProgress={hasProgress}
        isLoadingActiveWorkout={isLoadingActiveWorkout}
        onOpenProgressAction={openProgressModal}
        progressValues={progressValues}
      />

      <ProgressModal
        isOpen={isProgressModalOpen}
        title={progressTitle}
        exercises={activeWorkout?.exercises ?? []}
        progressValues={progressValues}
        isSaving={isSavingProgress}
        saveError={saveProgressError}
        onCloseAction={closeProgressModal}
        onSubmitAction={() => {
          void submitProgress();
        }}
        onProgressChangeAction={updateProgressValue}
      />
    </main>
  );
};
