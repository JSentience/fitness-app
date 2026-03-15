import { redirect } from "next/navigation";

type LegacyWorkoutPageProps = {
  searchParams?: Promise<{
    courseId?: string;
    workoutId?: string;
  }>;
};

export default async function LegacyWorkoutPage({
  searchParams,
}: LegacyWorkoutPageProps) {
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
