'use client';

import { getGenreMovieList, getSortedMovieList } from '@/lib/movie';
import { Tag } from '@/types/movie';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

interface MovieSectionsProps {
  id: number;
  key?: Pick<Tag, 'key'>;
  type: 'genre' | 'sort';
}

export default function MovieSection({ id, key, type }: MovieSectionsProps) {
  const { data, isPending } = useQuery({
    queryKey: [`movies_${key}`, dayjs().format('YYYY-MM-DD')],
    queryFn: async () => {
      let res;
      if (type === 'genre') {
        res = await getGenreMovieList(id);
      } else {
        res = await getSortedMovieList(key!!);
      }
      return res;
    },
  });

  return <div></div>;
}
