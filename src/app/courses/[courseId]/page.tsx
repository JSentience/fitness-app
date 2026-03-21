import { AddCourseButton } from "@/components/AddCourseButton/AddCourseButton";
import { getCurrentUserServer } from "@/lib/auth-api";
import { getCourseImage, getCourseSkillImage } from "@/lib/courseImages";
import { getCourseById } from "@/lib/courses-api";
import { AUTH_COOKIE_NAME } from "@/lib/server-auth";
import type { PageWithParamsProps } from "@/types/page-props.types";
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

export default async function CourseDetailsPage({
  params,
}: PageWithParamsProps<{
  courseId: string;
}>) {
  const { courseId } = await params;

  let course;

  try {
    course = await getCourseById(courseId);
  } catch {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
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
      <div
        className="relative h-[389px] overflow-hidden rounded-[30px] shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] md:h-77.5"
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

      <section className="relative h-120  md:rounded-[30px] md:px-10 md:py-10 lg:min-h-[640px] lg:px-15 lg:py-12 md:bg-linear-to-r from-white to-white lg:bg-white bg-linear-to-r from-white to-[#F9F9F9]">
        <div className="">
          <div className="absolute inset-x-0 top-[102px] rounded-[30px] bg-white shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] md:h-[486px]" />

          <div className="pointer-events-none hidden  absolute top-[-150px] lg:top-0 h-[710px] w-[560px] lg:right-[12px] lg:w-[740px] md:block lg:block">
            <Image
              src="/courses/details/runner.png"
              alt="Спортсмен"
              fill
              className="object-contain object-top-right"
              priority
            />
          </div>
          <div className="pointer-events-none block lg:hidden md:hidden  absolute right-[-60px] top-[-130px] h-[455px] w-[482px] ">
            <Image
              src="/courses/details/runner-mobile.png"
              alt="Спортсмен"
              fill
              className="object-contain object-top"
              priority
            />
          </div>

          <div className="absolute left-0 rounded-[30px] bg-white lg:left-10 top-[142px] z-10 flex w-[343px] lg:w-[437px] flex-col items-start gap-7 ">
            <h2 className="lg:text-[60px] text-[32px] font-medium leading-none text-black">
              Начните путь <br />к новому телу
            </h2>

            <ul className="flex flex-col gap-0 opacity-60">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="ml-9 list-disc text-[18px] lg:text-[24px] font-normal leading-[1.1] text-black"
                  style={{
                    marginBottom:
                      benefit === benefits[benefits.length - 1] ? 0 : 12,
                  }}
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
        </div>
      </section>
    </main>
  );
}
