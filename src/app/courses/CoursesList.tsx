import { BackToTopBtn } from "@/components/BackToTopBtn/BackToTopBtn";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import { getCourses } from "@/lib/courses-api";

export async function CoursesList() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-white">
      <section className="px-4 pb-15 pt-25 md:px-35">
        <h1 className="text-[32px] font-medium leading-[1.1em] text-black md:max-w-59 md:text-[60px] md:leading-[1em]">
          Начните заниматься спортом и улучшите качество жизни
        </h1>
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
