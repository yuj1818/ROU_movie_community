'use client';

import { Separator } from '@/components/ui/separator';
import { createComment, getCommentList } from '@/lib/client/post';
import { Comment } from '@/types/post';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import CommentInfo from './CommentInfo';
import CommentTextarea from './CommentTextarea';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { PaginatedResponse } from '@/types/common';

export default function CommentList() {
  const session = useSession();
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
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

  const mutation = useMutation({
    mutationFn: ({
      content,
      commentId,
    }: {
      commentId?: number;
      content: string;
    }) => createComment(reviewId, { content }, commentId),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ['post', reviewId, 'comments'],
      });
      setContent('');
    },
  });

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
      <div className="flex gap-2 my-2">
        <CommentTextarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={session.status !== 'authenticated'}
          placeholder={
            session.status !== 'authenticated'
              ? '🔒 로그인 후, 사용할 수 있습니다.'
              : '댓글을 작성해주세요'
          }
        />
        <Button
          className="h-full"
          onClick={() => mutation.mutate({ content })}
          disabled={session.status !== 'authenticated' || content.trim() === ''}
        >
          댓글 작성
        </Button>
      </div>
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
