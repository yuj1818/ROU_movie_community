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
  isLike: boolean;
  isFavorite: boolean;
  isDislike: boolean;
  isWatch: boolean;
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

export interface Review {
  id: number;
  review_writor: {
    id: number;
    username: string;
    profile_path: string | null;
    nickname: string;
  };
  title: string;
  content: string;
  updated_at: string;
  created_at: string;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  review_movie: {
    movie_id: number;
    title: string;
  };
}
