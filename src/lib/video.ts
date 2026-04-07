function getPathSegment(pathname: string, index: number): string | null {
  const segments = pathname.split('/').filter(Boolean);

  return segments[index] ?? null;
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url.trim()) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostname.includes('youtu.be')) {
      return getPathSegment(parsedUrl.pathname, 0);
    }

    if (hostname.includes('youtube.com')) {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v');
      }

      if (parsedUrl.pathname.startsWith('/embed/')) {
        return getPathSegment(parsedUrl.pathname, 1);
      }

      if (parsedUrl.pathname.startsWith('/v/')) {
        return getPathSegment(parsedUrl.pathname, 1);
      }

      if (parsedUrl.pathname.startsWith('/shorts/')) {
        return getPathSegment(parsedUrl.pathname, 1);
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(videoId: string | null): string | null {
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
}
