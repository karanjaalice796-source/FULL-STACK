import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchFromApi } from '../api/api';
import type { DataState, FetchArgs } from '../types/types';

const initialState: DataState = { entries: {} };

export const fetchData = createAsyncThunk<
  { key: string; data: unknown },
  FetchArgs,
  { rejectValue: string }
>('data/fetch', async ({ key, endpoint, params }, { rejectWithValue, signal }) => {
  try {
    const data = await fetchFromApi<unknown>(endpoint, params, signal);
    return { key, data };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Something went wrong while fetching data.'
    );
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state, action) => {
        const { key } = action.meta.arg;
        state.entries[key] = {
          data: state.entries[key]?.data ?? null,
          status: 'loading',
          error: null,
        };
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.entries[action.payload.key] = {
          data: action.payload.data,
          status: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchData.rejected, (state, action) => {
        if (action.meta.aborted) return;

        const { key } = action.meta.arg;
        state.entries[key] = {
          data: null,
          status: 'failed',
          error: action.payload ?? action.error.message ?? 'Unknown error',
        };
      });
  },
});

export default dataSlice.reducer;
