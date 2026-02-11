import { MovieDetail } from '@/types/movie';
import { TvMinimal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleWatch } from '@/lib/movie';

export default function WatchToggle({ movie_id }: { movie_id: number }) {
  const queryClient = useQueryClient();
  const movie = queryClient.getQueryData<MovieDetail>(['movie', movie_id]);

  const mutation = useMutation({
    mutationFn: () => toggleWatch(movie_id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['movie', movie_id] });

      const prev = queryClient.getQueryData<MovieDetail>(['movie', movie_id]);

      queryClient.setQueryData<MovieDetail>(
        ['movie', movie_id],
        (old) =>
          old && {
            ...old,
            isWatch: !old.isWatch,
          },
      );

      return { prev };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['movie', movie_id], context?.prev);
    },
  });

  return (
    <TvMinimal
      onClick={() => mutation.mutate()}
      className={cn('cursor-pointer', movie?.isWatch ? 'text-red-500' : '')}
    />
  );
}
