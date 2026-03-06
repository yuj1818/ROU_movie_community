import CastInfo from '@/components/movie/CastInfo';
import MovieInfo from '@/components/movie/MovieInfo';
import RecommendList from '@/components/movie/RecommendList';
import ReviewList from '@/components/movie/review/ReviewList';
import { getMovieInfo } from '@/lib/server/movie';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const p = await params;
  const movieId = Number(p.movieId);

  const movie = await getMovieInfo(movieId);

  return (
    <div className="w-5/6 py-8 flex flex-col gap-8">
      <MovieInfo initialData={movie} />
      <CastInfo actors={movie.actors} />
      <ReviewList />
      <RecommendList title={movie.title} />
    </div>
  );
}
