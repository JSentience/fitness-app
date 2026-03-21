"use client";

import { useEffect, useState } from "react";

import { getCourseById } from "@/lib/courses-api";
import { ClientApiError } from "@/lib/client-api";
import {
  getCourseProgressClient,
  getCourseWorkoutsClient,
} from "@/lib/client-workouts-api";
import { removeUserCourseClient } from "@/lib/client-user-courses";
import type { Course } from "@/types/course.types";

import type {
  ProfileCourseState,
  WorkoutListItem,
} from "../workout-page.types";
import { getCourseProgressPercent } from "../workoutProgress";

type CourseWorkoutsResult = {
  completedWorkoutIds: Set<string>;
  items: WorkoutListItem[];
};

type UseWorkoutCoursesArgs = {
  selectedCourseIds: string[];
  isAuthorized: boolean;
  onSelectedCoursesChange: (selectedCourseIds: string[]) => void;
};

export function useWorkoutCourses({
  selectedCourseIds,
  isAuthorized,
  onSelectedCoursesChange,
}: UseWorkoutCoursesArgs) {
  const [courses, setCourses] = useState<ProfileCourseState[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [courseProgressMap, setCourseProgressMap] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      if (!selectedCourseIds.length) {
        if (isMounted) {
          setCourses([]);
          setCoursesError("");
          setCourseProgressMap({});
          setIsLoadingCourses(false);
        }
        return;
      }

      setIsLoadingCourses(true);
      setCoursesError("");

      try {
        const loadedCourses = await Promise.all(
          selectedCourseIds.map((courseId) => getCourseById(courseId)),
        );

        const progressEntries = isAuthorized
          ? await Promise.all(
              loadedCourses.map(async (course) => {
                const progress = await getCourseProgressClient(course._id).catch(
                  () => null,
                );

                return [
                  course._id,
                  getCourseProgressPercent(course.workouts.length, progress),
                ] as const;
              }),
            )
          : [];

        if (!isMounted) return;

        setCourseProgressMap(
          progressEntries.reduce<Record<string, number>>((acc, [id, value]) => {
            acc[id] = value;
            return acc;
          }, {}),
        );

        setCourses(
          loadedCourses.map((course) => ({
            course,
            isRemoving: false,
            error: "",
          })),
        );
      } catch (error) {
        if (!isMounted) return;

        setCourses([]);
        setCourseProgressMap({});
        setCoursesError(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить ваши курсы",
        );
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, [isAuthorized, selectedCourseIds]);

  const removeCourse = async (courseId: string) => {
    if (!isAuthorized) return;

    setCourses((prev) =>
      prev.map((item) =>
        item.course._id === courseId
          ? { ...item, isRemoving: true, error: "" }
          : item,
      ),
    );

    try {
      await removeUserCourseClient(courseId);
    } catch (error) {
      const isAlreadyGone =
        error instanceof ClientApiError &&
        /не был добавлен|not found|not added/i.test(error.message);

      if (!isAlreadyGone) {
        setCourses((prev) =>
          prev.map((item) =>
            item.course._id === courseId
              ? {
                  ...item,
                  isRemoving: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Не удалось удалить курс",
                }
              : item,
          ),
        );
        return;
      }
    }

    setCourses((prev) => prev.filter((item) => item.course._id !== courseId));
    setCourseProgressMap((prev) => {
      const next = { ...prev };
      delete next[courseId];
      return next;
    });
    onSelectedCoursesChange(selectedCourseIds.filter((id) => id !== courseId));
  };

  const loadCourseWorkouts = async (
    course: Course,
  ): Promise<CourseWorkoutsResult> => {
    if (!isAuthorized) {
      return {
        completedWorkoutIds: new Set(),
        items: [],
      };
    }

    const [workouts, courseProgress] = await Promise.all([
      getCourseWorkoutsClient(course._id),
      getCourseProgressClient(course._id).catch(() => null),
    ]);

    return {
      completedWorkoutIds: new Set(
        (courseProgress?.workoutsProgress ?? [])
          .filter((workoutProgress) => workoutProgress.workoutCompleted)
          .map((workoutProgress) => workoutProgress.workoutId),
      ),
      items: workouts.map((workout, index) => ({
        _id: workout._id,
        name: workout.name,
        dayIndex: index,
      })),
    };
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourseProgressMap((prev) => ({
      ...prev,
      [courseId]: progress,
    }));
  };

  return {
    courseProgressMap,
    courses,
    coursesError,
    isLoadingCourses,
    loadCourseWorkouts,
    removeCourse,
    updateCourseProgress,
  };
}
