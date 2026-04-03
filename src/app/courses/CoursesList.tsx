import { BackToTopBtn } from '@/components/BackToTopBtn/BackToTopBtn';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { resolveOrNull } from '@/lib/async-utils';
import { resolveCourseId } from '@/lib/course-membership';
import { getCourses } from '@/lib/courses-api';
import Image from 'next/image';

export async function CoursesList() {
  const resolvedCourses = await resolveOrNull(() => getCourses());
  const courses = resolvedCourses ?? [];
  const hasCoursesLoadError = resolvedCourses === null;

  return (
    <main className="min-h-screen bg-white">
      <section className="px-4 pb-12 pt-6 md:px-35 md:pb-12.5 md:pt-4.25">
        <div className="relative md:min-h-30">
          <h1 className="max-w-236.75 text-[32px] font-medium leading-[1.1] text-black md:text-[60px] md:leading-none">
            Начните заниматься спортом
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>и улучшите качество жизни
          </h1>

          <div className="relative hidden w-[288px] max-w-full aspect-12/5 xl:block md:absolute md:right-0 md:top-0 md:mt-0">
            <Image
              src="/courses/main-green.png"
              alt="Главный зеленый элемент"
              fill
              sizes="288px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-35">
        {hasCoursesLoadError ? (
          <div className="max-w-160 rounded-[30px] bg-[#F7F7F7] px-6 py-8 md:px-10 md:py-10">
            <h2 className="text-[24px] font-medium leading-[1.1] text-black md:text-[32px]">
              Каталог курсов временно недоступен
            </h2>
            <p className="mt-4 max-w-110 text-[18px] leading-tight text-[#565EEF]">
              Не удалось получить данные с внешнего API. Обновите страницу немного позже.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center lg:max-xl:justify-center gap-6 lg:flex-row lg:flex-wrap lg:gap-10">
            {courses.map((course, index) => {
              const courseId = resolveCourseId(course._id, course.id);

              return (
                <CourseCard
                  key={courseId || course.nameEN}
                  courseId={courseId}
                  nameRU={course.nameRU}
                  nameEN={course.nameEN}
                  durationInDays={course.durationInDays}
                  dailyDurationInMinutes={course.dailyDurationInMinutes}
                  difficulty={course.difficulty}
                  imagePriority={index < 5}
                />
              );
            })}
          </div>
        )}
      </section>

      <div className="flex justify-center pb-15">
        <BackToTopBtn />
      </div>
    </main>
  );
}
