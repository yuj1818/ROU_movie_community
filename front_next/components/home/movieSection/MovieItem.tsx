import { MEDIA_BASE_URL } from '@/constants/url';
import { Movie } from '@/types/movie';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';

export default function MovieItem({ title, poster_path }: Movie) {
  return (
    <li className="keen-slider__slide flex w-full aspect-3/4 cursor-pointer">
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
