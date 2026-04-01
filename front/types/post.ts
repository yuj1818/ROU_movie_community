import { ReactionType } from './movie';
import { User } from './profile';

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
  review_writor: User;
  review_movie: {
    movie_id: number;
    title: string;
    poster_path: string;
  } | null;
}

export interface Comment {
  id: number;
  comment_writor: User;
  content: string;
  commented_review: number;
  super_comment: number | null;
  created_at: string;
  updated_at: string;
  commented: Comment[];
  isLike: boolean | null;
  like_count: number;
}
