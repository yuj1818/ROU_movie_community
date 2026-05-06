import { MovieDetail } from '@/types/movie';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMovieInfo, toggleReaction } from '@/lib/client/movie';
import { useParams } from 'next/navigation';

export default function ReactionToggle() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const queryClient = useQueryClient();

  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: async () => getMovieInfo(movieId),
  });

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
