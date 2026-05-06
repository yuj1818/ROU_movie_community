'use client';

import { getGenreMovieList, getSortedMovieList } from '@/lib/client/movie';
import { Movie } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SortKey } from '@/constants/category';
import { useEffect, useRef } from 'react';
import { useTagStore } from '@/stores/useTagStore';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/shallow';
import MovieCard from '@/components/common/MovieCard';
import Title from '@/components/common/Title';
import MovieCardSkeleton from '@/components/common/MovieCardSkeleton';
import useEmblaCarousel from 'embla-carousel-react';

interface MovieSectionsProps {
  id: number;
  sortKey?: SortKey;
  type: 'genre' | 'sort';
  label: string;
}

export default function MovieSection({
  id,
  sortKey,
  type,
  label,
}: MovieSectionsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });

  const { registerSection, isTagOpen } = useTagStore(
    useShallow((state) => ({
      isTagOpen: state.isTagOpen,
      registerSection: state.registerSection,
    })),
  );

  const { data: movies, isPending } = useQuery<Movie[]>({
    queryKey: ['movies', id, dayjs().format('YYYY-MM-DD')],
    queryFn: () =>
      type === 'genre' ? getGenreMovieList(id) : getSortedMovieList(sortKey!),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  useEffect(() => {
    registerSection(id, ref.current);
  }, [id]);

  useEffect(() => {
    if (!isPending && !!movies) {
      emblaApi?.reInit();
    }
  }, [isPending]);

  useEffect(() => {
    if (!isPending && !!movies) {
      emblaApi?.reInit();
    }
  }, [isPending]);

  return (
    <section
      ref={ref}
      className={cn(
        'w-full flex flex-col gap-2 items-center',
        isTagOpen ? 'scroll-mt-20' : 'scroll-mt-12',
      )}
    >
      <Title className="w-11/12">{label}</Title>
      <div className="w-full relative flex justify-center items-center">
        <div className="w-11/12">
          <div className="overflow-hidden" ref={emblaRef}>
            <ul className="flex gap-3">
              {isPending
                ? Array.from({ length: 10 }).map((_, i) => (
                    <MovieCardSkeleton
                      key={i}
                      className="flex-[0_0_calc((100%-70px)/7.5)] min-w-0"
                    />
                  ))
                : movies!.map((movie, i) => (
                    <MovieCard
                      key={movie.movie_id}
                      className="flex-[0_0_calc((100%-70px)/7.5)] min-w-0"
                      sizes="12.22vw"
                      priority={i < 8}
                      {...movie}
                    />
                  ))}
            </ul>
          </div>
        </div>
        {emblaApi && (
          <>
            <ChevronLeft
              className="text-white size-8 absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
              onClick={() => emblaApi.scrollPrev()}
            />
            <ChevronRight
              className="text-white size-8 absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
              onClick={() => emblaApi.scrollNext()}
            />
          </>
        )}
      </div>
    </section>
  );
}
