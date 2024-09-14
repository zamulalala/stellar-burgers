import reducer, {
  fetchFeeds,
  getFeeds,
  getFeedsLoadingStatus,
  getTotal,
  getTotalToday
} from '../slices/feedsSlice';
import { mockOrders } from './mocks/ordersMock';
import { RootState } from '../services/store';
import { TOrder } from '@utils-types';

describe('feedsSlice', () => {
  const initialState: {
    feeds: TOrder[];
    feedsLoadingStatus: 'idle' | 'loading' | 'error';
    total: number;
    totalToday: number;
  } = {
    feeds: [],
    feedsLoadingStatus: 'idle',
    total: 0,
    totalToday: 0
  };

  it('должен установить статус загрузки "loading" при вызове fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = reducer(initialState, action);
    expect(getFeedsLoadingStatus({ feeds: state } as RootState)).toBe('loading');
  });

  it('должен установить фиды и статус "idle" при вызове fetchFeeds.fulfilled', () => {
    const payload = { orders: mockOrders, total: 100, totalToday: 10 };
    const action = { type: fetchFeeds.fulfilled.type, payload };
    const state = reducer(initialState, action);
    expect(getFeeds({ feeds: state } as RootState)).toEqual(mockOrders);
    expect(getFeedsLoadingStatus({ feeds: state } as RootState)).toBe('idle');
    expect(getTotal({ feeds: state } as RootState)).toBe(100);
    expect(getTotalToday({ feeds: state } as RootState)).toBe(10);
  });

  it('должен установить статус "error" при вызове fetchFeeds.rejected', () => {
    const action = { type: fetchFeeds.rejected.type };
    const state = reducer(initialState, action);
    expect(getFeedsLoadingStatus({ feeds: state } as RootState)).toBe('error');
  });
});
