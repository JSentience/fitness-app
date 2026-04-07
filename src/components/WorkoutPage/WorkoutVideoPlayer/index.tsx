'use client';

import { ControlButton } from '@/components/ControlButton/ControlButton';
import { SurfaceCard } from '@/components/SurfaceCard/SurfaceCard';
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '@/lib/video';
import { useMemo, useState } from 'react';

type WorkoutVideoPlayerProps = {
  videoUrl: string;
  title?: string;
};

export const WorkoutVideoPlayer = ({
  videoUrl,
  title = 'Видео тренировки',
}: WorkoutVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl]);
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoId), [videoId]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (!videoId) {
    return (
      <SurfaceCard className="flex h-159.75 w-full items-center justify-center bg-[#C4C4C4]">
        <p className="text-[18px] text-black/50">Видео недоступно</p>
      </SurfaceCard>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-[30px]"
      style={{ aspectRatio: '1160 / 639' }}
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
          <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,_#3B4152_0%,_#191B24_58%,_#0F1014_100%)]" />
          <div className="absolute inset-0 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0.08)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end rounded-[30px] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.52)_100%)] p-8">
            <p className="max-w-120 text-[24px] leading-[1.1] text-white/92">{title}</p>
          </div>

          <ControlButton
            onClick={handlePlay}
            aria-label="Воспроизвести видео"
            className="absolute inset-0 flex items-center justify-center focus-visible:ring-4 focus-visible:ring-white/50"
          >
            <span className="flex h-39 w-39 items-center justify-center rounded-full bg-black/75 transition-transform hover:scale-105 active:scale-95">
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
          </ControlButton>
        </>
      )}
    </div>
  );
};
