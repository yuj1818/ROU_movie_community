import { MovieDetail } from '@/types/movie';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMovieInfo, toggleFavorite } from '@/lib/client/movie';
import { useParams } from 'next/navigation';

export default function FavoriteToggle() {
  const params = useParams();
  const movieId = Number(params.movieId);
  const queryClient = useQueryClient();

  const { data: movie } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: async () => getMovieInfo(movieId),
  });

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
