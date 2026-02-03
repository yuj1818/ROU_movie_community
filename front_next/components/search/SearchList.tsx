import { Movie } from '@/types/movie';
import MovieCard from '../common/MovieCard';

export default async function SearchList({ results }: { results: Movie[] }) {
  return (
    <ul className="grid grid-cols-6 w-full gap-2">
      {results.map((movie) => (
        <MovieCard key={movie.movie_id} className="relative" {...movie} />
      ))}
    </ul>
  );
}
