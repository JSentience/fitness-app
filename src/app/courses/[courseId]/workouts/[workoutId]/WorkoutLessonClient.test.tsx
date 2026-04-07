import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type SaveCurrentProgressResult = {
  saved: true;
  courseId?: string;
  progress?: number;
} | null;

type UseActiveWorkoutMockResult = {
  activeWorkout: {
    _id: string;
    exercises: Array<{ _id: string; name: string; quantity: number }>;
    name: string;
    video: string;
  };
  activeWorkoutError: string;
  hasProgress: boolean;
  isLoadingActiveWorkout: boolean;
  isSavingProgress: boolean;
  progressValues: Record<string, string>;
  saveCurrentProgress: () => Promise<SaveCurrentProgressResult>;
  saveProgressError: string;
  setSaveProgressError: (error: string) => void;
  updateProgressValue: (exerciseId: string, value: string) => void;
};

const mockSaveCurrentProgress = jest.fn<() => Promise<SaveCurrentProgressResult>>();
const mockSetSaveProgressError = jest.fn<(error: string) => void>();
const mockUpdateProgressValue = jest.fn<(exerciseId: string, value: string) => void>();
const mockUseActiveWorkout = jest.fn<(args: unknown) => UseActiveWorkoutMockResult>();
const mockProgressSaved = jest.fn<() => void>();
let WorkoutLessonClient: typeof import('./WorkoutLessonClient').WorkoutLessonClient;

jest.mock('@/store/auth.store', () => ({
  useAuthStore: (selector: (state: { isAuthorized: boolean }) => boolean) =>
    selector({ isAuthorized: true }),
}));

jest.mock('@/components/WorkoutPage/hooks/useActiveWorkout', () => ({
  useActiveWorkout: (args: unknown) => mockUseActiveWorkout(args),
}));

jest.mock('@/lib/notify', () => ({
  notify: {
    progressSaved: () => mockProgressSaved(),
  },
}));

jest.mock('@/components/WorkoutPage/WorkoutSession', () => ({
  WorkoutSession: ({ onOpenProgressAction }: { onOpenProgressAction: () => void }) => (
    <button type="button" onClick={onOpenProgressAction}>
      Открыть прогресс
    </button>
  ),
}));

jest.mock('@/components/WorkoutPage/ProgressModal', () => ({
  ProgressModal: ({
    isOpen,
    onSubmitAction,
    saveError,
  }: {
    isOpen: boolean;
    onSubmitAction: () => void;
    saveError?: string;
  }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={onSubmitAction}>
          Сохранить прогресс
        </button>
        {saveError ? <p>{saveError}</p> : null}
      </div>
    ) : null,
}));

function mockActiveWorkout(saveError = '') {
  mockUseActiveWorkout.mockReturnValue({
    activeWorkout: {
      _id: 'workout-1',
      exercises: [{ _id: 'exercise-1', name: 'Прыжки', quantity: 10 }],
      name: 'Утренняя тренировка',
      video: 'video.mp4',
    },
    activeWorkoutError: '',
    hasProgress: false,
    isLoadingActiveWorkout: false,
    isSavingProgress: false,
    progressValues: {},
    saveCurrentProgress: mockSaveCurrentProgress,
    saveProgressError: saveError,
    setSaveProgressError: mockSetSaveProgressError,
    updateProgressValue: mockUpdateProgressValue,
  });
}

describe('WorkoutLessonClient', () => {
  beforeAll(async () => {
    ({ WorkoutLessonClient } = await import('./WorkoutLessonClient'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('не показывает toast об успехе, если сохранение завершилось ошибкой', async () => {
    mockSaveCurrentProgress.mockResolvedValueOnce(null);
    mockActiveWorkout('Не удалось сохранить прогресс');

    render(<WorkoutLessonClient courseId="course-1" workoutId="workout-1" />);

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Открыть прогресс' }));
    await user.click(screen.getByRole('button', { name: 'Сохранить прогресс' }));

    expect(screen.getByText('Не удалось сохранить прогресс')).toBeInTheDocument();
    expect(mockProgressSaved).not.toHaveBeenCalled();
  });

  it('показывает toast только после успешного сохранения', async () => {
    mockSaveCurrentProgress.mockResolvedValueOnce({ saved: true });
    mockActiveWorkout();

    render(<WorkoutLessonClient courseId="course-1" workoutId="workout-1" />);

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Открыть прогресс' }));
    await user.click(screen.getByRole('button', { name: 'Сохранить прогресс' }));

    expect(mockProgressSaved).toHaveBeenCalledTimes(1);
  });
});
