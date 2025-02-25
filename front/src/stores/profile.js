import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  username: null,
  profile_image: null,
  region: null,
  hate_genres: [],
  like_genres: [],
  birth: null,
  rate_image: null,
  score: null,
  followers: [],
  followings: [],
  like_movies: [],
  dislike_movies: [],
  watching_movies: [],
  favorite_movies: [],
  friends: [],
  isFollowing: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileInfo(state, action) {
      const {
        id,
        username,
        profile_image,
        region,
        followers,
        followings,
        hate_genres,
        like_genres,
        birth,
        rate_image,
        score,
        like_movies,
        dislike_movies,
        watching_movies,
        favorite_movies,
        isFollowing,
      } = action.payload;
      state.userId = id;
      state.username = username;
      state.profile_image = profile_image;
      state.region = region;
      state.followers = followers;
      state.followings = followings;
      state.hate_genres = hate_genres;
      state.like_genres = like_genres;
      state.birth = birth;
      state.rate_image = rate_image;
      state.score = score;
      state.like_movies = like_movies;
      state.dislike_movies = dislike_movies;
      state.watching_movies = watching_movies;
      state.favorite_movies = favorite_movies;
      state.friends = Array.from(
        new Set(followers).intersection(new Set(followings)),
      );
      state.isFollowing = isFollowing;
    },
    setFollow(state, action) {
      const { followers, followings, isFollowing } = action.payload;
      state.followers = followers;
      state.followings = followings;
      state.isFollowing = isFollowing;
      state.friends = Array.from(
        new Set(followers).intersection(new Set(followings)),
      );
    },
  },
});

export const { setProfileInfo, setFollow } = profileSlice.actions;
export default profileSlice.reducer;
