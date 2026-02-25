'use client';

import { useQuery } from '@tanstack/react-query';
import Title from '../common/Title';
import { Movie } from '@/types/movie';
import { getRecommendMovieList } from '@/lib/client/movie';
import { useSession } from 'next-auth/react';
import MovieCard from '../common/MovieCard';

export default function RecommendList({
  title,
  movieId,
}: {
  title: string;
  movieId: number;
}) {
  const { status } = useSession();
  const { data: movies, isPending } = useQuery<Movie[]>({
    queryKey: ['recommend', movieId],
    queryFn: () => getRecommendMovieList(title),
    enabled: status === 'authenticated',
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <Title>"{title}"와(과) 비슷한 영화</Title>
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
