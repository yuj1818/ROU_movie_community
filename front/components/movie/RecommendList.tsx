'use client';

import { useQuery } from '@tanstack/react-query';
import Title from '../common/Title';
import { Movie, MovieDetail } from '@/types/movie';
import { getMovieInfo, getRecommendMovieList } from '@/lib/client/movie';
import { useSession } from 'next-auth/react';
import MovieCard from '../common/MovieCard';
import { useParams } from 'next/navigation';
import MovieCardSkeleton from '../common/MovieCardSkeleton';

export default function RecommendList() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const { status } = useSession();
  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieInfo(movieId),
  });

  if (!movie) return;

  const { data: movies, isPending } = useQuery<Movie[]>({
    queryKey: ['recommend', movieId],
    queryFn: () => getRecommendMovieList(movie.title),
    enabled: !!movie && status === 'authenticated',
  });

  const isLoading =
    status === 'loading' || (status === 'authenticated' && isPending);

  return (
    <div className="w-full flex flex-col gap-2">
      <Title>"{movie.title}"와(과) 비슷한 영화</Title>
      <ul className="w-full grid max-sm:grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2">
        {isLoading ? (
          Array.from({ length: 18 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))
        ) : status === 'authenticated' ? (
          movies?.map((movie) => (
            <MovieCard
              key={movie.movie_id}
              className="relative"
              sizes="(max-width: 639px) 41.6vw, (max-width: 767px) 20.83vw, (max-width: 1279) 13.83vw"
              {...movie}
            />
          ))
        ) : (
          <span className="col-span-full w-full py-5 text-muted-foreground text-center">
            회원 전용 서비스입니다
          </span>
        )}
      </ul>
    </div>
  );
}
