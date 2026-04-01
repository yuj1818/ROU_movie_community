import MovieCarousel from '@/components/home/MovieCarousel';
import MovieSections from '@/components/home/movieSection';
import TagList from '@/components/home/TagList';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import dayjs from '@/lib/dayjs';
import { getTrendMovieList } from '@/lib/server/movie';

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['trendMovies', dayjs().format('YYYY-MM-DD')],
    queryFn: () => getTrendMovieList(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full flex flex-col p-4 gap-8 items-center relative">
        <MovieCarousel />
        <TagList />
        <MovieSections />
      </div>
    </HydrationBoundary>
  );
}
