import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import movieSlice from './movie';
import modalSlice from './modal';
import homeSlice from './home';
import profileSlice from './profile';
import communitySlice from './community';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['movie', 'community'],
};

const rootReducer = combineReducers({
  movie: movieSlice,
  modal: modalSlice,
  home: homeSlice,
  profile: profileSlice,
  community: communitySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
