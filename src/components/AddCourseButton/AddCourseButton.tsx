"use client";

import {
  ApiError,
  addUserCourse,
  removeUserCourse,
} from "@/lib/user-courses-api";
import { useAuthStore } from "@/store/auth.store";
import { useMemo, useState } from "react";

type AddCourseButtonProps = {
  courseId: string;
  initialSelectedCourses?: string[];
};

export const AddCourseButton = ({
  courseId,
  initialSelectedCourses = [],
}: AddCourseButtonProps) => {
  const {
    token,
    isAuthorized,
    openAuthModal,
    selectedCourses,
    setSelectedCourses: syncSelectedCourses,
  } = useAuthStore();

  const effectiveSelectedCourses =
    selectedCourses.length > 0 ? selectedCourses : initialSelectedCourses;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdded = useMemo(
    () => effectiveSelectedCourses.includes(courseId),
    [effectiveSelectedCourses, courseId],
  );

  const handleClick = async () => {
    const normalizedCourseId = courseId.trim();

    if (!isAuthorized || !token) {
      openAuthModal();
      return;
    }

    if (!normalizedCourseId) {
      setError("Не удалось определить идентификатор курса.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isAdded) {
        await removeUserCourse(normalizedCourseId, token);
        const nextSelectedCourses = effectiveSelectedCourses.filter(
          (id) => id !== normalizedCourseId,
        );
        syncSelectedCourses(nextSelectedCourses);
      } else {
        try {
          await addUserCourse(normalizedCourseId, token);
        } catch (err) {
          if (
            err instanceof ApiError &&
            /курс уже добавлен|курс уже был добавлен/i.test(err.message)
          ) {
            const nextSelectedCourses = effectiveSelectedCourses.includes(
              normalizedCourseId,
            )
              ? effectiveSelectedCourses
              : [...effectiveSelectedCourses, normalizedCourseId];
            syncSelectedCourses(nextSelectedCourses);
            return;
          }

          throw err;
        }

        const nextSelectedCourses = effectiveSelectedCourses.includes(
          normalizedCourseId,
        )
          ? effectiveSelectedCourses
          : [...effectiveSelectedCourses, normalizedCourseId];
        syncSelectedCourses(nextSelectedCourses);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          `Не удалось изменить состояние курса (courseId: ${normalizedCourseId}, status: ${err.status}). ${err.message}`,
        );
      } else if (err instanceof Error) {
        setError(
          `Не удалось изменить состояние курса (courseId: ${normalizedCourseId}). ${err.message}`,
        );
      } else {
        setError(
          `Не удалось изменить состояние курса (courseId: ${normalizedCourseId}).`,
        );
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
        className="flex items-center justify-center px-6.5 py-4 rounded-[46px] text-[16px] md:text-[18px] font-normal leading-[1.1] text-black w-full md:w-92.5 bg-[#BCEC30] transition-colors hover:bg-[#C6FF00] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading
          ? "Сохраняем..."
          : !isAuthorized
            ? "Войдите, чтобы добавить курс"
            : isAdded
              ? "Удалить курс"
              : "Добавить курс"}
      </button>

      {error && (
        <p className="text-[14px] leading-[1.1] text-[#DB0030]">{error}</p>
      )}
    </div>
  );
};
