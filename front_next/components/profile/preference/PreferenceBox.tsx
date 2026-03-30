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
    <div className="w-full md:flex-1 md:min-h-0">
      <div className="w-full flex flex-col md:max-h-full rounded-md border bg-white/10 py-4 px-3">
        <div className="flex flex-col gap-4 w-full flex-1 min-h-0 md:overflow-y-auto">
          <GenreList
            type="like"
            genres={profileInfo.like_genres}
            isMine={isMine}
          />
          <GenreList
            type="hate"
            genres={profileInfo.hate_genres}
            isMine={isMine}
          />
        </div>
      </div>
    </div>
  );
}
