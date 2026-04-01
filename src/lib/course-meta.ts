import { getDifficultyIcon, normalizeDifficultyLabel } from '@/lib/difficulty';
import type { Course } from '@/types/course.types';

type CourseMetaSource = Pick<
  Course,
  'dailyDurationInMinutes' | 'difficulty' | 'durationInDays'
>;

export type CourseMetaBadge = {
  icon: string;
  iconAlt: string;
  key: 'days' | 'time' | 'difficulty';
  label: string;
};

export function getCourseDurationLabel(durationInDays: number): string {
  return `${durationInDays} дней`;
}

export function getCourseDailyDurationLabel(
  dailyDurationInMinutes: Course['dailyDurationInMinutes'],
): string {
  return `${dailyDurationInMinutes.from}-${dailyDurationInMinutes.to} мин/день`;
}

export function getCourseMetaBadges(course: CourseMetaSource): CourseMetaBadge[] {
  return [
    {
      key: 'days',
      icon: '/icons/calendar.svg',
      iconAlt: 'Количество дней',
      label: getCourseDurationLabel(course.durationInDays),
    },
    {
      key: 'time',
      icon: '/icons/time.svg',
      iconAlt: 'Длительность тренировки',
      label: getCourseDailyDurationLabel(course.dailyDurationInMinutes),
    },
    {
      key: 'difficulty',
      icon: getDifficultyIcon(course.difficulty),
      iconAlt: 'Сложность курса',
      label: normalizeDifficultyLabel(course.difficulty),
    },
  ];
}
