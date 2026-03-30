import { BackToTopBtn } from '@/components/BackToTopBtn/BackToTopBtn';
import { CourseCard } from '@/components/CourseCard/CourseCard';
import { getCourses } from '@/lib/courses-api';
import Image from 'next/image';

export async function CoursesList() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-white">
      <section className="px-4 pb-12 pt-6 md:px-35 md:pb-12.5 md:pt-4.25">
        <div className="relative md:min-h-30">
          <h1 className="max-w-236.75 text-[32px] font-medium leading-[1.1] text-black md:text-[60px] md:leading-none">
            Начните заниматься спортом
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>и улучшите качество жизни
          </h1>

          <Image
            src="/courses/main-green.png"
            alt="Главный зеленый элемент"
            width={288}
            height={120}
            className="hidden xl:block md:absolute md:right-0 md:top-0 md:mt-0"
            priority
          />
        </div>
      </section>

      <section className="px-4 pb-20 md:px-35">
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-10">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              _id={course._id}
              nameRU={course.nameRU}
              nameEN={course.nameEN}
              durationInDays={course.durationInDays}
              dailyDurationInMinutes={course.dailyDurationInMinutes}
              difficulty={course.difficulty}
            />
          ))}
        </div>
      </section>

      <div className="flex justify-center pb-15">
        <BackToTopBtn />
      </div>
    </main>
  );
}

