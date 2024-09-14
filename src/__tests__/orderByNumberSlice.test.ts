import reducer, {
  fetchOrderByNumber,
  getOrders,
  getOrderByNumberLoadingStatus,
  getOrderByNumber
} from '../slices/orderByNumberSlice';
import { mockOrders } from './mocks/ordersMock';
import { RootState } from '../services/store';

describe('orderByNumberSlice', () => {
  const initialState = {
    orders: [],
    orderByNumberLoadingStatus: 'idle' as 'idle' | 'loading' | 'error',
    orderByNumber: null
  };

  it('должен установить статус загрузки "loading" при вызове fetchOrderByNumber.pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = reducer(initialState, action);
    expect(getOrderByNumberLoadingStatus({ orderByNumber: state } as RootState)).toBe('loading');
  });

  it('должен установить заказы и статус "idle" при вызове fetchOrderByNumber.fulfilled', () => {
    const action = { type: fetchOrderByNumber.fulfilled.type, payload: { orders: mockOrders } };
    const state = reducer(initialState, action);
    expect(getOrders({ orderByNumber: state } as RootState)).toEqual(mockOrders);
    expect(getOrderByNumber({ orderByNumber: state } as RootState)).toEqual(mockOrders[0]);
    expect(getOrderByNumberLoadingStatus({ orderByNumber: state } as RootState)).toBe('idle');
  });

  it('должен установить статус "error" при вызове fetchOrderByNumber.rejected', () => {
    const action = { type: fetchOrderByNumber.rejected.type };
    const state = reducer(initialState, action);
    expect(getOrderByNumberLoadingStatus({ orderByNumber: state } as RootState)).toBe('error');
  });
});
