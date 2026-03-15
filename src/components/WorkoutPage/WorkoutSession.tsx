import { ExercisesPanel } from "./ExercisesPanel";
import { WorkoutVideoPlayer } from "./WorkoutVideoPlayer";
import type { ProgressValueMap } from "./types";
import type { Workout } from "@/lib/workouts-api";

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
        {courseName || "Тренировка"}
      </h1>

      {isLoadingActiveWorkout ? (
        <div className="flex h-100 items-center justify-center overflow-hidden rounded-[30px] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
          <p className="text-[24px] leading-[1.1] text-black/60">
            Загружаем тренировку...
          </p>
        </div>
      ) : activeWorkoutError ? (
        <div className="rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
          <p className="text-[24px] leading-[1.1] text-[#DB0030]">
            {activeWorkoutError}
          </p>
        </div>
      ) : activeWorkout?.video ? (
        <WorkoutVideoPlayer
          videoUrl={activeWorkout.video}
          title={activeWorkout.name}
        />
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
