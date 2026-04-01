import { Movie } from '@/types/movie';
import MovieCard from '../common/MovieCard';

export default async function SearchList({ results }: { results: Movie[] }) {
  return (
    <ul className="grid max-sm:grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 w-full gap-2">
      {results.map((movie, i) => (
        <MovieCard
          key={movie.movie_id}
          className="relative"
          priority={i < 6}
          sizes="(max-width: 639px) 50vw, (max-width: 1279px) 25vw, 16.6vw"
          {...movie}
        />
      ))}
    </ul>
  );
}
