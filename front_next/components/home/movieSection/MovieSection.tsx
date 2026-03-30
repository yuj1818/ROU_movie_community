'use client';

import { getGenreMovieList, getSortedMovieList } from '@/lib/client/movie';
import { Movie } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SortKey } from '@/constants/category';
import { useEffect, useRef } from 'react';
import { useTagStore } from '@/stores/useTagStore';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/shallow';
import MovieCard from '@/components/common/MovieCard';
import Title from '@/components/common/Title';
import MovieCardSkeleton from '@/components/common/MovieCardSkeleton';

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
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    initial: 0,
    slides: {
      perView: 7.5,
      spacing: 10,
    },
  });

  useEffect(() => {
    registerSection(id, ref.current);
  }, [id]);

  useEffect(() => {
    if (!isPending && !!movies) {
      slider.current?.update();
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
          <ul ref={sliderRef} className="keen-slider">
            {isPending
              ? Array.from({ length: 10 }).map((_, i) => (
                  <MovieCardSkeleton key={i} className="keen-slider__slide" />
                ))
              : movies!.map((movie) => (
                  <MovieCard
                    key={movie.movie_id}
                    className="keen-slider__slide"
                    {...movie}
                  />
                ))}
          </ul>
        </div>
        {slider.current && (
          <>
            <ChevronLeft
              className="text-white size-8 absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
              onClick={() => slider.current?.prev()}
            />
            <ChevronRight
              className="text-white size-8 absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
              onClick={() => slider.current?.next()}
            />
          </>
        )}
      </div>
    </section>
  );
}
