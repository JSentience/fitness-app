import type { WorkoutProgress } from '@/lib/workouts-api';
import type { ProgressValueMap } from '../workout-page.types';

type WorkoutExercise = {
  _id: string;
};

type WorkoutLike = {
  exercises: WorkoutExercise[];
};

export function createEmptyWorkoutCoursesState() {
  return {
    courseProgressMap: {} as Record<string, number>,
    courses: [],
    coursesError: '',
    isLoadingCourses: false,
  };
}

export function buildCourseProgressMap(
  progressEntries: ReadonlyArray<readonly [string, number]>,
): Record<string, number> {
  return progressEntries.reduce<Record<string, number>>((acc, [id, value]) => {
    acc[id] = value;
    return acc;
  }, {});
}

export function createInitialHasProgress(initialProgressData?: number[] | null): boolean {
  return (initialProgressData ?? []).some((value) => value > 0);
}

export function buildWorkoutProgressValues({
  savedProgress,
  serverProgress,
  workout,
}: {
  savedProgress: ProgressValueMap;
  serverProgress: WorkoutProgress | null;
  workout: WorkoutLike;
}): {
  hasServerProgress: boolean;
  progressValues: ProgressValueMap;
} {
  let hasServerProgress = false;

  const progressValues = workout.exercises.reduce<ProgressValueMap>((acc, exercise, index) => {
    const serverValue = serverProgress?.progressData[index];

    if (serverValue !== undefined && serverValue > 0) {
      acc[exercise._id] = String(serverValue);
      hasServerProgress = true;
    } else {
      acc[exercise._id] = savedProgress[exercise._id] ?? '';
    }

    return acc;
  }, {});

  return {
    hasServerProgress,
    progressValues,
  };
}

export function createEmptyWorkoutState() {
  return {
    activeWorkout: null,
    activeWorkoutError: '',
    isLoadingActiveWorkout: false,
    progressValues: {} as ProgressValueMap,
    saveProgressError: '',
  };
}
