import MovieCard from '@/components/common/MovieCard';
import { TabsContent } from '@/components/ui/tabs';
import { getMovieList } from '@/lib/client/profile';
import { Movie } from '@/types/movie';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export default function MoviesTab({ target }: { target: string }) {
  const params = useParams();
  const userId = Number(params.userId);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['profile', userId, 'movies', target],
      queryFn: ({ pageParam }) => getMovieList(userId, target, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? Number(nextPage) : undefined;
      },
      staleTime: 1000 * 60,
    });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    if (!observerRef.current) return;

    const option = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <TabsContent
      ref={observerRef}
      value={target}
      className="w-full h-full overflow-y-auto grid max-md:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 content-start"
    >
      {data?.pages.map((page) =>
        page.results.map((movie: Movie) => (
          <MovieCard key={movie.movie_id} {...movie} />
        )),
      )}
      {status === 'pending' && (
        <LoaderCircle className="max-md:col-span-2 md:col-span-4 xl:col-span-6 flex items-center justify-center size-5 text-muted-foreground animate-spin" />
      )}
    </TabsContent>
  );
}
