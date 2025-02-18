import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movieInfo: null,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setMovieInfo(state, action) {
      state.movieInfo = action.payload;
    },
  },
});

export const { setMovieInfo } = movieSlice.actions;
export default movieSlice.reducer;
