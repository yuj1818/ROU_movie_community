import CastInfo from '@/components/movie/CastInfo';
import MovieInfo from '@/components/movie/MovieInfo';
import RecommendList from '@/components/movie/RecommendList';
import ReviewList from '@/components/movie/review/ReviewList';
import { getMovieInfo } from '@/lib/server/movie';
import { MovieDetail } from '@/types/movie';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const p = await params;
  const movieId = Number(p.movieId);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieInfo(movieId),
  });

  const movie = queryClient.getQueryData<MovieDetail>(['movie', movieId]);

  if (!movie) return <div>Loading...</div>;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-5/6 py-8 flex flex-col gap-8">
        <MovieInfo />
        <CastInfo actors={movie.actors} />
        <ReviewList />
        <RecommendList />
      </div>
    </HydrationBoundary>
  );
}
