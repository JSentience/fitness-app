type ErrorWithStatus = {
  status: number;
};

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export function getErrorStatus(error: unknown, fallbackStatus: number): number {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as Partial<ErrorWithStatus>).status === 'number'
  ) {
    return (error as ErrorWithStatus).status;
  }

  return fallbackStatus;
}
