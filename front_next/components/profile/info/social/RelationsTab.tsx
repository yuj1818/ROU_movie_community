import { TabsContent } from '@/components/ui/tabs';
import {
  follow,
  getRecommendedFriends,
  getRelations,
} from '@/lib/client/profile';
import { User } from '@/types/profile';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import UserInfo from './UserInfo';
import { useSession } from 'next-auth/react';
import { PaginatedResponse } from '@/types/common';
import UserInfoSkeleton from './UserInfoSkeleton';
import { Contact } from 'lucide-react';

const TYPE_MAP = {
  followers: '팔로워',
  followings: '팔로잉',
  friends: '친구',
  recommend: '추천',
};

export default function RelationsTab({ type }: { type: string }) {
  const session = useSession();
  const params = useParams<{ userId: string }>();
  const userId = Number(params.userId);
  const isMine = session.data?.user.id == userId;
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['profile', userId, 'relations', type],
      queryFn: ({ pageParam }) => {
        if (type === 'recommend') {
          return getRecommendedFriends(pageParam);
        } else {
          return getRelations(userId, type, pageParam);
        }
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (type === 'recommend') return undefined;
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

      queryClient.setQueryData<{
        pages: PaginatedResponse<User>[];
        pageParams: (number | undefined)[];
      }>(['profile', userId, 'relations', type], (old) => {
        if (!old) return old;

        // 내 프로필의 팔로잉 목록이나 친구 목록에서 unfollow을 할 경우, 목록에서 바로 사라져야 함
        if (
          isMine &&
          (type === 'followings' || type === 'friends') &&
          isFollowing
        ) {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              results: page.results.filter((u) => u.id !== targetId),
            })),
          };
        }

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results.map((u) =>
              u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u,
            ),
          })),
        };
      });
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
    if (!observerRef.current || type === 'recommend') return;

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
        value={type}
        className="p-4 w-full grid grid-flow-col overflow-hidden auto-cols-[50%] md:auto-cols-[33.33%] xl:auto-cols-[20%] max-sm:gap-1 sm:gap-2"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <UserInfoSkeleton key={i} />
        ))}
      </TabsContent>
    );
  }

  if (data.pages.flatMap((page) => page.results).length === 0) {
    return (
      <TabsContent
        value={type}
        className="w-full h-full flex flex-col gap-4 justify-center items-center"
      >
        <Contact className="size-10 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          {TYPE_MAP[type as keyof typeof TYPE_MAP]} 회원이 없습니다
        </span>
      </TabsContent>
    );
  }

  return (
    <TabsContent
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
      {isFetchingNextPage && (
        <div className="col-span-full grid grid-flow-col auto-cols-[50%] md:auto-cols-[33.33%] xl:auto-cols-[20%] max-sm:gap-1 sm:gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <UserInfoSkeleton key={i} />
          ))}
        </div>
      )}
      {hasNextPage && <div ref={observerRef} className="col-span-full h-1" />}
    </TabsContent>
  );
}
