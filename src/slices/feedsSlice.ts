import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

const initialState = {
  feeds: [] as TOrder[],
  feedsLoadingStatus: 'idle' as 'idle' | 'loading' | 'error',
  total: 0,
  totalToday: 0
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchOrders',
  async function () {
    return await getFeedsApi();
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    getFeeds: (state) => state.feeds,
    getFeedsLoadingStatus: (state) => state.feedsLoadingStatus,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.feedsLoadingStatus = 'loading';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feedsLoadingStatus = 'idle';
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.feedsLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  }
});

export const { getFeeds, getFeedsLoadingStatus, getTotal, getTotalToday } =
  feedsSlice.selectors;

export default feedsSlice.reducer;
