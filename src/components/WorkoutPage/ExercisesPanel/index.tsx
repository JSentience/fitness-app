'use client';

import { BodyText } from '@/components/BodyText/BodyText';
import { Button } from '@/components/Button/Button';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import type { ProgressValueMap } from '@/components/WorkoutPage/workout-page.types';
import { getExerciseProgressPercent } from '@/components/WorkoutPage/workoutProgress';
import type { Exercise } from '@/lib/workouts-api';

type ExercisesPanelProps = {
  workoutName: string;
  exercises: Exercise[];
  progressValues: ProgressValueMap;
  hasProgress?: boolean;
  onOpenProgressAction: () => void;
};

const PROGRESS_BAR_COLOR = '#00C1FF';
const PROGRESS_BAR_BG = '#F7F7F7';

export const ExercisesPanel = ({
  workoutName,
  exercises,
  progressValues,
  hasProgress = false,
  onOpenProgressAction,
}: ExercisesPanelProps) => {
  return (
    <SurfaceCard className="flex flex-col gap-6 p-10">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <SectionTitle as="h2">{workoutName}</SectionTitle>

          {exercises.length > 0 && (
            <div className="grid gap-5 md:grid-cols-1 md:gap-x-15 xl:grid-cols-3">
              {exercises.map((exercise) => {
                const percent = getExerciseProgressPercent(
                  exercise._id,
                  exercise.quantity,
                  progressValues,
                );

                return (
                  <div key={exercise._id} className="flex w-70.75 flex-col gap-2.5 md:w-[320px]">
                    <BodyText as="span" className="w-full">
                      {exercise.name} <span className="text-black/50">{percent}%</span>
                    </BodyText>

                    <div
                      className="relative h-1.5 w-full overflow-hidden rounded-[3px]"
                      style={{ backgroundColor: PROGRESS_BAR_BG }}
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Прогресс: ${exercise.name}`}
                    >
                      {percent > 0 && (
                        <div
                          className="absolute left-0 top-0 h-full rounded-[3px]"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: PROGRESS_BAR_COLOR,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button
          onClick={onOpenProgressAction}
          className="flex w-70.75 items-center justify-center sm:w-[320px]"
        >
          {hasProgress ? 'Обновить свой прогресс' : 'Заполнить свой прогресс'}
        </Button>
      </div>
    </SurfaceCard>
  );
};
