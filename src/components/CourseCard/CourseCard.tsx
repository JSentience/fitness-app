'use client';

import { ControlButton } from '@/components/ControlButton/ControlButton';
import { CourseMetaBadge } from '@/components/CourseMetaBadge/CourseMetaBadge';
import { CoursePreviewImage } from '@/components/CoursePreviewImage/CoursePreviewImage';
import { resolveAddCourseMutation } from '@/lib/client-course-mutation';
import { addUserCourseClient } from '@/lib/client-user-courses';
import { hasCourseId, normalizeCourseId } from '@/lib/course-membership';
import { getCourseMetaBadges } from '@/lib/course-meta';
import { getErrorMessage } from '@/lib/error-utils';
import { notify } from '@/lib/notify';
import { useAuthStore } from '@/store/auth.store';
import { Course } from '@/types/course.types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

type CourseCardProps = Pick<
  Course,
  'nameRU' | 'nameEN' | 'durationInDays' | 'dailyDurationInMinutes' | 'difficulty'
> & {
  courseId: string;
  imagePriority?: boolean;
};

export const CourseCard = ({
  courseId,
  nameRU,
  nameEN,
  durationInDays,
  dailyDurationInMinutes,
  difficulty,
  imagePriority = false,
}: CourseCardProps) => {
  const { isAuthorized, openAuthModal, selectedCourses, setSelectedCourses } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const normalizedCourseId = normalizeCourseId(courseId);
  const courseMetaBadges = getCourseMetaBadges({
    durationInDays,
    dailyDurationInMinutes,
    difficulty,
  });

  const isAdded = useMemo(() => {
    return hasCourseId(selectedCourses, normalizedCourseId);
  }, [selectedCourses, normalizedCourseId]);
  const courseHref = normalizedCourseId ? `/courses/${normalizedCourseId}` : '/courses';
  const addButtonLabel = !normalizedCourseId
    ? 'Курс временно недоступен'
    : isAdded
      ? 'Курс уже добавлен'
      : 'Добавить курс';

  const handleAddCourse = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isAdded || isAdding) {
      return;
    }

    if (!normalizedCourseId) {
      notify.error('Не удалось определить идентификатор курса.');
      return;
    }

    if (!isAuthorized) {
      openAuthModal();
      return;
    }

    setIsAdding(true);

    try {
      const response = await addUserCourseClient(normalizedCourseId);
      const mutation = resolveAddCourseMutation(selectedCourses, normalizedCourseId, response);

      if (!mutation) {
        return;
      }

      setSelectedCourses(mutation.nextSelectedCourses);

      if (mutation.wasAlreadyApplied) {
        notify.courseAlreadyAdded();
      } else {
        notify.courseAdded();
      }
    } catch (error) {
      notify.error(getErrorMessage(error, 'Не удалось добавить курс'));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      href={courseHref}
      className="group relative flex w-full max-w-85.75 flex-col items-center gap-6 overflow-hidden rounded-[30px] bg-white pb-3.75 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BCEC30] focus-visible:ring-offset-2 md:max-w-90"
    >
      <CoursePreviewImage
        nameEN={nameEN}
        nameRU={nameRU}
        imageSizes="(max-width: 768px) 100vw, 360px"
        priority={imagePriority}
        wrapperClassName="relative h-81.25 w-full overflow-hidden rounded-[30px] md:h-81.25"
      />

      <div className="flex w-75 flex-col gap-5">
        <h3 className="text-[24px] md:text-[32px] font-medium leading-[1.1] text-black">
          {nameRU}
        </h3>

        <div className="flex w-full flex-col gap-1.5">
          {courseMetaBadges.map((badge) => (
            <CourseMetaBadge
              key={badge.key}
              icon={badge.icon}
              iconAlt={badge.iconAlt}
              label={badge.label}
            />
          ))}
        </div>
      </div>

      <ControlButton
        onClick={handleAddCourse}
        disabled={isAdded || isAdding || !normalizedCourseId}
        className="absolute top-5 right-5 z-10 disabled:cursor-default disabled:opacity-70"
        aria-label={addButtonLabel}
      >
        <Image
          src="/icons/add-in-circle.svg"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 md:w-8 md:h-8"
        />
      </ControlButton>
    </Link>
  );
};
