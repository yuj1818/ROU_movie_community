import { SortKey } from '@/constants/category';

export interface Movie {
  movie_id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  videos: string | null;
  overview: string | null;
}

export interface Tag {
  id: number;
  name: string;
  key?: SortKey;
}
