import { MovieDetail } from '@/types/movie';
import { TvMinimal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMovieInfo, toggleWatch } from '@/lib/client/movie';
import { useParams } from 'next/navigation';

export default function WatchToggle() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const queryClient = useQueryClient();

  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: async () => getMovieInfo(movieId),
  });

  const mutation = useMutation({
    mutationFn: () => toggleWatch(movieId),
    onSuccess: () => {
      queryClient.setQueryData(
        ['movie', movieId],
        (old: MovieDetail | undefined) =>
          old
            ? {
                ...old,
                isWatch: !old.isWatch,
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
