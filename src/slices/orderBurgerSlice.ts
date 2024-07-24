import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

const initialState = {
  orderBurger: null as TOrder | null,
  orderBurgerLoadingStatus: 'idle'
};

export const orderBurger = createAsyncThunk(
  'orderBurger/fetchOrders',
  async function (data: string[]) {
    return await orderBurgerApi(data);
  }
);

const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {},
  selectors: {
    getOrderBurger: (state) => state.orderBurger,
    getOrderBurgerLoadingStatus: (state) => state.orderBurgerLoadingStatus
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderBurgerLoadingStatus = 'loading';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderBurgerLoadingStatus = 'idle';
        state.orderBurger = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderBurgerLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  }
});

export const { getOrderBurger, getOrderBurgerLoadingStatus } =
  orderBurgerSlice.selectors;

export default orderBurgerSlice.reducer;
