import { CourseDirectionsSection } from '@/components/CourseDetails/CourseDirectionsSection';
import { CourseFittingSection } from '@/components/CourseDetails/CourseFittingSection';
import { CourseHero } from '@/components/CourseDetails/CourseHero';
import { CourseSection } from '@/components/CourseSection/CourseSection';
import { resolveOrFallback, resolveOrNull } from '@/lib/async-utils';
import { getCurrentUserServer } from '@/lib/auth-api';
import { getCourseById } from '@/lib/courses-api';
import { AUTH_COOKIE_NAME } from '@/lib/server-auth';
import type { PageWithParamsProps } from '@/types/page-props.types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CourseDetailsPage({
  params,
}: PageWithParamsProps<{
  courseId: string;
}>) {
  const { courseId } = await params;
  const course = await resolveOrNull(() => getCourseById(courseId));

  if (!course) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const initialSelectedCourses = token
    ? await resolveOrFallback(
        () => getCurrentUserServer(token).then((user) => user.selectedCourses),
        [],
      )
    : [];

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-white py-10 md:gap-15 md:px-35 md:py-15">
      <CourseHero course={course} />
      <CourseFittingSection fitting={course.fitting} />
      <CourseDirectionsSection directions={course.directions} />
      <CourseSection courseId={course._id} initialSelectedCourses={initialSelectedCourses} />
    </main>
  );
}
