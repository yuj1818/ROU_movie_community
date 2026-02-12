import { MovieDetail } from '@/types/movie';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleFavorite } from '@/lib/movie';

export default function FavoriteToggle({ movieId }: { movieId: number }) {
  const queryClient = useQueryClient();
  const movie = queryClient.getQueryData<MovieDetail>(['movie', movieId]);

  const mutation = useMutation({
    mutationFn: () => toggleFavorite(movieId),
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
    <div className="h-full flex items-center text-sm font-extralight gap-1">
      <Star
        onClick={() => mutation.mutate()}
        className={cn(
          'cursor-pointer',
          movie?.isFavorite ? 'fill-yellow-500' : '',
        )}
      />
      <span>{movie?.favorite_movie_users_count}</span>
    </div>
  );
}
