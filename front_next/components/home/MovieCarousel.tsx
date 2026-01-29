'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getTrendMovieList } from '@/lib/movie';
import { LoaderCircle } from 'lucide-react';
import { TrendMovie } from '@/types/movie';
import { MEDIA_BASE_URL } from '@/constants/url';

export default function MovieCarousel() {
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ['trendMovies', dayjs().format('YYYY-MM-DD')],
    queryFn: async () => {
      const res = await getTrendMovieList();
      return res;
    },
  });

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    slides: {
      origin: 'center',
      perView: 1.3,
      spacing: 20,
    },
  });

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      slider.current?.next();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, slider]);

  return (
    <div className="w-[90%] mb-12">
      {isPending ? (
        <div className="w-full aspect-video border animate-pulse">
          <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="keen-slider w-full" ref={sliderRef}>
          {data.map((movie: TrendMovie) => (
            <div
              key={movie.movie_id}
              className="keen-slider__slide w-ful flex items-center justify-center rounded-md relative aspect-video"
              onMouseEnter={() => {
                setHoveredId(movie.movie_id);
                setIsPlaying(false);
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setIsPlaying(true);
              }}
            >
              {hoveredId === movie.movie_id ? (
                <iframe
                  className="w-full h-full z-1 object-cover pointer-events-none"
                  loading="lazy"
                  src={`${MEDIA_BASE_URL.youtubePath}${movie.videos}?autoplay=1&mute=0&loop=1&controls=0&rel=0&modestbranding=1`}
                  allow="autoplay; encrypted-media"
                />
              ) : movie.backdrop_path ? (
                <Image
                  className="w-full h-full z-1 object-cover"
                  src={MEDIA_BASE_URL.tmdbImgPathOrg + movie.backdrop_path}
                  alt={`backdrop_of_${movie.movie_id}`}
                  fill
                  sizes="100vw"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-white/20" />
              )}
              <div className="absolute inset-0 z-2 py-8 pl-[35%] pr-12 flex flex-col gap-4 justify-end bg-linear-to-tr from-black to-transparent to-70%">
                <span className="text-3xl font-semibold">{movie.title}</span>
                <span className="line-clamp-5 leading-normal max-h-30">
                  {movie.overview}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
