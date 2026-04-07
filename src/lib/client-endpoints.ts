import { buildClientApiPath, encodeClientPathSegment } from '@/lib/client-api';

const AUTH_BASE_PATH = '/api/auth';
const COURSES_BASE_PATH = '/api/courses';
const USERS_ME_BASE_PATH = '/api/users/me';
const WORKOUTS_BASE_PATH = '/api/workouts';

export const clientEndpoints = {
  authLogin: `${AUTH_BASE_PATH}/login`,
  authLogout: `${AUTH_BASE_PATH}/logout`,
  authMe: `${AUTH_BASE_PATH}/me`,
  authRegister: `${AUTH_BASE_PATH}/register`,
  userCourses: `${USERS_ME_BASE_PATH}/courses`,
  userCourse: (courseId: string) =>
    `${USERS_ME_BASE_PATH}/courses/${encodeClientPathSegment(courseId)}`,
  userProgress: (courseId: string, workoutId?: string) =>
    buildClientApiPath(`${USERS_ME_BASE_PATH}/progress`, {
      courseId,
      workoutId,
    }),
  courseWorkouts: (courseId: string) =>
    `${COURSES_BASE_PATH}/${encodeClientPathSegment(courseId)}/workouts`,
  workout: (workoutId: string) => `${WORKOUTS_BASE_PATH}/${encodeClientPathSegment(workoutId)}`,
  workoutProgress: (courseId: string, workoutId: string) =>
    `${COURSES_BASE_PATH}/${encodeClientPathSegment(courseId)}/workouts/${encodeClientPathSegment(workoutId)}`,
} as const;
