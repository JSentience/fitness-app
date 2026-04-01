'use client';

import { BodyText } from '@/components/BodyText/BodyText';
import { Button } from '@/components/Button/Button';
import { ModalShell } from '@/components/Modal/ModalShell';
import { SectionTitle } from '@/components/SectionTitle/SectionTitle';
import { TextInput } from '@/components/TextInput/TextInput';
import type { Exercise } from '@/lib/workouts-api';
import { useId } from 'react';

type ProgressValueMap = Record<string, string>;

type ProgressModalProps = {
  isOpen: boolean;
  title: string;
  exercises: Exercise[];
  progressValues: ProgressValueMap;
  isSaving?: boolean;
  saveError?: string;
  onCloseAction: () => void;
  onSubmitAction: () => void;
  onProgressChangeAction: (exerciseId: string, value: string) => void;
};

export const ProgressModal = ({
  isOpen,
  title,
  exercises,
  progressValues,
  isSaving = false,
  saveError = '',
  onCloseAction,
  onSubmitAction,
  onProgressChangeAction,
}: ProgressModalProps) => {
  const titleId = useId();

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onCloseAction={onCloseAction}
      ariaLabelledBy={titleId}
      contentClassName="flex w-full max-w-85.75 flex-col items-center gap-8.5 rounded-[30px] bg-white p-10 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]"
    >
      <SectionTitle as="h2" id={titleId} className="w-full">
        {title}
      </SectionTitle>

      <div className="flex w-full flex-col items-center gap-8.5">
        <div className="flex w-full flex-col gap-5">
          {exercises.map((exercise) => (
            <div key={exercise._id} className="flex w-full flex-col gap-2.5">
              <BodyText as="label" htmlFor={`progress-${exercise._id}`}>
                Сколько раз вы сделали {exercise.name.toLowerCase()}?
              </BodyText>
              <TextInput
                id={`progress-${exercise._id}`}
                type="text"
                inputMode="numeric"
                value={progressValues[exercise._id] ?? ''}
                onChange={(event) => onProgressChangeAction(exercise._id, event.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        {saveError && (
          <BodyText className="w-full" size="sm" tone="danger">
            {saveError}
          </BodyText>
        )}

        <Button onClick={onSubmitAction} disabled={isSaving} className="w-full">
          {isSaving ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </div>
    </ModalShell>
  );
};
