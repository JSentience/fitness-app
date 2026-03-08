import { BackToTopBtn } from "@/components/BackToTopBtn/BackToTopBtn";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import { Course } from "@/types";

const courses: Course[] = [
  {
    _id: "1",
    nameRU: "Йога",
    nameEN: "Yoga",
    description: "",
    directions: [],
    fitting: [],
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: "Сложность",
    workouts: [],
  },
  {
    _id: "2",
    nameRU: "Степ-аэробика",
    nameEN: "Step aerobics",
    description: "",
    directions: [],
    fitting: [],
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: "Сложность",
    workouts: [],
  },
  {
    _id: "3",
    nameRU: "Стретчинг",
    nameEN: "Stretching",
    description: "",
    directions: [],
    fitting: [],
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: "Сложность",
    workouts: [],
  },
  {
    _id: "4",
    nameRU: "Бодифлекс",
    nameEN: "Bodyflex",
    description: "",
    directions: [],
    fitting: [],
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: "Сложность",
    workouts: [],
  },
  {
    _id: "5",
    nameRU: "Фитнес",
    nameEN: "Fitness",
    description: "",
    directions: [],
    fitting: [],
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: "Сложность",
    workouts: [],
  },
];

export default function Home() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen">
      {/* Hero section */}
      <section className="px-35 pt-25 pb-15">
        <div className="flex items-start justify-between">
          <h1 className="text-[60px] font-medium leading-[1em] text-black max-w-59">
            Начните заниматься спортом
            <br />и улучшите качество жизни
          </h1>

          {/* Speech bubble */}
          <div className="relative mt-2">
            <div className="bg-[#BCEC30] rounded-[5px] px-5 py-4">
              <p className="text-[32px] leading-[1.1] text-[#202020]">
                Измени своё
                <br />
                тело за полгода!
              </p>
            </div>
            {/* Triangle */}
            <div
              className="absolute -bottom-8.75 right-7.5 w-0 h-0"
              style={{
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                borderTop: "35px solid #BCEC30",
              }}
            />
          </div>
        </div>
      </section>

      {/* Course cards grid */}
      <section className="px-35 pb-20">
        <div className="flex flex-wrap gap-10">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
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
