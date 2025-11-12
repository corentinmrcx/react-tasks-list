import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import notificationsReducer from './slices/notification';

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;