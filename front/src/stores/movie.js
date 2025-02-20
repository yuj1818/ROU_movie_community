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
    toggleLikeMovie(state, action) {
      state.movieInfo.isLike = !state.movieInfo.isLike;
      state.movieInfo.like_movie_users_count = action.payload;
    },
  },
});

export const { setMovieInfo, toggleLikeMovie } = movieSlice.actions;
export default movieSlice.reducer;
