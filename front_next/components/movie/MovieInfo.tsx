'use client';

import { getMovieInfo } from '@/lib/client/movie';
import { MovieDetail } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Youtube from '@/components/common/icons/Youtube';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { MEDIA_BASE_URL } from '@/constants/url';
import { useModalContext } from '@/contexts/ModalContext';
import Title from '../common/Title';
import WatchToggle from './movieActions/WatchToggle';
import ReactionToggle from './movieActions/ReactionToggle';
import FavoriteToggle from './movieActions/FavoriteToggle';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function MovieInfo() {
  const { status } = useSession();
  const params = useParams();
  const movieId = Number(params.movieId);
  const { data: movie, isPending } = useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: async () => getMovieInfo(movieId),
  });
  const { open } = useModalContext();

  const onOpenTrailerModal = () => {
    if (!movie) return;

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

  if (!movie) return;

  return (
    <div className="w-full flex gap-4 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <div className="flex text-base items-end gap-4">
          <Title size="lg">{movie.title}</Title>
          <div className="flex gap-1 items-center">
            <Star className="size-4 fill-yellow-500" />
            <span className="text-sm font-extralight">
              {movie.vote_average}
            </span>
          </div>
        </div>
        <Separator className="bg-muted-foreground" />
        <div className="flex text-base items-center gap-4">
          <Title size="sm">상영일</Title>
          <span className="text-sm font-extralight">{movie.release_date}</span>
        </div>
        <div className="flex text-base items-center gap-4">
          <Title size="sm">장르</Title>
          <div className="flex gap-2">
            {movie.genres.map((genre) => (
              <Badge key={genre.id}>{genre.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex text-base items-center gap-4">
          <Title size="sm">감독</Title>
          <span className="text-sm font-extralight">{movie.director}</span>
        </div>
        <span className="text-sm font-extralight">{movie.overview}</span>
        <Separator className="bg-muted-foreground" />
        <div className="flex gap-4 h-6">
          <WatchToggle />
          <ReactionToggle />
          <FavoriteToggle />
          <Youtube
            className="cursor-pointer w-8 h-6"
            onClick={onOpenTrailerModal}
          />
        </div>
      </div>
      <div className="w-2/5 max-w-100 aspect-3/4 relative">
        <Image
          className="rounded overflow-hidden"
          src={MEDIA_BASE_URL.tmdbImgPath + movie.poster_path || ''}
          alt={`${movie.title}_poster`}
          fill
          sizes="300px"
          loading="eager"
        />
      </div>
    </div>
  );
}
