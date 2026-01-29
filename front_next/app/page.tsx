import MovieCarousel from '@/components/home/MovieCarousel';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col p-4 gap-8 items-center relative">
      <MovieCarousel />
    </div>
  );
}
