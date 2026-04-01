import { describe, expect, it } from '@jest/globals';

import { getCourseDailyDurationLabel, getCourseDurationLabel, getCourseMetaBadges } from '@/lib/course-meta';

describe('course-meta helpers', () => {
  it('строит подписи продолжительности курса', () => {
    expect(getCourseDurationLabel(12)).toBe('12 дней');
    expect(
      getCourseDailyDurationLabel({
        from: 25,
        to: 35,
      }),
    ).toBe('25-35 мин/день');
  });

  it('возвращает единый набор бейджей для карточек курса', () => {
    expect(
      getCourseMetaBadges({
        durationInDays: 10,
        dailyDurationInMinutes: {
          from: 20,
          to: 30,
        },
        difficulty: 'easy',
      }),
    ).toEqual([
      {
        key: 'days',
        icon: '/icons/calendar.svg',
        iconAlt: 'Количество дней',
        label: '10 дней',
      },
      {
        key: 'time',
        icon: '/icons/time.svg',
        iconAlt: 'Длительность тренировки',
        label: '20-30 мин/день',
      },
      {
        key: 'difficulty',
        icon: '/icons/difficulty/easy.svg',
        iconAlt: 'Сложность курса',
        label: 'Легкий',
      },
    ]);
  });
});
