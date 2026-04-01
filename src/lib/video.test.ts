import { describe, expect, it } from '@jest/globals';

import { getYouTubeEmbedUrl, getYouTubeVideoId } from '@/lib/video';

describe('video helpers', () => {
  it('извлекает YouTube id из разных форматов ссылок', () => {
    expect(getYouTubeVideoId('https://youtu.be/abc123XYZ')).toBe('abc123XYZ');
    expect(getYouTubeVideoId('https://www.youtube.com/watch?v=abc123XYZ')).toBe('abc123XYZ');
    expect(getYouTubeVideoId('https://www.youtube.com/embed/abc123XYZ')).toBe('abc123XYZ');
    expect(getYouTubeVideoId('https://www.youtube.com/v/abc123XYZ')).toBe('abc123XYZ');
    expect(getYouTubeVideoId('https://www.youtube.com/shorts/abc123XYZ')).toBe('abc123XYZ');
  });

  it('возвращает null для неподдерживаемых или пустых url', () => {
    expect(getYouTubeVideoId('')).toBeNull();
    expect(getYouTubeVideoId('https://example.com/watch?v=abc123XYZ')).toBeNull();
    expect(getYouTubeVideoId('not-a-valid-url')).toBeNull();
  });

  it('строит embed url только при наличии video id', () => {
    expect(getYouTubeEmbedUrl('abc123XYZ')).toBe(
      'https://www.youtube.com/embed/abc123XYZ?autoplay=1&rel=0&modestbranding=1',
    );
    expect(getYouTubeEmbedUrl(null)).toBeNull();
  });
});
