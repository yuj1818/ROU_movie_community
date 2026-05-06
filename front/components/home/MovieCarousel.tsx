'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import { getTrendMovieList } from '@/lib/client/movie';
import { Movie } from '@/types/movie';
import { MEDIA_BASE_URL } from '@/constants/url';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';

export default function MovieCarousel() {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const { data: movies, isPending } = useQuery<Movie[]>({
    queryKey: ['trendMovies', dayjs().format('YYYY-MM-DD')],
    queryFn: () => getTrendMovieList(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    if (!isPlaying || !emblaApi) return;

    intervalRef.current = setInterval(() => {
      emblaApi?.scrollNext();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, emblaApi]);

  return (
    <div className="w-[90%] mb-12">
      {isPending ? (
        <Skeleton className="w-full max-lg:aspect-video lg:aspect-2/1" />
      ) : (
        <div className="w-full overflow-x-hidden" ref={emblaRef}>
          <div className="w-full flex">
            {(movies ?? []).map((movie, idx) => (
              <div
                key={movie.movie_id}
                className="flex-[0_0_100%] min-w-0 flex items-center justify-center rounded-md overflow-hidden relative max-lg:aspect-video lg:aspect-2/1 cursor-pointer"
                onMouseEnter={() => {
                  setHoveredId(movie.movie_id);
                  setIsPlaying(false);
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setIsPlaying(true);
                }}
                onClick={() => router.push(`/movie/${movie.movie_id}`)}
              >
                {hoveredId === movie.movie_id ? (
                  <iframe
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    src={`${MEDIA_BASE_URL.youtubePath}${movie.videos}?autoplay=1&mute=0&loop=1&controls=0&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media"
                    loading="lazy"
                  />
                ) : movie.backdrop_path ? (
                  <Image
                    className="w-full h-full z-1 object-cover"
                    src={MEDIA_BASE_URL.tmdbImgPathOrg + movie.backdrop_path}
                    alt={`backdrop_of_${movie.movie_id}`}
                    fill
                    sizes="90vw"
                    priority={idx === 0}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="w-full h-full bg-white/20" />
                )}
                <div className="absolute inset-0 z-2 py-8 pl-[35%] pr-12 flex flex-col gap-4 justify-end bg-linear-to-tr from-black to-transparent to-70%">
                  <span className="text-3xl font-bold">{movie.title}</span>
                  <span className="line-clamp-5 leading-normal max-h-30">
                    {movie.overview}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
