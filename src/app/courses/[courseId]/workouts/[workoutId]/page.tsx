import { getCourseById } from "@/lib/courses-api";
import {
  getWorkoutById,
  getWorkoutProgress,
  type Workout,
} from "@/lib/workouts-api";
import { cookies } from "next/headers";

import { WorkoutLessonClient } from "./WorkoutLessonClient";

type WorkoutLessonPageProps = {
  params: Promise<{
    courseId: string;
    workoutId: string;
  }>;
};

export default async function WorkoutLessonPage({
  params,
}: WorkoutLessonPageProps) {
  const { courseId, workoutId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("fitness-auth-token")?.value;

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
