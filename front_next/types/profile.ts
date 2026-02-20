import { Genre } from './movie';

export interface User {
  id: number;
  username: string;
  profile_image: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  profile_image: string | null;
  region: string;
  followers: User[];
  followings: User[];
  friends: User[];
  hate_genres: Genre[];
  like_genres: Genre[];
  birth: string;
  rate_image: string;
  score: number;
  isFollowing?: boolean;
}
