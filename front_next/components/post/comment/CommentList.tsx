'use client';

import { Separator } from '@/components/ui/separator';
import { getCommentList } from '@/lib/client/post';
import { Comment } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import CommentInfo from './CommentInfo';
import CommentTextarea from './CommentTextarea';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function CommentList() {
  const session = useSession();
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['post', reviewId, 'comments'],
      queryFn: ({ pageParam }) => getCommentList(reviewId, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;

        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('page'));
      },
    });

  const [content, setContent] = useState('');

  const comments = data?.pages.flatMap((page) => page.results) ?? [];

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
    const target = observerRef.current;
    if (!target) return;

    const option = { root: null, rootMargin: '200px', threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [handleObserver]);

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="font-semibold">{`댓글 (${data?.pages[0]?.count ?? 0})`}</span>
      <Separator className="bg-white" />
      <div className="w-full flex flex-col gap-2">
        {comments.map((comment: Comment) => (
          <CommentInfo key={comment.id} {...comment} />
        ))}
        {hasNextPage && <div ref={observerRef} className="h-1" />}
        {isFetchingNextPage && <div>Loading...</div>}
      </div>
    </div>
  );
}
