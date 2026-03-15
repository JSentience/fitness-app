"use client";

import { getCourseImage } from "@/lib/courseImages";
import { getDifficultyIcon, normalizeDifficultyLabel } from "@/lib/difficulty";
import { ApiError, addUserCourse } from "@/lib/user-courses-api";
import { useAuthStore } from "@/store/auth.store";
import { Course } from "@/types/course.type";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type CourseCardProps = Pick<
  Course,
  | "_id"
  | "nameRU"
  | "nameEN"
  | "durationInDays"
  | "dailyDurationInMinutes"
  | "difficulty"
>;

export const CourseCard = ({
  _id,
  nameRU,
  nameEN,
  durationInDays,
  dailyDurationInMinutes,
  difficulty,
}: CourseCardProps) => {
  const image = getCourseImage(nameEN);
  const {
    token,
    isAuthorized,
    openAuthModal,
    selectedCourses,
    setSelectedCourses,
  } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const isAdded = useMemo(
    () => selectedCourses.includes(_id),
    [selectedCourses, _id],
  );

  const handleAddCourse = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isAdded || isAdding) {
      return;
    }

    if (!isAuthorized || !token) {
      openAuthModal();
      return;
    }

    setIsAdding(true);
    setError("");

    try {
      try {
        await addUserCourse(_id, token);
      } catch (err) {
        if (
          !(err instanceof ApiError) ||
          !/курс уже добавлен|курс уже был добавлен/i.test(err.message)
        ) {
          throw err;
        }
      }

      const nextSelectedCourses = selectedCourses.includes(_id)
        ? selectedCourses
        : [...selectedCourses, _id];

      setSelectedCourses(nextSelectedCourses);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не удалось добавить курс");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      href={`/courses/${_id}`}
      className="group relative flex flex-col items-center gap-6 pb-3.75 bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] overflow-hidden w-full max-w-[343px] md:w-90 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BCEC30] focus-visible:ring-offset-2"
    >
      <div className="relative w-full h-[325px] md:h-81.25">
        <Image
          src={image}
          alt={nameRU}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-5 w-75">
        <h3 className="text-[24px] md:text-[32px] font-medium leading-[1.1] text-black">
          {nameRU}
        </h3>

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center gap-1.5 p-2.5 bg-[#F7F7F7] rounded-[50px]">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={18}
              height={18}
            />
            <span className="text-[16px] text-[#202020] leading-[1.1] whitespace-nowrap">
              {durationInDays} дней
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-2.5 bg-[#F7F7F7] rounded-[50px]">
            <Image src="/icons/time.svg" alt="time" width={18} height={18} />
            <span className="text-[16px] text-[#202020] leading-[1.1] whitespace-nowrap">
              {dailyDurationInMinutes.from}-{dailyDurationInMinutes.to} мин/день
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-2.5 bg-[#F7F7F7] rounded-[50px]">
            <Image
              src={getDifficultyIcon(difficulty)}
              alt="difficulty"
              width={18}
              height={18}
            />
            <span className="text-[16px] text-[#202020] leading-[1.1] whitespace-nowrap">
              {normalizeDifficultyLabel(difficulty)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddCourse}
        disabled={isAdded || isAdding}
        className="absolute top-5 right-5 z-10 disabled:cursor-default disabled:opacity-70"
        aria-label={isAdded ? "Курс уже добавлен" : "Добавить курс"}
      >
        <Image
          src="/icons/add-in-circle.svg"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 md:w-[32px] md:h-[32px]"
        />
      </button>

      {error && (
        <span className="px-4 md:px-7.5 text-[14px] leading-[1.1] text-[#DB0030]">
          {error}
        </span>
      )}
    </Link>
  );
};
