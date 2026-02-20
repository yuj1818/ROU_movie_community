import { Genre } from '@/types/movie';

interface GenresListProps {
  type: 'like' | 'hate';
  genres: Genre[];
  isMine: boolean;
}

export default function GenresList({ type, genres, isMine }: GenresListProps) {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="w-full flex items-center justify-between">
        <h4 className="font-semibold">
          {type === 'like' ? '선호' : '불호'} 장르
        </h4>
        {isMine && (
          <span className="text-xs underline underline-offset-2 cursor-pointer">
            편집
          </span>
        )}
      </div>
      <div className="w-full flex flex-wrap gap-1 items-center">
        {genres && genres.length > 0 ? (
          <div></div>
        ) : (
          <span className="text-sm py-2 mx-auto font-extralight">
            {type === 'like' ? '선호' : '불호'} 장르가 없습니다
          </span>
        )}
      </div>
    </div>
  );
}
