import { UserInfo } from '@/types/profile';
import { Badge } from '../../ui/badge';
import { TAGS } from '@/constants/category';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Genre } from '@/types/movie';
import { useSession } from 'next-auth/react';
import { useModalContext } from '@/contexts/ModalContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePreference } from '@/lib/client/profile';

export default function PreferenceEditForm({
  genres,
  type,
}: {
  genres: Genre[];
  type: 'like' | 'hate';
}) {
  const queryClient = useQueryClient();
  const session = useSession();
  const { close } = useModalContext();
  const [selectedGenres, setSelectedGenres] = useState<Record<string, boolean>>(
    () => {
      const initValue: Record<string, boolean> = {};
      for (const tag of TAGS) {
        initValue[tag.name] = false;
      }

      for (const genre of genres) {
        initValue[genre.name] = true;
      }

      return initValue;
    },
  );

  const onToggle = (name: string) => {
    setSelectedGenres((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const mutation = useMutation({
    mutationFn: () =>
      updatePreference(type, {
        genres: Object.keys(selectedGenres)
          .filter((key) => selectedGenres[key])
          .join(','),
      }),
    onSuccess: (updated: Partial<UserInfo>) => {
      if (!session.data?.user) return;
      queryClient.setQueryData(
        ['profile', Number(session.data?.user.id)],
        (old: UserInfo) =>
          old
            ? {
                ...old,
                [type === 'like' ? 'like_genres' : 'hate_genres']:
                  updated[type === 'like' ? 'like_genres' : 'hate_genres'],
              }
            : old,
      );
      close();
    },
  });

  return (
    <div className="w-100 max-w-[80vw] flex flex-col gap-4 p-4 items-center">
      <ul className="w-full flex flex-wrap gap-2 justify-center">
        {TAGS.map((tag) => (
          <Badge
            className="select-none"
            key={tag.id}
            onClick={() => onToggle(tag.name)}
            variant={
              !!selectedGenres[tag.name]
                ? type === 'like'
                  ? 'default'
                  : 'destructive'
                : 'outline'
            }
          >
            {tag.name}
          </Badge>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => close()}>
          취소
        </Button>
        <Button
          onClick={() => mutation.mutate()}
          variant={type === 'like' ? 'default' : 'destructive'}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
