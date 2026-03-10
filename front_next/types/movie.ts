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

export interface Actor {
  id: number;
  person_id: number;
  name: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  genre_id: number;
  name: string;
}

export interface MovieDetail extends Movie {
  isFavorite: boolean;
  isWatch: boolean;
  reaction: ReactionType;
  actors: Actor[];
  genres: Genre[];
  like_movie_users_count: number;
  dislike_movie_users_count: number;
  favorite_movie_users_count: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  director: string;
}

export type ReactionType = 'LIKE' | 'DISLIKE' | null;
