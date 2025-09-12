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
    hideNotification: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif){
        notif.visible = false;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  },
});

export const { addNotification, hideNotification, removeNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;