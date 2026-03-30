'use client';

import { addUserCourseClient, removeUserCourseClient } from '@/lib/client-user-courses';
import { useAuthStore } from '@/store/auth.store';
import { useMemo, useState } from 'react';

type AddCourseButtonProps = {
  courseId: string;
  initialSelectedCourses?: string[];
};

export const AddCourseButton = ({
  courseId,
  initialSelectedCourses = [],
}: AddCourseButtonProps) => {
  const {
    isAuthorized,
    openAuthModal,
    selectedCourses,
    setSelectedCourses: syncSelectedCourses,
  } = useAuthStore();

  const effectiveSelectedCourses =
    selectedCourses.length > 0 ? selectedCourses : initialSelectedCourses;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdded = useMemo(
    () => effectiveSelectedCourses.includes(courseId),
    [effectiveSelectedCourses, courseId],
  );

  const handleClick = async () => {
    const normalizedCourseId = courseId.trim();

    if (!isAuthorized) {
      openAuthModal();
      return;
    }

    if (!normalizedCourseId) {
      setError('Не удалось определить идентификатор курса.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isAdded) {
        const response = await removeUserCourseClient(normalizedCourseId);
        const shouldRemoveCourse =
          response.courseState === undefined ||
          response.courseState === 'removed' ||
          response.courseState === 'not-added';

        if (shouldRemoveCourse) {
          const nextSelectedCourses = effectiveSelectedCourses.filter(
            (id) => id !== normalizedCourseId,
          );
          syncSelectedCourses(nextSelectedCourses);
        }
      } else {
        const response = await addUserCourseClient(normalizedCourseId);
        const shouldAddCourse =
          response.courseState === undefined ||
          response.courseState === 'added' ||
          response.courseState === 'already-added';

        if (shouldAddCourse) {
          const nextSelectedCourses = effectiveSelectedCourses.includes(normalizedCourseId)
            ? effectiveSelectedCourses
            : [...effectiveSelectedCourses, normalizedCourseId];
          syncSelectedCourses(nextSelectedCourses);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        const statusSuffix =
          'status' in err && typeof err.status === 'number' ? `, status: ${err.status}` : '';

        setError(
          `Не удалось изменить состояние курса (courseId: ${normalizedCourseId}${statusSuffix}). ${err.message}`,
        );
      } else {
        setError(`Не удалось изменить состояние курса (courseId: ${normalizedCourseId}).`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-[46px] bg-[#BCEC30] px-[26px] py-4 text-center text-[16px] font-normal leading-[1.1] text-black transition-colors hover:bg-[#C6FF00] disabled:cursor-not-allowed disabled:opacity-60 md:w-92.5 md:px-6.5 md:text-[18px]"
      >
        {isLoading
          ? 'Сохраняем...'
          : !isAuthorized
            ? 'Войдите, чтобы добавить курс'
            : isAdded
              ? 'Удалить курс'
              : 'Добавить курс'}
      </button>

      {error && <p className="text-[14px] leading-[1.1] text-[#DB0030]">{error}</p>}
    </div>
  );
};
