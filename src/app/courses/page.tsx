import { redirect } from "next/navigation";

import { CoursesList } from "./CoursesList";

type CoursesPageProps = {
  searchParams?: Promise<{
    courseId?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : undefined;

  if (resolvedSearchParams?.courseId) {
    redirect(`/courses/${resolvedSearchParams.courseId}`);
  }

  return <CoursesList />;
}
