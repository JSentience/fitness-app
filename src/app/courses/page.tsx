import { redirect } from "next/navigation";
import type { PageWithSearchParamsProps } from "@/types/page-props.types";

import { CoursesList } from "./CoursesList";

export default async function CoursesPage({
  searchParams,
}: PageWithSearchParamsProps<{
  courseId?: string;
}>) {
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : undefined;

  if (resolvedSearchParams?.courseId) {
    redirect(`/courses/${resolvedSearchParams.courseId}`);
  }

  return <CoursesList />;
}
