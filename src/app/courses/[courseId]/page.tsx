import { CourseSection } from '@/components/CourseSection/CourseSection';
import { getCurrentUserServer } from '@/lib/auth-api';
import { getCourseImage, getCourseSkillImage } from '@/lib/courseImages';
import { getCourseById } from '@/lib/courses-api';
import { AUTH_COOKIE_NAME } from '@/lib/server-auth';
import type { PageWithParamsProps } from '@/types/page-props.types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

  return (
    <main className="flex min-h-screen  flex-col gap-6 bg-white py-10 md:gap-15 md:px-35 md:py-15">
      <div className="h-97.25 rounded-[30px] p-4  md:h-77.5">
        <div className="relative h-full shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)] overflow-hidden rounded-[30px] ">
          <Image
            src={mobileCourseImage}
            alt={course.nameRU}
            fill
            sizes="(max-width: 768px) calc(100vw - 2rem), calc(100vw - 17.5rem)"
            className="object-cover object-center md:hidden"
            priority
          />
          <Image
            src={courseCardImage}
            alt={course.nameRU}
            fill
            sizes="(max-width: 768px) calc(100vw - 2rem), calc(100vw - 17.5rem)"
            className="hidden object-cover object-right md:block"
            priority
          />
        </div>
      </div>

      <section className="flex flex-col gap-6 px-4 md:gap-10">
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
                  'linear-gradient(152deg, rgba(21, 23, 32, 1) 17%, rgba(30, 33, 46, 1) 100%)',
              }}
            >
              <span
                className="shrink-0 text-[75px] font-medium leading-[1.35]"
                style={{ color: '#BCEC30' }}
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

      <section className="flex flex-col gap-6 px-4 lg:px-0 md:px-0 md:gap-10">
        <h2 className="text-[24px] font-medium leading-[1.1] text-black md:text-[40px] md:font-semibold">
          Направления
        </h2>

        <div className="mt-6 md:mt-10 w-full rounded-[28px] bg-[#BCEC30] p-7 flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-x-[124px] md:gap-y-[34px]">
          <div className="flex flex-col gap-6 md:flex-row  md:gap-31 ">
            {directionsColumns.map((column, columnIndex) => (
              <div
                key={`${course._id}-direction-column-${columnIndex}`}
                className="flex w-71 flex-col gap-6 md:gap-8.5"
              >
                {column.map((direction) => (
                  <div key={direction} className="flex min-w-0 items-center gap-2">
                    <Image src="/icons/sparkle.svg" alt="" width={26} height={26} />
                    <span className="text-[18px] font-normal leading-[1.1] text-black 2xl:text-[24px]">
                      {direction}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CourseSection courseId={course._id} initialSelectedCourses={initialSelectedCourses} />
    </main>
  );
}
