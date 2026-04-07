'use client';

import { getErrorMessage } from '@/lib/error-utils';
import { useEffect, useState } from 'react';

import {
  getCourseProgressClient,
  getWorkoutByIdClient,
  getWorkoutProgressClient,
  saveWorkoutProgressClient,
} from '@/lib/client-workouts-api';
import { getCourseById } from '@/lib/courses-api';
import { type Workout, type WorkoutProgress } from '@/lib/workouts-api';
import type { Course } from '@/types/course.types';
import type { ProgressValueMap } from '../workout-page.types';
import { getCourseProgressPercent, loadSavedProgress, saveProgress } from '../workoutProgress';
import {
  buildWorkoutProgressValues,
  createEmptyWorkoutState,
  createInitialHasProgress,
} from './workout-hook.utils';

type UseActiveWorkoutArgs = {
  courseId: string | null;
  currentCourse: Course | null;
  initialProgressData?: number[] | null;
  initialWorkout?: Workout | null;
  workoutId: string | null;
  isAuthorized: boolean;
};

type SaveWorkoutResult = {
  saved: true;
  courseId?: string;
  progress?: number;
} | null;

export function useActiveWorkout({
  courseId,
  currentCourse,
  initialProgressData = null,
  initialWorkout = null,
  workoutId,
  isAuthorized,
}: UseActiveWorkoutArgs) {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(initialWorkout);
  const [isLoadingActiveWorkout, setIsLoadingActiveWorkout] = useState(false);
  const [activeWorkoutError, setActiveWorkoutError] = useState('');
  const [progressValues, setProgressValues] = useState<ProgressValueMap>({});
  const [hasProgress, setHasProgress] = useState(createInitialHasProgress(initialProgressData));
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [saveProgressError, setSaveProgressError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadWorkout = async () => {
      if (!isAuthorized || !workoutId) {
        if (isMounted && !initialWorkout) {
          const emptyState = createEmptyWorkoutState();
          setActiveWorkout(emptyState.activeWorkout);
          setActiveWorkoutError(emptyState.activeWorkoutError);
          setIsLoadingActiveWorkout(emptyState.isLoadingActiveWorkout);
          setProgressValues(emptyState.progressValues);
          setSaveProgressError(emptyState.saveProgressError);
        }
        return;
      }

      const hasInitialWorkout = Boolean(initialWorkout) && initialWorkout?._id === workoutId;
      const hasInitialProgress =
        Array.isArray(initialProgressData) && initialProgressData.length > 0;

      setIsLoadingActiveWorkout(!hasInitialWorkout);
      setActiveWorkoutError('');

      try {
        const workout = hasInitialWorkout ? initialWorkout : await getWorkoutByIdClient(workoutId);

        const serverProgress: WorkoutProgress | null = courseId
          ? hasInitialProgress
            ? {
                workoutId,
                workoutCompleted: false,
                progressData: initialProgressData ?? [],
              }
            : await getWorkoutProgressClient(courseId, workoutId).catch(() => null)
          : null;

        if (!isMounted || !workout) return;

        setActiveWorkout(workout);

        const saved = loadSavedProgress(workoutId);
        const nextProgressState = buildWorkoutProgressValues({
          savedProgress: saved,
          serverProgress,
          workout,
        });

        setProgressValues(nextProgressState.progressValues);
        setHasProgress(
          nextProgressState.hasServerProgress || Object.values(saved).some((value) => value !== ''),
        );
      } catch (error) {
        if (!isMounted) return;

        setActiveWorkout(null);
        setProgressValues({});
        setActiveWorkoutError(getErrorMessage(error, 'Не удалось загрузить тренировку'));
      } finally {
        if (isMounted) {
          setIsLoadingActiveWorkout(false);
        }
      }
    };

    void loadWorkout();

    return () => {
      isMounted = false;
    };
  }, [courseId, initialProgressData, initialWorkout, isAuthorized, workoutId]);

  const updateProgressValue = (exerciseId: string, value: string) => {
    const normalizedValue = value.replace(/[^\d]/g, '');

    setProgressValues((prev) => ({
      ...prev,
      [exerciseId]: normalizedValue,
    }));
  };

  const saveCurrentProgress = async (): Promise<SaveWorkoutResult> => {
    if (!workoutId) {
      return null;
    }

    saveProgress(workoutId, progressValues);
    setHasProgress(true);

    if (!(isAuthorized && courseId && activeWorkout)) {
      setSaveProgressError('');
      return { saved: true };
    }

    setIsSavingProgress(true);
    setSaveProgressError('');

    try {
      const progressData = activeWorkout.exercises.map((exercise) => {
        const raw = progressValues[exercise._id] ?? '';
        const parsed = parseInt(raw, 10);

        return isNaN(parsed) || parsed < 0 ? 0 : parsed;
      });

      await saveWorkoutProgressClient(courseId, workoutId, progressData);

      const updatedProgress = await getCourseProgressClient(courseId).catch(() => null);
      const courseForTotal = currentCourse ?? (await getCourseById(courseId).catch(() => null));
      const totalWorkouts = courseForTotal?.workouts.length ?? 0;

      if (!totalWorkouts) {
        return {
          saved: true,
          courseId,
        };
      }

      return {
        saved: true,
        courseId,
        progress: getCourseProgressPercent(totalWorkouts, updatedProgress),
      };
    } catch (error) {
      setSaveProgressError(getErrorMessage(error, 'Не удалось сохранить прогресс на сервере'));
      return null;
    } finally {
      setIsSavingProgress(false);
    }
  };

  return {
    activeWorkout,
    activeWorkoutError,
    hasProgress,
    isLoadingActiveWorkout,
    isSavingProgress,
    progressValues,
    saveCurrentProgress,
    saveProgressError,
    setSaveProgressError,
    updateProgressValue,
  };
}
