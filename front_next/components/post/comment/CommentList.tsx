'use client';

import { Separator } from '@/components/ui/separator';
import { getCommentList } from '@/lib/client/post';
import { Comment } from '@/types/post';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import CommentInfo from './CommentInfo';

export default function CommentList() {
  const params = useParams();
  const reviewId = Number(params.reviewId);
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

  const comments = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="font-semibold">{`댓글 (${comments.length})`}</span>
      <Separator className="bg-white" />
      <ul className="w-full flex flex-col gap-2">
        {comments.map((comment: Comment) => (
          <CommentInfo key={comment.id} {...comment} />
        ))}
      </ul>
    </div>
  );
}
