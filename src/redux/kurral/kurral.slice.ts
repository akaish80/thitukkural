import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const kurralSlice = createSlice({
  name: 'kurral',
  initialState,
  reducers: {
    setKurralList(state, action) {
      state.list = action.payload;
      state.error = null;
    },
    selectKurral(state, action) {
      state.selected = action.payload;
    },
    setKurralError(state, action) {
      state.error = action.payload;
    },
    setKurralLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setKurralList, selectKurral, setKurralError, setKurralLoading } =
  kurralSlice.actions;
export default kurralSlice.reducer;