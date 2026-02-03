import { MEDIA_BASE_URL } from '@/constants/url';
import { cn } from '@/lib/utils';
import { Movie } from '@/types/movie';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';

export default function MovieCard({
  title,
  poster_path,
  className = '',
}: Movie & { className?: string }) {
  return (
    <li className={cn('flex w-full aspect-3/4 cursor-pointer', className)}>
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
