'use client';

import { MEDIA_BASE_URL } from '@/constants/url';
import { cn } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export default function MovieCard({
  title,
  poster_path,
  movie_id,
  className = '',
  priority = false,
}: Movie & { className?: string; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false);

  const router = useRouter();
  return (
    <li
      className={cn(
        'flex w-full aspect-3/4 cursor-pointer relative',
        className,
      )}
      onClick={() => router.push(`/movie/${movie_id}`)}
    >
      {!loaded && <Skeleton className="absolute inset-0 rounded" />}
      {poster_path ? (
        <Image
          src={MEDIA_BASE_URL.tmdbImgPath + poster_path}
          alt={`${title}_포스터`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16.6vw"
          onLoadingComplete={() => setLoaded(true)}
          className={cn(
            'object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : (
        <div className="w-full h-full bg-gray-400 flex items-center justify-center">
          <ImageOff className="w-3/4" />
        </div>
      )}
    </li>
  );
}
