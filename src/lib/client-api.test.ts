import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { buildClientApiPath, clientNullableRequest, clientRequest } from '@/lib/client-api';

const fetchMock = jest.fn<typeof fetch>();
const originalFetch = globalThis.fetch;

describe('client-api', () => {
  afterEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = originalFetch;
  });

  it('buildClientApiPath сериализует query params и пропускает пустые значения', () => {
    expect(
      buildClientApiPath('/api/users/me/progress', {
        courseId: 'course 1',
        workoutId: 'workout/1',
        empty: '',
        skipped: null,
      }),
    ).toBe('/api/users/me/progress?courseId=course+1&workoutId=workout%2F1');
  });

  it('clientRequest подставляет query и json content-type для object body', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify({ ok: true }),
    } as Response);
    globalThis.fetch = fetchMock;

    await expect(
      clientRequest<{ ok: true }>('/api/test', {
        method: 'POST',
        body: { id: 1 },
        query: { filter: 'new' },
      }),
    ).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe('/api/test?filter=new');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify({ id: 1 }));
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
  });

  it('clientNullableRequest возвращает null для json null ответа', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => 'null',
    } as Response);
    globalThis.fetch = fetchMock;

    await expect(clientNullableRequest('/api/progress')).resolves.toBeNull();
  });
});
