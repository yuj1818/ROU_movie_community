import { Genre } from './movie';

export interface User {
  id: number;
  username: string;
  nickname: string;
  profile_image: string | null;
  isFollowing?: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  profile_image: string | null;
  region: string;
  followers_count: number;
  followings_count: number;
  friends_count: number;
  hate_genres: Genre[];
  like_genres: Genre[];
  birth: string;
  rate_image: string;
  score: number;
  isFollowing?: boolean;
}
