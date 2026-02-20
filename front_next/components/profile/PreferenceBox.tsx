import GenreList from './GenreList';
import { UserInfo } from '@/types/profile';

interface PreferenceBoxProps {
  profileInfo: UserInfo;
  isMine: boolean;
}

export default function PreferenceBox({
  profileInfo,
  isMine,
}: PreferenceBoxProps) {
  return (
    <div className="w-full rounded bg-white/30 p-4 flex flex-col gap-2">
      <GenreList type="like" genres={profileInfo.like_genres} isMine={isMine} />
      <GenreList type="hate" genres={profileInfo.hate_genres} isMine={isMine} />
    </div>
  );
}
