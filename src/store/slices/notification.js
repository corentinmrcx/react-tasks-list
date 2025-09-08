import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  nextId: 1,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const { content, type } = action.payload;
      state.notifications.push({
        id: state.nextId,
        content,
        type,
        visible: true,
      });
      state.nextId += 1;
    },
  },
});

export const { addNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;