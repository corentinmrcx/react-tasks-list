import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './slices/notification';

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});

export default store;