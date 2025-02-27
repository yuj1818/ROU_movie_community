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
  selectedData: null,
  category: 'follower',
  targets: ['좋아요한 영화', '리뷰 쓴 영화', '찜한 영화', '시청 목록'],
  targetIdx: 0,
  page: 1,
  totalItems: 0,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    setSelectedData(state, action) {
      state.selectedData = action.payload;
    },
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
      state.friends = followers.filter((follower) =>
        followings.some((following) => following.id === follower.id),
      );
      state.isFollowing = isFollowing;
    },
    setFollow(state, action) {
      const { followers, followings, isFollowing } = action.payload;
      state.followers = followers;
      state.followings = followings;
      state.isFollowing = isFollowing;
      state.friends = followers.filter((follower) =>
        followings.some((following) => following.id === follower.id),
      );
      if (state.category === 'follower') {
        state.selectedData = state.followers;
      } else if (state.category === 'friend') {
        state.selectedData = followers.filter((follower) =>
          followings.some((following) => following.id === follower.id),
        );
      }
    },
    followOthers(state, action) {
      const { isFollowing, id, isMine, username, profile_image } =
        action.payload;
      if (isMine) {
        if (isFollowing) {
          state.followers = state.followers.map((follower) =>
            follower.id === id ? { ...follower, isFollowing } : follower,
          );
          state.followings.push({
            id,
            username,
            profile_image,
            isFollowing,
          });
          state.friends = state.followers.filter((follower) =>
            state.followings.some((following) => following.id === follower.id),
          );
          state.selectedData = state.followers;
        } else {
          state.friends = state.friends.filter((friend) => friend.id !== id);
          state.followings = state.followings.filter(
            (following) => following.id !== id,
          );
          state.followers = state.followers.map((follower) =>
            follower.id === id ? { ...follower, isFollowing } : follower,
          );
          if (state.category === 'follower') {
            state.selectedData = state.followers;
          } else if (state.category === 'friend') {
            state.selectedData = state.friends;
          } else {
            state.selectedData = state.followings;
          }
        }
      } else {
        state.selectedData = state.selectedData.map((user) =>
          user.id === id ? { ...user, isFollowing } : user,
        );
        state.followers = state.followers.map((follower) =>
          follower.id === id ? { ...follower, isFollowing } : follower,
        );

        state.followings = state.followings.map((following) =>
          following.id === id ? { ...following, isFollowing } : following,
        );
      }
    },
    setLikeGenres(state, action) {
      state.like_genres = action.payload;
    },
    setHateGenres(state, action) {
      state.hate_genres = action.payload;
    },
    setTarget(state, action) {
      state.targetIdx = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setTotalItems(state, action) {
      state.totalItems = action.payload;
    },
  },
});

export const {
  setProfileInfo,
  setFollow,
  setCategory,
  setSelectedData,
  followOthers,
  setLikeGenres,
  setHateGenres,
  setTarget,
  setPage,
  setTotalItems,
} = profileSlice.actions;
export default profileSlice.reducer;
