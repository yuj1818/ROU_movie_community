import { combineReducers, configureStore } from '@reduxjs/toolkit';
import movieSlice from './movie';

const rootReducer = combineReducers({
  movie: movieSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
