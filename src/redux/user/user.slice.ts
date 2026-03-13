import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.error = null;
    },
    clearUser(state) {
      state.currentUser = null;
      state.error = null;
    },
    setUserError(state, action) {
      state.error = action.payload;
    },
    setUserLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserError, setUserLoading } = userSlice.actions;
export default userSlice.reducer;