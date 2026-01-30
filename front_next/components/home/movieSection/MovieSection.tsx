'use client';

import { getGenreMovieList, getSortedMovieList } from '@/lib/movie';
import { Movie } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useKeenSlider } from 'keen-slider/react';
import MovieItem from './MovieItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SortKey } from '@/constants/category';

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

  return (
    <section className="w-full flex flex-col gap-2 items-center">
      <h3 className="font-semibold text-xl w-11/12">{label}</h3>
      <div className="w-full relative flex justify-center items-center">
        <div className="w-11/12">
          {isPending ? (
            <>Loading...</>
          ) : (
            <ul ref={sliderRef} className="keen-slider">
              {(movies ?? []).map((movie) => (
                <MovieItem key={movie.movie_id} {...movie} />
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
