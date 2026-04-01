import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';

import type { Course } from '@/types/course.types';

const mockGetCourseProgressClient = jest.fn<(courseId: string) => Promise<unknown>>();
const mockGetWorkoutByIdClient = jest.fn<(workoutId: string) => Promise<unknown>>();
const mockGetWorkoutProgressClient =
  jest.fn<(courseId: string, workoutId: string) => Promise<unknown>>();
const mockSaveWorkoutProgressClient =
  jest.fn<(courseId: string, workoutId: string, progressData: number[]) => Promise<{ ok: true }>>();
const mockGetCourseById = jest.fn<(courseId: string) => Promise<Course>>();
let useActiveWorkout: typeof import('./useActiveWorkout').useActiveWorkout;

jest.mock('@/lib/client-workouts-api', () => ({
  getCourseProgressClient: (courseId: string) => mockGetCourseProgressClient(courseId),
  getWorkoutByIdClient: (workoutId: string) => mockGetWorkoutByIdClient(workoutId),
  getWorkoutProgressClient: (courseId: string, workoutId: string) =>
    mockGetWorkoutProgressClient(courseId, workoutId),
  saveWorkoutProgressClient: (courseId: string, workoutId: string, progressData: number[]) =>
    mockSaveWorkoutProgressClient(courseId, workoutId, progressData),
}));

jest.mock('@/lib/courses-api', () => ({
  getCourseById: (courseId: string) => mockGetCourseById(courseId),
}));

const workout = {
  _id: 'workout-1',
  name: 'Утренняя тренировка',
  video: 'video.mp4',
  exercises: [
    { _id: 'exercise-1', name: 'Приседания', quantity: 10 },
    { _id: 'exercise-2', name: 'Отжимания', quantity: 15 },
  ],
};

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: overrides._id ?? 'course-1',
    _id: overrides._id ?? 'course-1',
    nameRU: 'Фитнес',
    nameEN: 'fitness',
    description: 'Описание',
    directions: ['Сила'],
    fitting: ['Новички'],
    difficulty: 'easy',
    durationInDays: 7,
    dailyDurationInMinutes: {
      from: 15,
      to: 25,
    },
    workouts: ['workout-1', 'workout-2'],
    ...overrides,
  };
}

describe('useActiveWorkout', () => {
  beforeAll(async () => {
    ({ useActiveWorkout } = await import('./useActiveWorkout'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('инициализирует progressValues из initial data и очищает ввод до цифр', async () => {
    const initialProgressData = [12, 0];

    const { result } = renderHook(() =>
      useActiveWorkout({
        courseId: 'course-1',
        currentCourse: null,
        initialProgressData,
        initialWorkout: workout,
        isAuthorized: true,
        workoutId: 'workout-1',
      }),
    );

    await waitFor(() => {
      expect(result.current.progressValues).toEqual({
        'exercise-1': '12',
        'exercise-2': '',
      });
    });

    act(() => {
      result.current.updateProgressValue('exercise-2', '3a0');
    });

    expect(result.current.progressValues['exercise-2']).toBe('30');
    expect(result.current.hasProgress).toBe(true);
    expect(mockGetWorkoutByIdClient).not.toHaveBeenCalled();
    expect(mockGetWorkoutProgressClient).not.toHaveBeenCalled();
  });

  it('сохраняет прогресс только локально, если пользователь не авторизован', async () => {
    const { result } = renderHook(() =>
      useActiveWorkout({
        courseId: 'course-1',
        currentCourse: null,
        initialWorkout: workout,
        isAuthorized: false,
        workoutId: 'workout-1',
      }),
    );

    act(() => {
      result.current.updateProgressValue('exercise-1', '22');
    });

    let saveResult: Awaited<ReturnType<typeof result.current.saveCurrentProgress>> = null;

    await act(async () => {
      saveResult = await result.current.saveCurrentProgress();
    });

    expect(saveResult).toEqual({ saved: true });
    expect(result.current.hasProgress).toBe(true);
    expect(mockSaveWorkoutProgressClient).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('fitness-workout-progress-workout-1')).toBe(
      JSON.stringify({
        'exercise-1': '22',
      }),
    );
  });

  it('сохраняет нормализованный progressData на сервер и возвращает общий прогресс курса', async () => {
    const currentCourse = createCourse();

    mockGetWorkoutProgressClient.mockResolvedValue(null);
    mockSaveWorkoutProgressClient.mockResolvedValue({ ok: true });
    mockGetCourseProgressClient.mockResolvedValue({
      courseId: 'course-1',
      courseCompleted: false,
      workoutsProgress: [
        {
          workoutId: 'workout-1',
          workoutCompleted: true,
          progressData: [15, 0],
        },
      ],
    });

    const { result } = renderHook(() =>
      useActiveWorkout({
        courseId: 'course-1',
        currentCourse,
        initialWorkout: workout,
        isAuthorized: true,
        workoutId: 'workout-1',
      }),
    );

    await waitFor(() => {
      expect(result.current.activeWorkout?._id).toBe('workout-1');
    });

    act(() => {
      result.current.updateProgressValue('exercise-1', '15');
      result.current.updateProgressValue('exercise-2', 'abc');
    });

    let saveResult: Awaited<ReturnType<typeof result.current.saveCurrentProgress>> = null;

    await act(async () => {
      saveResult = await result.current.saveCurrentProgress();
    });

    expect(mockSaveWorkoutProgressClient).toHaveBeenCalledWith('course-1', 'workout-1', [15, 0]);
    expect(saveResult).toEqual({
      saved: true,
      courseId: 'course-1',
      progress: 50,
    });
    expect(result.current.saveProgressError).toBe('');
    expect(mockGetCourseById).not.toHaveBeenCalled();
  });
});
