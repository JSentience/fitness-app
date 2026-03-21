import { getCourseById } from "@/lib/courses-api";
import { AUTH_COOKIE_NAME } from "@/lib/server-auth";
import {
  getWorkoutById,
  getWorkoutProgress,
  type Workout,
} from "@/lib/workouts-api";
import type { PageWithParamsProps } from "@/types/page-props.types";
import { cookies } from "next/headers";

import { WorkoutLessonClient } from "./WorkoutLessonClient";

export default async function WorkoutLessonPage({
  params,
}: PageWithParamsProps<{
  courseId: string;
  workoutId: string;
}>) {
  const { courseId, workoutId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  let initialWorkout: Workout | null = null;
  let initialProgressData: number[] | null = null;
  let initialCourseName = "";

  try {
    const course = await getCourseById(courseId);
    initialCourseName = course.nameRU;
  } catch {
    initialCourseName = "";
  }

  if (token) {
    try {
      initialWorkout = await getWorkoutById(workoutId, token);
    } catch {
      initialWorkout = null;
    }

    try {
      const progress = await getWorkoutProgress(courseId, workoutId, token);

      if (progress?.progressData) {
        initialProgressData = progress.progressData;
      }
    } catch {
      initialProgressData = null;
    }
  }

  return (
    <WorkoutLessonClient
      courseId={courseId}
      workoutId={workoutId}
      initialWorkout={initialWorkout}
      initialProgressData={initialProgressData}
      initialCourseName={initialCourseName}
    />
  );
}
