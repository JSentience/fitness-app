"use client";

import { useState } from "react";

type WorkoutVideoPlayerProps = {
  videoUrl: string;
  title?: string;
};

function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=...
  const watchMatch = url.match(/[?&]v=([^?&#]+)/);
  if (watchMatch) return watchMatch[1];

  // Handle youtube.com/embed/...
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) return embedMatch[1];

  // Handle youtube.com/v/...
  const vMatch = url.match(/youtube\.com\/v\/([^?&#]+)/);
  if (vMatch) return vMatch[1];

  return null;
}

export const WorkoutVideoPlayer = ({
  videoUrl,
  title = "Видео тренировки",
}: WorkoutVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = extractYouTubeId(videoUrl);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  if (!videoId) {
    return (
      <div className="flex h-159.75 w-full items-center justify-center overflow-hidden rounded-[30px] bg-[#C4C4C4]">
        <p className="text-[18px] text-black/50">Видео недоступно</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-[30px]"
      style={{ aspectRatio: "1160 / 639" }}
    >
      {isPlaying && embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full rounded-[30px] border-0"
        />
      ) : (
        <>
          {/* Thumbnail */}
          {thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 h-full w-full rounded-[30px] object-cover"
            />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 rounded-[30px] bg-black/10" />

          {/* Play button overlay — matches Figma: semi-transparent circle + triangle */}
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Воспроизвести видео"
            className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          >
            <span className="flex h-39 w-39 items-center justify-center rounded-full bg-black/75 transition-transform hover:scale-105 active:scale-95">
              {/* Triangle play icon */}
              <svg
                width="76"
                height="76"
                viewBox="0 0 76 76"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="translate-x-1"
              >
                <polygon points="24,14 62,38 24,62" fill="#D9D9D9" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
};
