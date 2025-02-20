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
    toggleDislikeMovie(state, action) {
      state.movieInfo.isDislike = !state.movieInfo.isDislike;
      state.movieInfo.dislike_movie_users_count = action.payload;
    },
    toggleFavoriteMovie(state, action) {
      state.movieInfo.isFavorite = !state.movieInfo.isFavorite;
      state.movieInfo.favorite_movie_users_count = action.payload;
    },
    toggleWatchMovie(state) {
      state.movieInfo.isWatch = !state.movieInfo.isWatch;
    },
  },
});

export const {
  setMovieInfo,
  toggleLikeMovie,
  toggleDislikeMovie,
  toggleFavoriteMovie,
  toggleWatchMovie,
} = movieSlice.actions;
export default movieSlice.reducer;
