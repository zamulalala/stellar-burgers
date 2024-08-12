import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

const initialState = {
  orders: [] as TOrder[],
  orderByNumberLoadingStatus: 'idle' as 'idle' | 'loading' | 'error',
  orderByNumber: null as TOrder | null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber/fetchOrders',
  getOrderByNumberApi
);

const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getOrderByNumberLoadingStatus: (state) => state.orderByNumberLoadingStatus,
    getOrderByNumber: (state) => state.orderByNumber
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderByNumberLoadingStatus = 'loading';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumberLoadingStatus = 'idle';
        state.orders = action.payload.orders;
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.orderByNumberLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  }
});

export const { getOrders, getOrderByNumberLoadingStatus, getOrderByNumber } =
  orderByNumberSlice.selectors;

export default orderByNumberSlice.reducer;
