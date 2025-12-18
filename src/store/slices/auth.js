import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.getAuthenticatedUser.matchFulfilled,
      (state) => {
        state.isAuthenticated = true;
      }
    );
  },
});

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;

