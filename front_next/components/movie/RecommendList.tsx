'use client';

import { useQuery } from '@tanstack/react-query';
import Title from '../common/Title';
import { Movie, MovieDetail } from '@/types/movie';
import { getMovieInfo, getRecommendMovieList } from '@/lib/client/movie';
import { useSession } from 'next-auth/react';
import MovieCard from '../common/MovieCard';
import { useParams } from 'next/navigation';

export default function RecommendList() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const { status } = useSession();
  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieInfo(movieId),
  });

  if (!movie) return <div>Loading...</div>;

  const { data: movies } = useQuery<Movie[]>({
    queryKey: ['recommend', movieId],
    queryFn: () => getRecommendMovieList(movie.title),
    enabled: !!movie && status === 'authenticated',
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <Title>"{movie.title}"와(과) 비슷한 영화</Title>
      <ul className="w-full grid grid-cols-6 gap-2">
        {status === 'authenticated' ? (
          movies &&
          movies.map((movie) => (
            <MovieCard key={movie.movie_id} className="relative" {...movie} />
          ))
        ) : (
          <span className="col-span-6 w-full py-5 text-muted-foreground text-center">
            회원 전용 서비스입니다
          </span>
        )}
      </ul>
    </div>
  );
}
