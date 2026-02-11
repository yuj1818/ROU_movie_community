import { MovieDetail } from '@/types/movie';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleReaction } from '@/lib/movie';

export default function ReactionToggle({ movieId }: { movieId: number }) {
  const queryClient = useQueryClient();
  const movie = queryClient.getQueryData<MovieDetail>(['movie', movieId]);

  const mutation = useMutation({
    mutationFn: (type: 'LIKE' | 'DISLIKE') => toggleReaction(movieId, type),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['movie', movieId],
        (old: MovieDetail | undefined) =>
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
    <>
      <div className="h-full flex items-center text-sm font-extralight gap-1">
        <ThumbsUp
          onClick={() => mutation.mutate('LIKE')}
          className={cn(
            'cursor-pointer',
            movie?.reaction === 'LIKE' ? 'fill-white' : '',
          )}
        />
        <span>{movie?.like_movie_users_count}</span>
      </div>
      <div className="h-full flex items-center text-sm font-extralight gap-1">
        <ThumbsDown
          onClick={() => mutation.mutate('DISLIKE')}
          className={cn(
            'cursor-pointer',
            movie?.reaction === 'DISLIKE' ? 'fill-white' : '',
          )}
        />
        <span>{movie?.dislike_movie_users_count}</span>
      </div>
    </>
  );
}
