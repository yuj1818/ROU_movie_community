import CastInfo from '@/components/movie/CastInfo';
import MovieInfo from '@/components/movie/MovieInfo';
import { getMovieInfo } from '@/lib/movie';

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;

  const movie = await getMovieInfo(movieId);

  return (
    <div className="w-5/6 py-8 flex flex-col gap-8">
      <MovieInfo initialData={movie} />
      <CastInfo actors={movie.actors} />
    </div>
  );
}
