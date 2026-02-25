'use client';

import { MEDIA_BASE_URL } from '@/constants/url';
import { cn } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MovieCard({
  title,
  poster_path,
  movie_id,
  className = '',
}: Movie & { className?: string }) {
  const router = useRouter();
  return (
    <li
      className={cn(
        'flex w-full aspect-3/4 cursor-pointer relative',
        className,
      )}
      onClick={() => router.push(`/movie/${movie_id}`)}
    >
      {poster_path ? (
        <Image
          src={MEDIA_BASE_URL.tmdbImgPath + poster_path}
          alt={`${title}_포스터`}
          fill
          sizes="300px"
        />
      ) : (
        <div className="w-full h-full bg-gray-400 flex items-center justify-center">
          <ImageOff className="w-3/4" />
        </div>
      )}
    </li>
  );
}
