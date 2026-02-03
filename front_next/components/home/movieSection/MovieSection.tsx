'use client';

import { getGenreMovieList, getSortedMovieList } from '@/lib/movie';
import { Movie } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SortKey } from '@/constants/category';
import { useEffect, useRef } from 'react';
import { useTagStore } from '@/stores/useTagStore';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/shallow';
import MovieCard from '@/components/common/MovieCard';

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
    queryFn: async () => {
      let res;
      if (type === 'genre') {
        res = await getGenreMovieList(id);
      } else {
        res = await getSortedMovieList(sortKey!!);
      }
      return res;
    },
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

  return (
    <section
      ref={ref}
      className={cn(
        'w-full flex flex-col gap-2 items-center',
        isTagOpen ? 'scroll-mt-20' : 'scroll-mt-12',
      )}
    >
      <h3 className="font-semibold text-xl w-11/12">{label}</h3>
      <div className="w-full relative flex justify-center items-center">
        <div className="w-11/12">
          {isPending ? (
            <>Loading...</>
          ) : (
            <ul ref={sliderRef} className="keen-slider">
              {(movies ?? []).map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  className="keen-slider__slide"
                  {...movie}
                />
              ))}
            </ul>
          )}
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
