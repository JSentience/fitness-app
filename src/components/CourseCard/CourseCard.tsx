import { getCourseImage } from "@/lib/courseImages";
import { Course } from "@/types";
import Image from "next/image";

type CourseCardProps = Omit<
  Course,
  "_id" | "description" | "directions" | "fitting" | "workouts"
>;

export const CourseCard = ({
  nameRU,
  nameEN,
  durationInDays,
  dailyDurationInMinutes,
  difficulty,
}: CourseCardProps) => {
  const image = getCourseImage(nameEN);

  return (
    <div className="relative flex flex-col items-center gap-6 pb-3.75 bg-white rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] overflow-hidden w-90">
      {/* Course image */}
      <div className="relative w-full h-81.25">
        <Image
          src={image}
          alt={nameRU}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 w-75">
        {/* Title */}
        <h3 className="text-[32px] font-medium leading-[1.1] text-black">
          {nameRU}
        </h3>

        {/* Tags */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex gap-1.5 w-full">
            {/* Days badge */}
            <div className="flex items-center gap-1.5 p-2.5 bg-[#F7F7F7] rounded-[50px]">
              <Image
                src="/images/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
              />
              <span className="text-[16px] text-[#202020] leading-[1.1] whitespace-nowrap">
                {durationInDays} дней
              </span>
            </div>

            {/* Time badge */}
            <div className="flex items-center gap-1.5 p-2.5 bg-[#F7F7F7] rounded-[50px]">
              <Image src="/images/time.svg" alt="time" width={18} height={18} />
              <span className="text-[16px] text-[#202020] leading-[1.1] whitespace-nowrap">
                {dailyDurationInMinutes.from}-{dailyDurationInMinutes.to}{" "}
                мин/день
              </span>
            </div>
          </div>

          <div className="flex gap-1.5 w-full">
            {/* Difficulty badge */}
            <div className="flex items-center gap-1.5 p-2.5 bg-[#F7F7F7] rounded-[50px]">
              <Image
                src="/images/signal.svg"
                alt="difficulty"
                width={18}
                height={18}
              />
              <span className="text-[16px] text-[#202020] leading-[1.1] whitespace-nowrap">
                {difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add button */}
      <button className="absolute top-5 right-5" aria-label="Добавить курс">
        <Image
          src="/images/add-in-circle.svg"
          alt="add"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
};
