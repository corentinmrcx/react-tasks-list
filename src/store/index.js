import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import notificationsReducer from './slices/notification';
import authReducer from './slices/auth';

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;