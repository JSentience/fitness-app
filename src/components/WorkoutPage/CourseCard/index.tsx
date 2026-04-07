import { BodyText } from '@/components/BodyText/BodyText';
import { Button } from '@/components/Button/Button';
import { ControlButton } from '@/components/ControlButton/ControlButton';
import { CourseMetaBadge } from '@/components/CourseMetaBadge/CourseMetaBadge';
import { CoursePreviewImage } from '@/components/CoursePreviewImage/CoursePreviewImage';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';

import { getCourseMetaBadges } from '@/lib/course-meta';
import type { Course } from '@/types/course.types';

type CourseCardProps = {
  course: Course;
  imagePriority?: boolean;
  isRemoving: boolean;
  progress?: number; // 0–100
  onSelectAction: (course: Course) => void;
  onRemoveAction: (courseId: string) => void;
};

const PROGRESS_BAR_WIDTH = 300;
const PROGRESS_BAR_COLOR = '#00C1FF';
const PROGRESS_BAR_BG = '#F7F7F7';

export const CourseCard = ({
  course,
  imagePriority = false,
  isRemoving,
  progress = 0,
  onSelectAction,
  onRemoveAction,
}: CourseCardProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const fillWidth = Math.round((clampedProgress / 100) * PROGRESS_BAR_WIDTH);
  const [daysBadge, timeBadge, difficultyBadge] = getCourseMetaBadges(course);

  return (
    <article className="relative flex w-90 flex-col items-center gap-6 overflow-hidden rounded-[30px] bg-white pb-3.75 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
      {/* ── Course image ── */}
      <ControlButton
        onClick={() => onSelectAction(course)}
        className="relative block h-81.25 w-full shrink-0 overflow-hidden rounded-[30px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BCEC30] focus-visible:ring-inset"
        tabIndex={-1}
      >
        <CoursePreviewImage
          nameEN={course.nameEN}
          nameRU={course.nameRU}
          imageSizes="360px"
          priority={imagePriority}
          wrapperClassName="relative h-full w-full"
        />
      </ControlButton>

      {/* ── Body ── */}
      <div className="flex w-75 flex-col gap-10">
        <div className="flex w-full flex-col gap-5">
          {/* Course name */}
          <SectionTitle as="h3">{course.nameRU}</SectionTitle>

          {/* ── Meta tags ── */}
          <div className="flex flex-col gap-1.5">
            {/* Row 1: days + time */}
            <div className="flex flex-wrap gap-1.5">
              <CourseMetaBadge
                icon={daysBadge.icon}
                iconAlt={daysBadge.iconAlt}
                iconAriaHidden
                label={daysBadge.label}
              />
              <CourseMetaBadge
                icon={timeBadge.icon}
                iconAlt={timeBadge.iconAlt}
                iconAriaHidden
                label={timeBadge.label}
              />
            </div>

            {/* Row 2: difficulty */}
            <div className="flex flex-wrap gap-1.5">
              <CourseMetaBadge
                icon={difficultyBadge.icon}
                iconAlt={difficultyBadge.iconAlt}
                iconAriaHidden
                label={difficultyBadge.label}
              />
            </div>
          </div>

          {/* ── Progress ── */}
          <div className="flex flex-col gap-2.5">
            <BodyText as="span">
              Прогресс <span className="text-black/50">{clampedProgress}%</span>
            </BodyText>

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
        <Button
          onClick={() => onSelectAction(course)}
          className="flex w-full items-center justify-center"
        >
          Продолжить
        </Button>
      </div>

      {/* ── Remove button ── */}
      <ControlButton
        onClick={() => onRemoveAction(course._id)}
        disabled={isRemoving}
        className="absolute right-5 top-5 z-10 rounded-full transition-transform hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/80"
        aria-label={isRemoving ? 'Удаляем курс…' : 'Удалить курс'}
        title={isRemoving ? 'Удаляем курс…' : 'Удалить курс'}
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
      </ControlButton>
    </article>
  );
};
