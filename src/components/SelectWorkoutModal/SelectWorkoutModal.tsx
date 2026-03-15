"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type WorkoutItem = {
  _id: string;
  name: string;
  dayIndex?: number;
};

type SelectWorkoutModalProps = {
  isOpen: boolean;
  title?: string;
  courseName?: string;
  workouts: WorkoutItem[];
  completedWorkoutIds?: Set<string>;
  onCloseAction: () => void;
  onStartAction: (workoutId: string) => void;
};

export const SelectWorkoutModal = ({
  isOpen,
  title = "Выберите тренировку",
  courseName,
  workouts,
  completedWorkoutIds = new Set(),
  onCloseAction,
  onStartAction,
}: SelectWorkoutModalProps) => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

  const effectiveSelectedWorkoutId = useMemo(() => {
    if (!isOpen) {
      return "";
    }

    if (
      selectedWorkoutId &&
      workouts.some((workout) => workout._id === selectedWorkoutId)
    ) {
      return selectedWorkoutId;
    }

    return workouts[0]?._id ?? "";
  }, [isOpen, selectedWorkoutId, workouts]);

  const selectedWorkout = useMemo(
    () =>
      workouts.find((workout) => workout._id === effectiveSelectedWorkoutId) ??
      null,
    [effectiveSelectedWorkoutId, workouts],
  );

  const handleBackdropClick = () => {
    onCloseAction();
  };

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };

  const handleStartClick = () => {
    if (!effectiveSelectedWorkoutId) return;
    onStartAction(effectiveSelectedWorkoutId);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      onClick={handleBackdropClick}
    >
      <div
        className="flex w-full max-w-115 flex-col items-center gap-12 rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="w-full text-left font-['StratosSkyeng'] text-[32px] leading-[1.1] text-black">
          {title}
        </h2>

        <div className="flex w-full flex-col gap-8.5">
          <div className="flex w-full flex-col gap-2.5">
            {workouts.map((workout, index) => {
              const isSelected = workout._id === effectiveSelectedWorkoutId;
              const dayNumber =
                workout.dayIndex !== undefined
                  ? workout.dayIndex + 1
                  : index + 1;
              const subtitle = courseName
                ? `${courseName} / ${dayNumber} день`
                : `${dayNumber} день`;

              const isCompleted = completedWorkoutIds.has(workout._id);

              return (
                <div key={workout._id} className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectWorkout(workout._id)}
                    className="flex w-full items-center gap-2.5 text-left"
                  >
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                      {isCompleted ? (
                        /* Зелёная галочка — тренировка выполнена */
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Тренировка выполнена"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            fill="#58CC5B"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.9134 16.1459L17.4134 9.64594L15.8866 8.35406L11.1373 13.9669L8.40258 10.8415L6.89742 12.1585L10.3974 16.1585C10.5892 16.3777 10.867 16.5024 11.1583 16.5C11.4495 16.4976 11.7253 16.3683 11.9134 16.1459Z"
                            fill="white"
                          />
                        </svg>
                      ) : isSelected ? (
                        <Image
                          src="/icons/check-in-circle-selected.svg"
                          alt="Выбрано"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM11.9134 16.1459L17.4134 9.64594L15.8866 8.35406L11.1373 13.9669L8.40258 10.8415L6.89742 12.1585L10.3974 16.1585C10.5892 16.3777 10.867 16.5024 11.1583 16.5C11.4495 16.4976 11.7253 16.3683 11.9134 16.1459Z"
                            fill="#C4C4C4"
                          />
                        </svg>
                      )}
                    </span>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[24px] leading-[1.1] text-black">
                        {workout.name}
                      </span>
                      <span className="text-[16px] leading-[1.1] text-black">
                        {subtitle}
                      </span>
                    </div>
                  </button>

                  <div
                    className="h-px w-full bg-[#C4C4C4]"
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleStartClick}
            disabled={!selectedWorkout}
            className="w-full rounded-[46px] bg-[#BCEC30] px-6.5 py-4 text-[18px] leading-[1.1] text-black transition-colors hover:bg-[#C6FF00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Начать
          </button>
        </div>
      </div>
    </div>
  );
};
