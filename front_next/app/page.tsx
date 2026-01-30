import MovieCarousel from '@/components/home/MovieCarousel';
import MovieList from '@/components/home/movieList';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col p-4 gap-8 items-center relative">
      <MovieCarousel />
      <MovieList />
    </div>
  );
}
