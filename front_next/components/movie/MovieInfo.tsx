'use client';

import { getMovieInfo } from '@/lib/movie';
import { MovieDetail } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsDown, ThumbsUp, TvMinimal } from 'lucide-react';
import Youtube from '@/components/common/icons/Youtube';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MEDIA_BASE_URL } from '@/constants/url';
import { useModalContext } from '@/contexts/ModalContext';

export default function MovieInfo({
  initialData,
}: {
  initialData: MovieDetail;
}) {
  const { data: movie, isPending } = useQuery<MovieDetail>({
    queryKey: ['movie', initialData.movie_id],
    queryFn: async () => {
      const res = await getMovieInfo(initialData.movie_id.toString());
      return res;
    },
    initialData,
  });
  const { open } = useModalContext();

  const onOpenTrailerModal = () => {
    open({
      title: `${movie.title} 트레일러`,
      content: (
        <iframe
          className="w-50vw min-w-100 aspect-video"
          loading="lazy"
          src={`${MEDIA_BASE_URL.youtubePath}${movie.videos}?autoplay=1&mute=0&loop=1&controls=1&rel=0&modestbranding=1`}
          allow="autoplay; encrypted-media"
        />
      ),
    });
  };

  return (
    <div className="w-full grid grid-cols-5 gap-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex text-base items-end gap-4">
          <h3 className="font-semibold text-2xl">{movie.title}</h3>
          <div className="flex gap-1 items-center">
            <Star className="size-4 fill-yellow-500" />
            <span className="text-sm font-extralight">
              {movie.vote_average}
            </span>
          </div>
        </div>
        <Separator className="bg-muted-foreground" />
        <div className="flex text-base items-center gap-4">
          <h3 className="font-semibold text-lg">상영일</h3>
          <span className="text-sm font-extralight">{movie.release_date}</span>
        </div>
        <div className="flex text-base items-center gap-4">
          <h3 className="font-semibold text-lg">장르</h3>
          <div className="flex gap-2">
            {movie.genres.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex text-base items-center gap-4">
          <h3 className="font-semibold text-lg">감독</h3>
          <span className="text-sm font-extralight">{movie.director}</span>
        </div>
        <span className="text-sm font-extralight">{movie.overview}</span>
        <Separator className="bg-muted-foreground" />
        <div className="flex gap-4 h-6">
          <TvMinimal
            className={cn(
              'cursor-pointer',
              movie.isWatch ? 'text-red-500' : '',
            )}
          />
          <div className="h-full flex items-center text-sm font-extralight gap-1">
            <ThumbsUp
              className={cn('cursor-pointer', movie.isLike ? 'fill-white' : '')}
            />
            <span>{movie.like_movie_users_count}</span>
          </div>
          <div className="h-full flex items-center text-sm font-extralight gap-1">
            <ThumbsDown
              className={cn('cursor-pointer', movie.isLike ? 'fill-white' : '')}
            />
            <span>{movie.dislike_movie_users_count}</span>
          </div>
          <div className="h-full flex items-center text-sm font-extralight gap-1">
            <Star
              className={cn(
                'cursor-pointer',
                movie.isFavorite ? 'fill-yellow-500' : '',
              )}
            />
            <span>{movie.favorite_movie_users_count}</span>
          </div>
          <Youtube
            className="cursor-pointer w-8 h-6"
            onClick={onOpenTrailerModal}
          />
        </div>
      </div>
      <div className="col-span-2 w-full aspect-3/4 relative">
        <Image
          className="rounded overflow-hidden"
          src={MEDIA_BASE_URL.tmdbImgPath + movie.poster_path || ''}
          alt={`${movie.title}_poster`}
          fill
          sizes="300px"
        />
      </div>
    </div>
  );
}
