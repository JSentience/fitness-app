'use client';

import { Button } from '@/components/Button/Button';
import {
  resolveAddCourseMutation,
  resolveRemoveCourseMutation,
} from '@/lib/client-course-mutation';
import { addUserCourseClient, removeUserCourseClient } from '@/lib/client-user-courses';
import { hasCourseId, normalizeCourseId } from '@/lib/course-membership';
import { getErrorMessage } from '@/lib/error-utils';
import { notify } from '@/lib/notify';
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
    hasHydratedUser,
    isAuthorized,
    openAuthModal,
    selectedCourses,
    setSelectedCourses: syncSelectedCourses,
  } = useAuthStore();

  const normalizedCourseId = normalizeCourseId(courseId);
  const effectiveSelectedCourses = hasHydratedUser ? selectedCourses : initialSelectedCourses;
  const [isLoading, setIsLoading] = useState(false);

  const isAdded = useMemo(() => {
    return hasCourseId(effectiveSelectedCourses, normalizedCourseId);
  }, [effectiveSelectedCourses, normalizedCourseId]);

  const handleClick = async () => {
    if (!isAuthorized) {
      openAuthModal();
      return;
    }

    if (!normalizedCourseId) {
      notify.error('Не удалось определить идентификатор курса.');
      return;
    }

    setIsLoading(true);

    try {
      if (isAdded) {
        const response = await removeUserCourseClient(normalizedCourseId);
        const mutation = resolveRemoveCourseMutation(
          effectiveSelectedCourses,
          normalizedCourseId,
          response,
        );

        if (!mutation) {
          return;
        }

        syncSelectedCourses(mutation.nextSelectedCourses);

        if (mutation.wasAlreadyApplied) {
          notify.courseAlreadyRemoved();
        } else {
          notify.courseRemoved();
        }
      } else {
        const response = await addUserCourseClient(normalizedCourseId);
        const mutation = resolveAddCourseMutation(
          effectiveSelectedCourses,
          normalizedCourseId,
          response,
        );

        if (!mutation) {
          return;
        }

        syncSelectedCourses(mutation.nextSelectedCourses);

        if (mutation.wasAlreadyApplied) {
          notify.courseAlreadyAdded();
        } else {
          notify.courseAdded();
        }
      }
    } catch (error) {
      notify.error(getErrorMessage(error, 'Не удалось изменить состояние курса.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center text-center text-[16px] font-normal md:w-92.5 md:text-[18px]"
      >
        {isLoading
          ? 'Сохраняем...'
          : !isAuthorized
            ? 'Войдите, чтобы добавить курс'
            : isAdded
              ? 'Удалить курс'
              : 'Добавить курс'}
      </Button>
    </div>
  );
};
