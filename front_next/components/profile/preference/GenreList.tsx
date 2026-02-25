import { useModalContext } from '@/contexts/ModalContext';
import { Genre } from '@/types/movie';
import PreferenceEditForm from './PreferenceEditForm';
import { Badge } from '../../ui/badge';
import { useState } from 'react';
import { CircleEllipsis, CircleX } from 'lucide-react';

interface GenresListProps {
  type: 'like' | 'hate';
  genres: Genre[];
  isMine: boolean;
}

export default function GenresList({ type, genres, isMine }: GenresListProps) {
  const { open } = useModalContext();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenPreferenceEditModal = () => {
    open({
      title: type === 'like' ? '선호 장르' : '불호 장르',
      content: <PreferenceEditForm type={type} genres={genres} />,
    });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex items-center justify-between">
        <h4 className="font-semibold">
          {type === 'like' ? '선호' : '불호'} 장르
        </h4>
        {isMine && (
          <span
            className="text-xs underline underline-offset-2 cursor-pointer"
            onClick={onOpenPreferenceEditModal}
          >
            편집
          </span>
        )}
      </div>
      <div className="w-full flex flex-wrap gap-2 items-center">
        {genres && genres.length > 0 ? (
          <>
            {isOpen
              ? genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant={type === 'like' ? 'default' : 'destructive'}
                  >
                    {genre.name}
                  </Badge>
                ))
              : genres.slice(0, 5).map((genre) => (
                  <Badge
                    key={genre.id}
                    variant={type === 'like' ? 'default' : 'destructive'}
                  >
                    {genre.name}
                  </Badge>
                ))}
            {genres.length > 5 &&
              (isOpen ? (
                <CircleX
                  className="size-5 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />
              ) : (
                <CircleEllipsis
                  className="size-5 cursor-pointer"
                  onClick={() => setIsOpen(true)}
                />
              ))}
          </>
        ) : (
          <span className="text-sm py-2 mx-auto font-extralight">
            {type === 'like' ? '선호' : '불호'} 장르가 없습니다
          </span>
        )}
      </div>
    </div>
  );
}
