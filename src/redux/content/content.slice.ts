import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContent } from '../../services/contentService';

interface ContentState {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

export const loadContent = createAsyncThunk('content/loadContent', async () => {
  return await fetchContent();
});

const initialState: ContentState = {
  data: null,
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadContent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default contentSlice.reducer;