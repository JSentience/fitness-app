import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { CourseMutationResponse } from '@/lib/client-user-courses';

const mockAddUserCourseClient = jest.fn<(courseId: string) => Promise<CourseMutationResponse>>();
const mockRemoveUserCourseClient = jest.fn<(courseId: string) => Promise<CourseMutationResponse>>();
const mockOpenAuthModal = jest.fn();
const mockSetSelectedCourses = jest.fn();
let AddCourseButton: typeof import('./AddCourseButton').AddCourseButton;

let authStoreState = {
  isAuthorized: true,
  openAuthModal: mockOpenAuthModal,
  selectedCourses: [] as string[],
  setSelectedCourses: mockSetSelectedCourses,
};

jest.mock('@/lib/client-user-courses', () => ({
  addUserCourseClient: (courseId: string) => mockAddUserCourseClient(courseId),
  removeUserCourseClient: (courseId: string) => mockRemoveUserCourseClient(courseId),
}));

jest.mock('@/store/auth.store', () => ({
  useAuthStore: <T,>(selector?: (state: typeof authStoreState) => T) =>
    selector ? selector(authStoreState) : authStoreState,
}));

describe('AddCourseButton', () => {
  beforeAll(async () => {
    ({ AddCourseButton } = await import('./AddCourseButton'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    authStoreState = {
      isAuthorized: true,
      openAuthModal: mockOpenAuthModal,
      selectedCourses: [],
      setSelectedCourses: mockSetSelectedCourses,
    };
  });

  it('обрабатывает already-added как успешное добавление без парсинга текста ошибки', async () => {
    mockAddUserCourseClient.mockResolvedValueOnce({
      courseState: 'already-added',
      message: 'Совершенно другой текст ответа',
    });

    render(<AddCourseButton courseId="course-1" />);

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Добавить курс' }));

    expect(mockAddUserCourseClient).toHaveBeenCalledWith('course-1');
    expect(mockSetSelectedCourses).toHaveBeenCalledWith(['course-1']);
    expect(screen.queryByText(/не удалось изменить состояние курса/i)).not.toBeInTheDocument();
  });
});
