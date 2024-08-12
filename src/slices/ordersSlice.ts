import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

const initialState = {
  orders: [] as TOrder[],
  ordersLoadingStatus: 'idle' as 'idle' | 'loading' | 'error'
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', getOrdersApi);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getOrdersLoadingStatus: (state) => state.ordersLoadingStatus
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoadingStatus = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoadingStatus = 'idle';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.ordersLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  }
});

export const { getOrders, getOrdersLoadingStatus } = ordersSlice.selectors;

export default ordersSlice.reducer;
