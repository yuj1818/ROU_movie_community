import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postInfo: null,
  comments: null,
  confirmType: null,
  selectedCommentId: null,
  page: 1,
  sort: 0,
  totalPages: 0,
  friends: [],
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setPostInfo(state, action) {
      state.postInfo = action.payload;
    },
    toggleLike(state, action) {
      state.postInfo.isLike = !state.postInfo.isLike;
      state.postInfo.like_count = action.payload;
    },
    toggleDislike(state, action) {
      state.postInfo.isDislike = !state.postInfo.isDislike;
      state.postInfo.dislike_count = action.payload;
    },
    setComments(state, action) {
      state.comments = action.payload;
    },
    setConfirmType(state, action) {
      state.confirmType = action.payload;
    },
    setSelectedCommentId(state, action) {
      state.selectedCommentId = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setFriends(state, action) {
      state.friends = action.payload;
    },
    followRecommendedFriend(state, action) {
      const selectedId = action.payload;
      state.friends = state.friends.map((friend) => {
        if (friend.id === selectedId) {
          return { ...friend, isFollowing: !friend.isFollowing };
        } else {
          return friend;
        }
      });
    },
  },
});

export const {
  setPostInfo,
  toggleLike,
  toggleDislike,
  setComments,
  setConfirmType,
  setSelectedCommentId,
  setPage,
  setTotalPages,
  setSort,
  setFriends,
  followRecommendedFriend,
} = communitySlice.actions;
export default communitySlice.reducer;
