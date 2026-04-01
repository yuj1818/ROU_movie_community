import MovieCard from '@/components/common/MovieCard';
import MovieCardSkeleton from '@/components/common/MovieCardSkeleton';
import { TabsContent } from '@/components/ui/tabs';
import { getMovieList } from '@/lib/client/profile';
import { Movie } from '@/types/movie';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Clapperboard } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export default function MoviesTab({ target }: { target: string }) {
  const params = useParams();
  const userId = Number(params.userId);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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

  if (!data) {
    return (
      <TabsContent
        value={target}
        className="p-4 w-full grid grid-flow-col overflow-hidden auto-cols-[50%] md:auto-cols-[25%] xl:auto-cols-[16.6%] gap-2 content-start"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </TabsContent>
    );
  }

  if (data.pages[0].results.length === 0) {
    return (
      <TabsContent
        value={target}
        className="w-full h-full flex flex-col gap-4 justify-center items-center"
      >
        <Clapperboard className="size-10 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          등록된 영화가 없습니다
        </span>
      </TabsContent>
    );
  }

  return (
    <TabsContent
      value={target}
      className="w-full h-full overflow-y-auto grid max-sm:grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2 content-start"
    >
      {data.pages.map((page) =>
        page.results.map((movie: Movie) => (
          <MovieCard
            key={movie.movie_id}
            sizes="(max-width: 639px) 50vw, (max-width: 767px) 25vw, (max-width: 1279px) 16.65vw, 11.1vw"
            {...movie}
          />
        )),
      )}
      {isFetchingNextPage && (
        <div className="grid grid-flow-col overflow-hidden auto-cols-[50%] md:auto-cols-[25%] xl:auto-cols-[16.6%] gap-2 content-start">
          {Array.from({ length: 6 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}
      {hasNextPage && <div ref={observerRef} className="col-span-full h-1" />}
    </TabsContent>
  );
}
