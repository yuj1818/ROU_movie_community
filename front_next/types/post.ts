import { ReactionType } from './movie';

export type SortKey = 'recent' | 'likeDesc' | 'commentDesc';

export interface Post {
  reaction: ReactionType;
  id: number;
  title: string;
  content: string;
  updated_at: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  dislike_count: number;
  review_writor: {
    id: number;
    username: string;
    profile_image: string;
    nickname: string;
  };
  review_movie: {
    movie_id: number;
    title: string;
    poster_path: string;
  } | null;
}
