"use client";

import type { Exercise } from "@/lib/workouts-api";

type ProgressValueMap = Record<string, string>;

type ProgressModalProps = {
  isOpen: boolean;
  title: string;
  exercises: Exercise[];
  progressValues: ProgressValueMap;
  isSaving?: boolean;
  saveError?: string;
  onCloseAction: () => void;
  onSubmitAction: () => void;
  onProgressChangeAction: (exerciseId: string, value: string) => void;
};

export const ProgressModal = ({
  isOpen,
  title,
  exercises,
  progressValues,
  isSaving = false,
  saveError = "",
  onCloseAction,
  onSubmitAction,
  onProgressChangeAction,
}: ProgressModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      onClick={onCloseAction}
    >
      <div
        className="flex w-full max-w-[343px] flex-col items-center gap-8.5 rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="w-full font-['StratosSkyeng'] text-[32px] leading-[1.1] text-black">
          {title}
        </h2>

        <div className="flex w-full flex-col items-center gap-8.5">
          <div className="flex w-full flex-col gap-5">
            {exercises.map((exercise) => (
              <div key={exercise._id} className="flex w-full flex-col gap-2.5">
                <label
                  htmlFor={`progress-${exercise._id}`}
                  className="text-[18px] leading-[1.1] text-black"
                >
                  Сколько раз вы сделали {exercise.name.toLowerCase()}?
                </label>
                <input
                  id={`progress-${exercise._id}`}
                  type="text"
                  inputMode="numeric"
                  value={progressValues[exercise._id] ?? ""}
                  onChange={(event) =>
                    onProgressChangeAction(exercise._id, event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-[#D0CECE] px-4.5 py-4 text-[18px] leading-[1.1] text-black outline-none transition-colors placeholder:text-[#D0CECE] focus:border-black"
                />
              </div>
            ))}
          </div>

          {saveError && (
            <p className="w-full text-[14px] leading-[1.2] text-[#DB0030]">
              {saveError}
            </p>
          )}

          <button
            type="button"
            onClick={onSubmitAction}
            disabled={isSaving}
            className="w-full rounded-[46px] bg-[#BCEC30] px-6.5 py-4 text-[18px] leading-[1.1] text-black transition-colors hover:bg-[#C6FF00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BCEC30]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
};
