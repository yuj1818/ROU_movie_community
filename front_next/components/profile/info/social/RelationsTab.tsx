import { TabsContent } from '@/components/ui/tabs';
import { follow, getRelations } from '@/lib/client/profile';
import { User } from '@/types/profile';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import UserInfo from './UserInfo';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function RelationsTab({ type }: { type: string }) {
  const session = useSession();
  const params = useParams<{ userId: string }>();
  const userId = Number(params.userId);
  const isMine = session.data?.user.id === userId;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['profile', userId, 'relations', type],
      queryFn: ({ pageParam }) => getRelations(userId, type, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? Number(nextPage) : undefined;
      },
      staleTime: 1000 * 60,
    });

  const mutation = useMutation({
    mutationFn: ({ targetId }: { targetId: number; isFollowing: boolean }) =>
      follow(targetId),
    onMutate: async ({ targetId, isFollowing }) => {
      await queryClient.cancelQueries({
        queryKey: ['profile', userId, 'relations', type],
      });

      queryClient.setQueryData(
        ['profile', userId, 'relations', type],
        (old: any) => {
          if (!old) return old;

          if (isMine && type !== 'followers' && isFollowing) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                results: page.results.filter((u: User) => u.id !== targetId),
              })),
            };
          }

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              results: page.results.map((u: User) =>
                u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u,
              ),
            })),
          };
        },
      );
    },
    onSettled: () => {
      if (isMine) {
        queryClient.invalidateQueries({
          queryKey: ['profile', userId],
          exact: true,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['profile', userId, 'relations'],
      });
    },
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
      value={type}
      className="p-4 w-full h-full overflow-y-auto grid max-md:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 max-sm:gap-1 sm:gap-2"
    >
      {data?.pages.map((page) =>
        page.results.map((user: User) => (
          <UserInfo
            key={user.id}
            {...user}
            onClickFollow={({ targetId, isFollowing }) =>
              mutation.mutate({ targetId, isFollowing })
            }
          />
        )),
      )}
      {status === 'pending' && (
        <LoaderCircle className="max-md:col-span-2 md:col-span-3 xl:col-span-5 flex items-center justify-center size-5 text-muted-foreground animate-spin" />
      )}
    </TabsContent>
  );
}
