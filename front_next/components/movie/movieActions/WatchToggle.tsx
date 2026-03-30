import { MovieDetail } from '@/types/movie';
import { TvMinimal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleWatch } from '@/lib/client/movie';
import { useParams } from 'next/navigation';

export default function WatchToggle() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const queryClient = useQueryClient();
  const movie = queryClient.getQueryData<MovieDetail>(['movie', movieId]);

  const mutation = useMutation({
    mutationFn: () => toggleWatch(movieId),
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
    <TvMinimal
      onClick={() => mutation.mutate()}
      className={cn('cursor-pointer', movie?.isWatch ? 'text-red-500' : '')}
    />
  );
}
