import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPostInfo, toggleReaction } from '@/lib/client/post';
import { Post } from '@/types/post';
import { useParams } from 'next/navigation';

export default function ReactionToggle() {
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const queryClient = useQueryClient();

  const { data: post } = useQuery<Post>({
    queryKey: ['post', reviewId],
    queryFn: () => getPostInfo(reviewId),
  });

  const mutation = useMutation({
    mutationFn: (type: 'LIKE' | 'DISLIKE') => toggleReaction(reviewId, type),
    onSuccess: (data) => {
      queryClient.setQueryData(['post', reviewId], (old: Post | undefined) =>
        old
          ? {
              ...old,
              ...data,
            }
          : old,
      );
    },
  });

  return (
    <div className="h-6 flex gap-4 justify-end">
      <div className="h-full flex items-center text-sm font-extralight gap-1">
        <ThumbsUp
          onClick={() => mutation.mutate('LIKE')}
          className={cn(
            'cursor-pointer',
            post?.reaction === 'LIKE' ? 'fill-white' : '',
          )}
        />
        <span>{post?.like_count}</span>
      </div>
      <div className="h-full flex items-center text-sm font-extralight gap-1">
        <ThumbsDown
          onClick={() => mutation.mutate('DISLIKE')}
          className={cn(
            'cursor-pointer',
            post?.reaction === 'DISLIKE' ? 'fill-white' : '',
          )}
        />
        <span>{post?.dislike_count}</span>
      </div>
    </div>
  );
}
