import { Button } from '@/components/ui/button';
import { User } from '@/types/profile';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserInfo({
  nickname,
  profile_image,
  id,
  isFollowing,
  onClickFollow,
}: User & {
  onClickFollow: ({
    targetId,
    isFollowing,
  }: {
    targetId: number;
    isFollowing: boolean;
  }) => void;
}) {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="h-fit w-full flex flex-col px-4 py-6 rounded-md bg-white/10 gap-4 items-center">
      <div className="h-12 rounded-full aspect-square overflow-hidden relative bg-white">
        <Image
          className="object-cover"
          src={profile_image ? `/api/media/${profile_image}` : '/profile.png'}
          fill
          sizes="300px"
          alt={`profile_img_${id}`}
        />
      </div>
      <span
        className="font-semibold cursor-pointer"
        onClick={() => router.push(`/profile/${id}`)}
      >
        {nickname}
      </span>
      {session.data?.user.id !== id ? (
        <Button
          size="sm"
          variant={isFollowing ? 'secondary' : 'default'}
          onClick={() =>
            onClickFollow({ targetId: id, isFollowing: Boolean(isFollowing) })
          }
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </Button>
      ) : (
        <div className="h-8" />
      )}
    </div>
  );
}
