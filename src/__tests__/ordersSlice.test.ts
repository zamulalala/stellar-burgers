import reducer, {
  fetchOrders,
  getOrders,
  getOrdersLoadingStatus
} from '../slices/ordersSlice';
import { mockOrders } from './mocks/ordersMock';
import { RootState } from '../services/store';

describe('ordersSlice', () => {
  const initialState = {
    orders: [],
    ordersLoadingStatus: 'idle' as 'idle' | 'loading' | 'error'
  };

  it('должен установить статус загрузки "loading" при вызове fetchOrders.pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = reducer(initialState, action);
    expect(getOrdersLoadingStatus({ orders: state } as RootState)).toBe('loading');
  });

  it('должен установить заказы и статус "idle" при вызове fetchOrders.fulfilled', () => {
    const action = { type: fetchOrders.fulfilled.type, payload: mockOrders };
    const state = reducer(initialState, action);
    expect(getOrders({ orders: state } as RootState)).toEqual(mockOrders);
    expect(getOrdersLoadingStatus({ orders: state } as RootState)).toBe('idle');
  });

  it('должен установить статус "error" при вызове fetchOrders.rejected', () => {
    const action = { type: fetchOrders.rejected.type };
    const state = reducer(initialState, action);
    expect(getOrdersLoadingStatus({ orders: state } as RootState)).toBe('error');
  });
});
