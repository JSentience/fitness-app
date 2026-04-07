import { resolveRemoveCourseMutation } from '@/lib/client-course-mutation';
import { removeUserCourseClient } from '@/lib/client-user-courses';
import { getCourseProgressClient, getCourseWorkoutsClient } from '@/lib/client-workouts-api';
import { normalizeCourseId } from '@/lib/course-membership';
import { getErrorMessage } from '@/lib/error-utils';
import { notify } from '@/lib/notify';

import { getCourseById } from '@/lib/courses-api';
import type { Course } from '@/types/course.types';
import { useEffect, useState } from 'react';

import type { ProfileCourseState, WorkoutListItem } from '../workout-page.types';
import { getCourseProgressPercent } from '../workoutProgress';
import { buildCourseProgressMap, createEmptyWorkoutCoursesState } from './workout-hook.utils';

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
  const [coursesError, setCoursesError] = useState('');
  const [courseProgressMap, setCourseProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      if (!selectedCourseIds.length) {
        if (isMounted) {
          const emptyState = createEmptyWorkoutCoursesState();
          setCourses(emptyState.courses);
          setCoursesError(emptyState.coursesError);
          setCourseProgressMap(emptyState.courseProgressMap);
          setIsLoadingCourses(emptyState.isLoadingCourses);
        }
        return;
      }

      setIsLoadingCourses(true);
      setCoursesError('');

      try {
        const loadedCourses = await Promise.all(
          selectedCourseIds.map((courseId) => getCourseById(courseId)),
        );

        const progressEntries = isAuthorized
          ? await Promise.all(
              loadedCourses.map(async (course) => {
                const progress = await getCourseProgressClient(course._id).catch(() => null);

                return [
                  course._id,
                  getCourseProgressPercent(course.workouts.length, progress),
                ] as const;
              }),
            )
          : [];

        if (!isMounted) return;

        setCourseProgressMap(buildCourseProgressMap(progressEntries));

        setCourses(
          loadedCourses.map((course) => ({
            course,
            isRemoving: false,
          })),
        );
      } catch (error) {
        if (!isMounted) return;

        setCourses([]);
        setCourseProgressMap({});
        setCoursesError(getErrorMessage(error, 'Не удалось загрузить ваши курсы'));
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

    const normalizedCourseId = normalizeCourseId(courseId);

    setCourses((prev) =>
      prev.map((item) =>
        item.course._id === normalizedCourseId ? { ...item, isRemoving: true } : item,
      ),
    );

    let removalMessage: (() => void) | null = null;
    let nextSelectedCourseIds: string[] | null = null;

    try {
      const response = await removeUserCourseClient(normalizedCourseId);
      const mutation = resolveRemoveCourseMutation(selectedCourseIds, normalizedCourseId, response);

      if (!mutation) {
        setCourses((prev) =>
          prev.map((item) =>
            item.course._id === normalizedCourseId ? { ...item, isRemoving: false } : item,
          ),
        );
        return;
      }

      nextSelectedCourseIds = mutation.nextSelectedCourses;
      removalMessage = mutation.wasAlreadyApplied
        ? notify.courseAlreadyRemoved
        : notify.courseRemoved;
    } catch (error) {
      notify.error(getErrorMessage(error, 'Не удалось удалить курс'));
      setCourses((prev) =>
        prev.map((item) =>
          item.course._id === normalizedCourseId ? { ...item, isRemoving: false } : item,
        ),
      );
      return;
    }

    setCourses((prev) => prev.filter((item) => item.course._id !== normalizedCourseId));
    setCourseProgressMap((prev) => {
      const next = { ...prev };
      delete next[normalizedCourseId];
      return next;
    });
    onSelectedCoursesChange(nextSelectedCourseIds ?? selectedCourseIds);
    removalMessage?.();
  };

  const loadCourseWorkouts = async (course: Course): Promise<CourseWorkoutsResult> => {
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
