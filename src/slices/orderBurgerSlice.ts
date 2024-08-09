import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

const initialState = {
  currentOrderBurger: null as TOrder | null,
  orderLoadingStatus: 'idle' as 'idle' | 'loading' | 'error'
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
  reducers: {
    clearOrder: (state) => {
      state.currentOrderBurger = null;
    }
  },
  selectors: {
    getCurrentOrderBurger: (state) => state.currentOrderBurger,
    getOrderBurgerLoadingStatus: (state) => state.orderLoadingStatus
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderLoadingStatus = 'loading';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderLoadingStatus = 'idle';
        state.currentOrderBurger = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  }
});

export const { clearOrder } = orderBurgerSlice.actions;

export const { getCurrentOrderBurger, getOrderBurgerLoadingStatus } =
  orderBurgerSlice.selectors;

export default orderBurgerSlice.reducer;
