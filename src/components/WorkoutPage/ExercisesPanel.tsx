"use client";

import type { Exercise } from "@/lib/workouts-api";
import type { ProgressValueMap } from "./workout-page.types";

type ExercisesPanelProps = {
  workoutName: string;
  exercises: Exercise[];
  progressValues: ProgressValueMap;
  hasProgress?: boolean;
  onOpenProgressAction: () => void;
};

const PROGRESS_BAR_TOTAL_WIDTH = 320;
const PROGRESS_BAR_COLOR = "#00C1FF";
const PROGRESS_BAR_BG = "#F7F7F7";

function getProgressPercent(
  exerciseId: string,
  quantity: number,
  progressValues: ProgressValueMap,
): number {
  const raw = progressValues[exerciseId];
  if (!raw) return 0;
  const value = parseInt(raw, 10);
  if (isNaN(value) || quantity <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / quantity) * 100)));
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export const ExercisesPanel = ({
  workoutName,
  exercises,
  progressValues,
  hasProgress = false,
  onOpenProgressAction,
}: ExercisesPanelProps) => {
  const COLUMN_SIZE = 3;
  const columns = chunkArray(exercises, COLUMN_SIZE);

  return (
    <section className="flex flex-col gap-6 rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5">
          <h2 className="font-['StratosSkyeng'] text-[32px] leading-[1.1] text-black">
            {workoutName}
          </h2>

          {exercises.length > 0 && (
            <div className="flex flex-wrap gap-15">
              {columns.map((column, columnIndex) => (
                <div key={`col-${columnIndex}`} className="flex flex-col gap-5">
                  {column.map((exercise) => {
                    const percent = getProgressPercent(
                      exercise._id,
                      exercise.quantity,
                      progressValues,
                    );
                    const fillWidth = Math.round(
                      (percent / 100) * PROGRESS_BAR_TOTAL_WIDTH,
                    );

                    return (
                      <div key={exercise._id} className="flex flex-col gap-2.5">
                        <span
                          className="text-[18px] leading-[1.1] text-black"
                          style={{ width: PROGRESS_BAR_TOTAL_WIDTH }}
                        >
                          {exercise.name}{" "}
                          <span className="text-black/50">{percent}%</span>
                        </span>

                        <div
                          className="relative overflow-hidden rounded-[3px]"
                          style={{
                            width: PROGRESS_BAR_TOTAL_WIDTH,
                            height: 6,
                            backgroundColor: PROGRESS_BAR_BG,
                          }}
                          role="progressbar"
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Прогресс: ${exercise.name}`}
                        >
                          {fillWidth > 0 && (
                            <div
                              className="absolute left-0 top-0 h-full rounded-[3px]"
                              style={{
                                width: fillWidth,
                                backgroundColor: PROGRESS_BAR_COLOR,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenProgressAction}
          className="flex w-[320px] items-center justify-center rounded-[46px] bg-[#BCEC30] px-6.5 py-4 text-[18px] leading-[1.1] text-black transition-colors hover:bg-[#C6FF00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BCEC30]/50"
        >
          {hasProgress ? "Обновить свой прогресс" : "Заполнить свой прогресс"}
        </button>
      </div>
    </section>
  );
};
