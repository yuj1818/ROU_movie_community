import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postInfo: null,
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
  },
});

export const { setPostInfo, toggleLike, toggleDislike } =
  communitySlice.actions;
export default communitySlice.reducer;
