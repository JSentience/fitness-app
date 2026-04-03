import Image from 'next/image';
import { AddCourseButton } from '../AddCourseButton/AddCourseButton';

type CourseSectionProps = {
  courseId: string;
  initialSelectedCourses: string[];
};

const COURSE_BENEFITS = [
  'проработка всех групп мышц',
  'тренировка суставов',
  'улучшение циркуляции крови',
  'упражнения заряжают бодростью',
  'помогают противостоять стрессам',
];

export const CourseSection = ({ courseId, initialSelectedCourses }: CourseSectionProps) => {
  return (
    <section className="relative -mt-25 mb-8 w-full xl:mt-26 xl:mb-12">
      <div className="relative block h-103.75 w-full xl:hidden">
        <Image
          src="/courses/details/runner-mobile.png"
          alt="Спортсмен"
          width={375}
          height={456}
          sizes="375px"
          className="pointer-events-none absolute left-1/2 -top-7.5 h-auto w-93.75 max-w-none lg:max-xl:w-140 -translate-x-1/2"
          priority
        />
      </div>

      <div className="relative z-10 mx-4 -mt-45 overflow-hidden rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] sm:mx-8 sm:-mt-47 sm:p-8 lg:mx-auto lg:mt-0 lg:min-h-121.5 lg:max-w-290 lg:overflow-visible lg:p-10">
        <div className="flex w-full flex-col gap-7 sm:max-w-125 lg:w-109.25">
          <h2 className="text-[32px] font-medium leading-9.5 text-black sm:text-[44px] sm:leading-13 lg:text-6xl lg:leading-17.5">
            Начните путь к&nbsp;новому телу
          </h2>
          <ul className="list-outside list-disc pl-7.5 text-lg leading-snug text-black/60 sm:text-xl lg:text-2xl lg:leading-7">
            {COURSE_BENEFITS.map((benefit, index) => (
              <li key={benefit} className={index === COURSE_BENEFITS.length - 1 ? 'pb-0' : 'pb-1'}>
                {benefit}
              </li>
            ))}
          </ul>
          <AddCourseButton courseId={courseId} initialSelectedCourses={initialSelectedCourses} />
        </div>

        <div className="pointer-events-none absolute -right-17.5 -top-26.25 z-20 hidden h-162.5 w-217.5 rounded-md xl:block">
          <Image
            src="/courses/details/runner.png"
            alt="Спортсмен"
            fill
            sizes="(max-width: 1024px) 0px, 740px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};
