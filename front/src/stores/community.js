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
  },
});

export const { setPostInfo } = communitySlice.actions;
export default communitySlice.reducer;
