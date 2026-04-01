import type { CourseProgress } from '@/lib/workouts-api';
import type { ProgressValueMap } from './workout-page.types';

function getProgressStorageKey(workoutId: string): string {
  return `fitness-workout-progress-${workoutId}`;
}

export function loadSavedProgress(workoutId: string): ProgressValueMap {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(getProgressStorageKey(workoutId));

    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const result: ProgressValueMap = {};

    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'string') {
        result[key] = value;
      }
    }

    return result;
  } catch {
    return {};
  }
}

export function saveProgress(workoutId: string, progress: ProgressValueMap): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getProgressStorageKey(workoutId), JSON.stringify(progress));
  } catch {}
}

export function getCourseProgressPercent(
  totalWorkouts: number,
  progress: CourseProgress | null,
): number {
  if (!totalWorkouts) return 0;

  const completed =
    progress?.workoutsProgress?.filter((item) => {
      if (item.workoutCompleted) {
        return true;
      }

      return Array.isArray(item.progressData)
        ? item.progressData.some((value) => value > 0)
        : false;
    }).length ?? 0;

  return Math.round((completed / totalWorkouts) * 100);
}

export function getExerciseProgressPercent(
  exerciseId: string,
  quantity: number,
  progressValues: ProgressValueMap,
): number {
  const rawValue = progressValues[exerciseId];

  if (!rawValue || quantity <= 0) {
    return 0;
  }

  const parsedValue = parseInt(rawValue, 10);

  if (isNaN(parsedValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((parsedValue / quantity) * 100)));
}
