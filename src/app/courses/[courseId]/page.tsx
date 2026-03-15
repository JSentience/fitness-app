import { AddCourseButton } from "@/components/AddCourseButton/AddCourseButton";
import { getCurrentUserServer } from "@/lib/auth-api";
import { getCourseImage, getCourseSkillImage } from "@/lib/courseImages";
import { getCourseById } from "@/lib/courses-api";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const COURSE_TITLES: Record<string, string> = {
  Yoga: "Йога",
  Stretching: "Стретчинг",
  Fitness: "Фитнес",
  BodyFlex: "Бодифлекс",
  StepAirobic: "Степ-аэробика",
};

const COURSE_BANNER_BACKGROUNDS: Record<string, string> = {
  Yoga: "#FFC700",
  Stretching: "#7CFFB2",
  Fitness: "#C7E957",
  BodyFlex: "#A6A6FF",
  StepAirobic: "#BCEC30",
};

const benefits = [
  "проработка всех групп мышц",
  "тренировка суставов",
  "улучшение циркуляции крови",
  "упражнения заряжают бодростью",
  "помогают противостоять стрессам",
];

function splitDirectionsIntoColumns(directions: string[]): string[][] {
  if (directions.length <= 2) return [directions];
  if (directions.length <= 4) {
    return [directions.slice(0, 2), directions.slice(2)];
  }

  return [directions.slice(0, 2), directions.slice(2, 4), directions.slice(4)];
}

type CourseDetailsPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = await params;

  let course;

  try {
    course = await getCourseById(courseId);
  } catch {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("fitness-auth-token")?.value;
  let initialSelectedCourses: string[] = [];

  if (token) {
    try {
      const currentUser = await getCurrentUserServer(token);
      initialSelectedCourses = currentUser.selectedCourses;
    } catch {
      initialSelectedCourses = [];
    }
  }

  const directionsColumns = splitDirectionsIntoColumns(course.directions);
  const courseCardImage = getCourseSkillImage(course.nameEN);
  const mobileCourseImage = getCourseImage(course.nameEN);
  const bannerBackground =
    COURSE_BANNER_BACKGROUNDS[course.nameEN] ?? "#BCEC30";

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-white px-4 py-10 md:gap-15 md:px-35 md:py-15">
      <h1 className="text-[32px] font-medium leading-[1.1em] text-black">
        {COURSE_TITLES[course.nameEN] || course.nameRU}
      </h1>

      <div
        className="relative h-[389px] w-full overflow-hidden rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] md:h-77.5"
        style={{ backgroundColor: bannerBackground }}
      >
        <Image
          src={mobileCourseImage}
          alt={course.nameRU}
          fill
          className="object-cover object-center md:hidden"
          priority
        />
        <Image
          src={courseCardImage}
          alt={course.nameRU}
          fill
          className="hidden object-cover object-right md:block"
          priority
        />
      </div>

      <section className="flex flex-col gap-6 md:gap-10">
        <h2 className="text-[24px] font-medium leading-[1.1] text-black md:text-[40px] md:font-semibold">
          Подойдет для вас, если:
        </h2>

        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-4.25">
          {course.fitting.map((item, index) => (
            <div
              key={`${course._id}-fit-${index}`}
              className="flex min-w-0 flex-1 items-center gap-4 rounded-[28px] p-5 md:gap-6.25"
              style={{
                background:
                  "linear-gradient(152deg, rgba(21, 23, 32, 1) 17%, rgba(30, 33, 46, 1) 100%)",
              }}
            >
              <span
                className="shrink-0 text-[75px] font-medium leading-[1.35]"
                style={{ color: "#BCEC30" }}
              >
                {index + 1}
              </span>
              <p className="text-[18px] font-normal leading-[1.1] text-white md:text-[24px]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 md:gap-10">
        <h2 className="text-[24px] font-medium leading-[1.1] text-black md:text-[40px] md:font-semibold">
          Направления
        </h2>

        <div
          className="w-full rounded-[28px] p-6 md:p-7.5"
          style={{ backgroundColor: "#BCEC30" }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-31">
            {directionsColumns.map((column, columnIndex) => (
              <div
                key={`${course._id}-direction-column-${columnIndex}`}
                className="flex flex-col gap-6 md:gap-8.5"
              >
                {column.map((direction) => (
                  <div
                    key={direction}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <Image
                      src="/icons/sparkle.svg"
                      alt=""
                      width={26}
                      height={26}
                    />
                    <span className="text-[18px] font-normal leading-[1.1] text-black md:text-[24px]">
                      {direction}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[588px] w-full rounded-[30px] bg-transparent md:h-147 md:bg-white md:shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
        <div className="absolute right-0 top-[-150px] z-9 h-140 w-200 pointer-events-none md:right-0 md:top-0 md:h-141.75 md:w-250">
          <Image
            src="/courses/details/course-get.png"
            alt="Спортсмен"
            fill
            className="object-cover object-center md:object-right"
            priority
          />
        </div>

        <div className="absolute bottom-0 ml-auto mr-auto flex w-[437px] flex-col items-center gap-6 rounded-4xl bg-white p-6 z-10 md:gap-7 md:p-0">
          <h2 className="text-[32px] font-medium leading-[1em] text-black md:text-[60px]">
            Начните путь <br />
            к новому телу
          </h2>

          <ul className="flex flex-col gap-0 opacity-60">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="list-inside list-disc text-[18px] font-normal leading-[1.1] text-black md:text-[24px]"
              >
                {benefit}
              </li>
            ))}
          </ul>

          <AddCourseButton
            courseId={course._id}
            initialSelectedCourses={initialSelectedCourses}
          />
        </div>
      </section>
    </main>
  );
}
