import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { fitnessApiRequest } from '@/lib/fitness-api';

const mockFetch = jest.fn<typeof fetch>();

describe('fitnessApiRequest', () => {
  beforeEach(() => {
    global.fetch = mockFetch as typeof fetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  it('отправляет object body без Content-Type заголовка', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify({ message: 'ok' }),
    } as Response);

    await fitnessApiRequest<{ message: string }>('/users/me/courses', {
      method: 'POST',
      token: 'token-1',
      body: { courseId: 'course-1' },
    });

    const [, requestInit] = mockFetch.mock.calls[0] ?? [];
    const headers = new Headers(requestInit?.headers);

    expect(headers.get('Authorization')).toBe('Bearer token-1');
    expect(headers.get('Content-Type')).toBeNull();
    expect(Buffer.isBuffer(requestInit?.body)).toBe(true);
  });

  it('нормализует network error в ApiError с fallback message', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(
      fitnessApiRequest('/courses', {
        fallbackMessage: 'Не удалось загрузить список курсов',
      }),
    ).rejects.toMatchObject({
      message: 'Не удалось загрузить список курсов',
      status: 503,
    });
  });
});
