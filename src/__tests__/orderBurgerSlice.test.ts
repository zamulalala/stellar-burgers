import reducer, {
  orderBurger,
  clearOrder,
  getCurrentOrderBurger,
  getOrderBurgerLoadingStatus
} from '../slices/orderBurgerSlice';
import { mockOrder } from './mocks/ordersMock';
import { RootState } from '../services/store';

describe('orderBurgerSlice', () => {
  const initialState = {
    currentOrderBurger: null,
    orderLoadingStatus: 'idle' as 'idle' | 'loading' | 'error'
  };

  it('должен установить статус загрузки "loading" при вызове orderBurger.pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = reducer(initialState, action);
    expect(getOrderBurgerLoadingStatus({ orderBurger: state } as RootState)).toBe('loading');
  });

  it('должен установить текущий заказ и статус "idle" при вызове orderBurger.fulfilled', () => {
    const action = { type: orderBurger.fulfilled.type, payload: { order: mockOrder } };
    const state = reducer(initialState, action);
    expect(getCurrentOrderBurger({ orderBurger: state } as RootState)).toEqual(mockOrder);
    expect(getOrderBurgerLoadingStatus({ orderBurger: state } as RootState)).toBe('idle');
  });

  it('должен установить статус "error" при вызове orderBurger.rejected', () => {
    const action = { type: orderBurger.rejected.type };
    const state = reducer(initialState, action);
    expect(getOrderBurgerLoadingStatus({ orderBurger: state } as RootState)).toBe('error');
  });

  it('должен очистить текущий заказ при вызове clearOrder', () => {
    const stateWithOrder = {
      ...initialState,
      currentOrderBurger: mockOrder
    };
    const action = clearOrder();
    const state = reducer(stateWithOrder, action);
    expect(getCurrentOrderBurger({ orderBurger: state } as RootState)).toBeNull();
  });
});
