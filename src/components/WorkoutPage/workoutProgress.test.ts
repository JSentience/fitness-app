import { describe, expect, it } from '@jest/globals';

import {
    getCourseProgressPercent,
    getExerciseProgressPercent,
} from '@/components/WorkoutPage/workoutProgress';

describe('workoutProgress helpers', () => {
  it('считает прогресс курса по completed и partially-filled workouts', () => {
    expect(
      getCourseProgressPercent(4, {
        courseId: 'course-1',
        courseCompleted: false,
        workoutsProgress: [
          { workoutId: 'w1', workoutCompleted: true, progressData: [1] },
          { workoutId: 'w2', workoutCompleted: false, progressData: [0, 2] },
          { workoutId: 'w3', workoutCompleted: false, progressData: [0, 0] },
        ],
      }),
    ).toBe(50);
  });

  it('считает прогресс упражнения и ограничивает его диапазоном 0..100', () => {
    expect(getExerciseProgressPercent('exercise-1', 20, { 'exercise-1': '10' })).toBe(50);
    expect(getExerciseProgressPercent('exercise-1', 20, { 'exercise-1': '99' })).toBe(100);
    expect(getExerciseProgressPercent('exercise-1', 20, { 'exercise-1': 'abc' })).toBe(0);
    expect(getExerciseProgressPercent('exercise-1', 0, { 'exercise-1': '10' })).toBe(0);
  });
});
