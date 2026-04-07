import type { Course } from '@/types/course.types';

export type ProfileCourseState = {
  course: Course;
  isRemoving: boolean;
};

export type ProgressValueMap = Record<string, string>;

export type WorkoutListItem = {
  _id: string;
  name: string;
  dayIndex: number;
};

export type WorkoutStat = {
  label: string;
  value: string;
  icon: string;
};
