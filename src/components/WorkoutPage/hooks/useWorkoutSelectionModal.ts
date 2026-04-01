'use client';

import { getErrorMessage } from '@/lib/error-utils';
import { notify } from '@/lib/notify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Course } from '@/types/course.types';
import type { WorkoutListItem } from '../workout-page.types';

type LoadCourseWorkouts = (course: Course) => Promise<{
  completedWorkoutIds: Set<string>;
  items: WorkoutListItem[];
}>;

type UseWorkoutSelectionModalArgs = {
  loadCourseWorkoutsAction: LoadCourseWorkouts;
};

export function useWorkoutSelectionModal({
  loadCourseWorkoutsAction,
}: UseWorkoutSelectionModalArgs) {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectModalWorkouts, setSelectModalWorkouts] = useState<WorkoutListItem[]>([]);
  const [selectModalCourseName, setSelectModalCourseName] = useState('');
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<Set<string>>(new Set());
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);

  const openWorkoutSelection = async (course: Course) => {
    setSelectedCourseId(course._id);
    setSelectModalCourseName(course.nameRU);
    setIsLoadingWorkouts(true);

    try {
      const { completedWorkoutIds, items } = await loadCourseWorkoutsAction(course);
      setCompletedWorkoutIds(completedWorkoutIds);
      setSelectModalWorkouts(items);
      setIsSelectModalOpen(true);
    } catch (error) {
      notify.error(getErrorMessage(error, 'Не удалось загрузить тренировки курса'));
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const closeWorkoutSelection = () => {
    setIsSelectModalOpen(false);
  };

  const startSelectedWorkout = (workoutId: string) => {
    if (!selectedCourseId) {
      return;
    }

    closeWorkoutSelection();
    router.push(`/courses/${selectedCourseId}/workouts/${workoutId}`);
  };

  return {
    closeWorkoutSelection,
    completedWorkoutIds,
    isLoadingWorkouts,
    isSelectModalOpen,
    openWorkoutSelection,
    selectModalCourseName,
    selectModalWorkouts,
    startSelectedWorkout,
  };
}
