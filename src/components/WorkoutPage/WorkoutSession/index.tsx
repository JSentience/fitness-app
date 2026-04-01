import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import { ExercisesPanel } from '@/components/WorkoutPage/ExercisesPanel';
import { WorkoutVideoPlayer } from '@/components/WorkoutPage/WorkoutVideoPlayer';
import type { ProgressValueMap } from '@/components/WorkoutPage/workout-page.types';
import type { Workout } from '@/lib/workouts-api';

type WorkoutSessionProps = {
  activeWorkout: Workout | null;
  activeWorkoutError: string;
  courseName: string;
  hasProgress: boolean;
  isLoadingActiveWorkout: boolean;
  onOpenProgressAction: () => void;
  progressValues: ProgressValueMap;
};

export const WorkoutSession = ({
  activeWorkout,
  activeWorkoutError,
  courseName,
  hasProgress,
  isLoadingActiveWorkout,
  onOpenProgressAction,
  progressValues,
}: WorkoutSessionProps) => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-[60px] font-medium leading-[1em] text-black">
        {courseName || 'Тренировка'}
      </h1>

      {isLoadingActiveWorkout ? (
        <SurfaceCard className="flex h-100 items-center justify-center overflow-hidden">
          <p className="text-[24px] leading-[1.1] text-black/60">Загружаем тренировку...</p>
        </SurfaceCard>
      ) : activeWorkoutError ? (
        <SurfaceCard className="p-10">
          <p className="text-[24px] leading-[1.1] text-[#DB0030]">{activeWorkoutError}</p>
        </SurfaceCard>
      ) : activeWorkout ? (
        <WorkoutVideoPlayer videoUrl={activeWorkout.video} title={activeWorkout.name} />
      ) : null}

      {!isLoadingActiveWorkout && !activeWorkoutError && activeWorkout && (
        <ExercisesPanel
          workoutName="Упражнения тренировки"
          exercises={activeWorkout.exercises}
          progressValues={progressValues}
          hasProgress={hasProgress}
          onOpenProgressAction={onOpenProgressAction}
        />
      )}
    </div>
  );
};
