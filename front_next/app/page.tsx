import MovieCarousel from '@/components/home/MovieCarousel';
import MovieList from '@/components/home/movieSection';
import TagList from '@/components/home/TagList';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col p-4 gap-8 items-center relative">
      <MovieCarousel />
      <TagList />
    </div>
  );
}
