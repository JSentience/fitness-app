import Image from "next/image";

import { getCourseImage } from "@/lib/courseImages";
import { getDifficultyIcon, normalizeDifficultyLabel } from "@/lib/difficulty";
import type { Course } from "@/types/course.types";

type CourseCardProps = {
  course: Course;
  isRemoving: boolean;
  error: string;
  progress?: number; // 0–100
  onSelectAction: (course: Course) => void;
  onRemoveAction: (courseId: string) => void;
};

const PROGRESS_BAR_WIDTH = 300;
const PROGRESS_BAR_COLOR = "#00C1FF";
const PROGRESS_BAR_BG = "#F7F7F7";

export const CourseCard = ({
  course,
  isRemoving,
  error,
  progress = 0,
  onSelectAction,
  onRemoveAction,
}: CourseCardProps) => {
  const previewImage = getCourseImage(course.nameEN);

  const clampedProgress = Math.min(100, Math.max(0, progress));
  const fillWidth = Math.round((clampedProgress / 100) * PROGRESS_BAR_WIDTH);

  const timeLabel = `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`;
  const daysLabel = `${course.durationInDays} дней`;
  const difficultyLabel = normalizeDifficultyLabel(course.difficulty);
  const difficultyIcon = getDifficultyIcon(course.difficulty);

  return (
    <article className="relative flex w-90 flex-col items-center gap-6 overflow-hidden rounded-[30px] bg-white pb-3.75 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
      {/* ── Course image ── */}
      <button
        type="button"
        onClick={() => onSelectAction(course)}
        className="relative block h-81.25 w-full shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BCEC30] focus-visible:ring-inset"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={previewImage}
          alt={course.nameRU}
          fill
          className="object-cover"
          priority
        />
      </button>

      {/* ── Body ── */}
      <div className="flex w-75 flex-col gap-10">
        <div className="flex w-full flex-col gap-5">
          {/* Course name */}
          <h3 className="font-['StratosSkyeng'] text-[32px] leading-[1.1] text-black">
            {course.nameRU}
          </h3>

          {/* ── Meta tags ── */}
          <div className="flex flex-col gap-1.5">
            {/* Row 1: days + time */}
            <div className="flex flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5 rounded-[50px] bg-[#F7F7F7] p-2.5">
                <Image
                  src="/icons/calendar.svg"
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap text-[16px] leading-[1.1] text-[#202020]">
                  {daysLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-[50px] bg-[#F7F7F7] p-2.5">
                <Image
                  src="/icons/time.svg"
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap text-[16px] leading-[1.1] text-[#202020]">
                  {timeLabel}
                </span>
              </div>
            </div>

            {/* Row 2: difficulty */}
            <div className="flex flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5 rounded-[50px] bg-[#F7F7F7] p-2.5">
                <Image
                  src={difficultyIcon}
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap text-[16px] leading-[1.1] text-[#202020]">
                  {difficultyLabel}
                </span>
              </div>
            </div>
          </div>

          {/* ── Progress ── */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[18px] leading-[1.1] text-black">
              Прогресс <span className="text-black/50">{clampedProgress}%</span>
            </span>

            <div
              className="relative overflow-hidden rounded-[3px]"
              style={{
                width: PROGRESS_BAR_WIDTH,
                height: 6,
                backgroundColor: PROGRESS_BAR_BG,
              }}
              role="progressbar"
              aria-valuenow={clampedProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Прогресс по курсу ${course.nameRU}`}
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
        </div>

        {/* ── CTA button ── */}
        <button
          type="button"
          onClick={() => onSelectAction(course)}
          className="flex w-full items-center justify-center rounded-[46px] bg-[#BCEC30] px-6.5 py-4 text-[18px] leading-[1.1] text-black transition-colors hover:bg-[#C6FF00] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          Продолжить
        </button>

        {error && (
          <p className="text-[14px] leading-[1.1] text-[#DB0030]">{error}</p>
        )}
      </div>

      {/* ── Remove button ── */}
      <button
        type="button"
        onClick={() => onRemoveAction(course._id)}
        disabled={isRemoving}
        className="absolute right-5 top-5 z-10 rounded-full transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={isRemoving ? "Удаляем курс…" : "Удалить курс"}
        title={isRemoving ? "Удаляем курс…" : "Удалить курс"}
      >
        {isRemoving ? (
          /* Spinning ring while removing */
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90">
            <svg
              className="h-5 w-5 animate-spin text-black/40"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        ) : (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.9998 29.3333C23.3636 29.3333 29.3332 23.3638 29.3332 16C29.3332 8.63616 23.3636 2.66663 15.9998 2.66663C8.63604 2.66663 2.6665 8.63616 2.6665 16C2.6665 23.3638 8.63604 29.3333 15.9998 29.3333ZM9.33317 14.6666V17.3333H22.6665V14.6666H9.33317Z"
              fill="white"
            />
          </svg>
        )}
      </button>
    </article>
  );
};
