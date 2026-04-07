import { describe, expect, it } from '@jest/globals';

import { clientEndpoints } from '@/lib/client-endpoints';

describe('client-endpoints', () => {
  it('кодирует path params для nested endpoints', () => {
    expect(clientEndpoints.userCourse('course/1')).toBe('/api/users/me/courses/course%2F1');
    expect(clientEndpoints.courseWorkouts('course 1')).toBe('/api/courses/course%201/workouts');
    expect(clientEndpoints.workout('workout/1')).toBe('/api/workouts/workout%2F1');
  });

  it('строит progress endpoint с query params', () => {
    expect(clientEndpoints.userProgress('course 1')).toBe(
      '/api/users/me/progress?courseId=course+1',
    );
    expect(clientEndpoints.userProgress('course 1', 'workout/1')).toBe(
      '/api/users/me/progress?courseId=course+1&workoutId=workout%2F1',
    );
  });
});
