import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { createElement, type ComponentProps } from 'react';

const mockGetCourses = jest.fn<() => Promise<unknown[]>>();
let CoursesList: typeof import('./CoursesList').CoursesList;

jest.mock('@/lib/courses-api', () => ({
  getCourses: () => mockGetCourses(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ComponentProps<'img'>) =>
    createElement('img', { ...props, alt: props.alt ?? '' }),
}));

jest.mock('@/components/CourseCard/CourseCard', () => ({
  CourseCard: () => <div>course-card</div>,
}));

jest.mock('@/components/BackToTopBtn/BackToTopBtn', () => ({
  BackToTopBtn: () => <button type="button">up</button>,
}));

describe('CoursesList', () => {
  beforeAll(async () => {
    ({ CoursesList } = await import('./CoursesList'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('показывает fallback вместо 500 при ошибке загрузки курсов', async () => {
    mockGetCourses.mockRejectedValueOnce(new Error('Network error'));

    render(await CoursesList());

    expect(screen.getByText('Каталог курсов временно недоступен')).toBeInTheDocument();
    expect(screen.getByText(/Не удалось получить данные с внешнего API/i)).toBeInTheDocument();
  });
});
