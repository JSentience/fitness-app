import { redirect } from "next/navigation";
import type { PageWithSearchParamsProps } from "@/types/page-props.types";

export default async function LegacyWorkoutPage({
  searchParams,
}: PageWithSearchParamsProps<{
  courseId?: string;
  workoutId?: string;
}>) {
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : undefined;

  if (resolvedSearchParams?.courseId && resolvedSearchParams?.workoutId) {
    redirect(
      `/courses/${resolvedSearchParams.courseId}/workouts/${resolvedSearchParams.workoutId}`,
    );
  }

  redirect("/profile");
}
