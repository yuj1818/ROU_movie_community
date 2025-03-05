import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postInfo: null,
  comments: null,
  confirmType: null,
  selectedCommentId: null,
  page: 1,
  sort: 0,
  totalPages: 0,
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
} = communitySlice.actions;
export default communitySlice.reducer;
