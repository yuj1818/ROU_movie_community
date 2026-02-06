import { MEDIA_BASE_URL } from '@/constants/url';
import { Actor } from '@/types/movie';
import Image from 'next/image';

export default function CastInfo({ actors }: { actors: Actor[] }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="font-semibold text-xl">출연진</h3>
      <div className="w-full grid grid-cols-2 max-h-52 overflow-y-auto rounded-md px-4 py-2 border border-foreground">
        {actors &&
          actors.slice(0, 10).map((actor) => (
            <div
              key={actor.person_id}
              className="w-full px-4 py-2 flex gap-4 items-center"
            >
              <Image
                className="h-12 w-12 rounded-full object-fit shrink-0"
                src={
                  actor.profile_path
                    ? MEDIA_BASE_URL.tmdbImgPath + actor.profile_path
                    : '/profile.png'
                }
                width={48}
                height={48}
                alt={`${actor.name}_profile_img`}
              />
              <span>{actor.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
