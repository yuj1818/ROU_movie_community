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
import authSlice from './auth';
import modalSlice from './modal';
import homeSlice from './home';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  movie: movieSlice,
  auth: authSlice,
  modal: modalSlice,
  home: homeSlice,
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
