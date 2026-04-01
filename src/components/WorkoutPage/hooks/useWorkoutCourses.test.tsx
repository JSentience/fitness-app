import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react';

import type { Course } from '@/types/course.types';

const mockRemoveUserCourseClient = jest.fn<(courseId: string) => Promise<unknown>>();
const mockGetCourseProgressClient = jest.fn<(courseId: string) => Promise<unknown>>();
const mockGetCourseWorkoutsClient = jest.fn<(courseId: string) => Promise<unknown>>();
const mockGetCourseById = jest.fn<(courseId: string) => Promise<Course>>();
const mockCourseRemoved = jest.fn();
const mockCourseAlreadyRemoved = jest.fn();
const mockNotifyError = jest.fn();
let useWorkoutCourses: typeof import('./useWorkoutCourses').useWorkoutCourses;

jest.mock('@/lib/client-user-courses', () => ({
  removeUserCourseClient: (courseId: string) => mockRemoveUserCourseClient(courseId),
}));

jest.mock('@/lib/client-workouts-api', () => ({
  getCourseProgressClient: (courseId: string) => mockGetCourseProgressClient(courseId),
  getCourseWorkoutsClient: (courseId: string) => mockGetCourseWorkoutsClient(courseId),
}));

jest.mock('@/lib/courses-api', () => ({
  getCourseById: (courseId: string) => mockGetCourseById(courseId),
}));

jest.mock('@/lib/notify', () => ({
  notify: {
    courseRemoved: () => mockCourseRemoved(),
    courseAlreadyRemoved: () => mockCourseAlreadyRemoved(),
    error: (message: string) => mockNotifyError(message),
  },
}));

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: overrides._id ?? 'course-1',
    _id: overrides._id ?? 'course-1',
    nameRU: 'Йога',
    nameEN: 'yoga',
    description: 'Описание',
    directions: ['Гибкость'],
    fitting: ['Новички'],
    difficulty: 'easy',
    durationInDays: 10,
    dailyDurationInMinutes: {
      from: 10,
      to: 20,
    },
    workouts: ['workout-1', 'workout-2'],
    ...overrides,
  };
}

describe('useWorkoutCourses', () => {
  beforeAll(async () => {
    ({ useWorkoutCourses } = await import('./useWorkoutCourses'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('загружает курсы и карту прогресса для авторизованного пользователя', async () => {
    const courseOne = createCourse({ _id: 'course-1', workouts: ['w1', 'w2'] });
    const courseTwo = createCourse({
      _id: 'course-2',
      nameRU: 'Стретчинг',
      nameEN: 'stretching',
      workouts: ['w3', 'w4', 'w5'],
    });
    const selectedCourseIds = ['course-1', 'course-2'];

    mockGetCourseById.mockImplementation(async (courseId) =>
      courseId === 'course-1' ? courseOne : courseTwo,
    );
    mockGetCourseProgressClient.mockImplementation(async (courseId) => {
      if (courseId === 'course-1') {
        return {
          courseId,
          courseCompleted: false,
          workoutsProgress: [
            {
              workoutId: 'w1',
              workoutCompleted: true,
              progressData: [10],
            },
          ],
        };
      }

      return null;
    });

    const { result } = renderHook(() =>
      useWorkoutCourses({
        selectedCourseIds,
        isAuthorized: true,
        onSelectedCoursesChange: jest.fn(),
      }),
    );

    await waitFor(() => {
      expect(result.current.courses).toHaveLength(2);
    });

    expect(result.current.courseProgressMap).toEqual({
      'course-1': 50,
      'course-2': 0,
    });
    expect(result.current.courses.map((item) => item.course._id)).toEqual(['course-1', 'course-2']);
    expect(result.current.coursesError).toBe('');
    expect(result.current.isLoadingCourses).toBe(false);
  });

  it('удаляет курс, синхронизирует selected courses и показывает success notify', async () => {
    const onSelectedCoursesChange = jest.fn();
    const courseOne = createCourse({ _id: 'course-1' });
    const selectedCourseIds = ['course-1'];

    mockGetCourseById.mockResolvedValue(courseOne);
    mockGetCourseProgressClient.mockResolvedValue(null);
    mockRemoveUserCourseClient.mockResolvedValue({
      message: 'Курс удален',
      courseState: 'removed',
    });

    const { result } = renderHook(() =>
      useWorkoutCourses({
        selectedCourseIds,
        isAuthorized: true,
        onSelectedCoursesChange,
      }),
    );

    await waitFor(() => {
      expect(result.current.courses).toHaveLength(1);
    });

    await act(async () => {
      await result.current.removeCourse('course-1');
    });

    expect(result.current.courses).toEqual([]);
    expect(onSelectedCoursesChange).toHaveBeenCalledWith([]);
    expect(mockCourseRemoved).toHaveBeenCalledTimes(1);
    expect(mockNotifyError).not.toHaveBeenCalled();
  });

  it('возвращает workouts и completed ids для выбранного курса', async () => {
    const course = createCourse({ _id: 'course-1' });
    const selectedCourseIds: string[] = [];

    mockGetCourseWorkoutsClient.mockResolvedValue([
      { _id: 'workout-1', name: 'День 1', video: 'video-1', exercises: [] },
      { _id: 'workout-2', name: 'День 2', video: 'video-2', exercises: [] },
    ]);
    mockGetCourseProgressClient.mockResolvedValue({
      courseId: 'course-1',
      courseCompleted: false,
      workoutsProgress: [
        {
          workoutId: 'workout-1',
          workoutCompleted: false,
          progressData: [5],
        },
        {
          workoutId: 'workout-2',
          workoutCompleted: true,
          progressData: [10],
        },
      ],
    });

    const { result } = renderHook(() =>
      useWorkoutCourses({
        selectedCourseIds,
        isAuthorized: true,
        onSelectedCoursesChange: jest.fn(),
      }),
    );

    const data = await result.current.loadCourseWorkouts(course);

    expect(Array.from(data.completedWorkoutIds)).toEqual(['workout-2']);
    expect(data.items).toEqual([
      { _id: 'workout-1', name: 'День 1', dayIndex: 0 },
      { _id: 'workout-2', name: 'День 2', dayIndex: 1 },
    ]);
  });
});
