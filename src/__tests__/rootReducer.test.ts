import store from '../services/store';
import { RootState } from '../services/store';
import '../utils/cookie'; // Added import for cookie utils

jest.mock('../utils/cookie', () => ({
  getCookie: jest.fn(() => 'mocked-cookie-value')
}));

describe('rootReducer', () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = store.getState();
  });

  it('должен иметь правильную структуру начального состояния', () => {
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('orderBurger');
    expect(initialState).toHaveProperty('orderByNumber');
    expect(initialState).toHaveProperty('user');
  });

  it('должен иметь правильные начальные значения для каждого редюсера', () => {
    expect(initialState.burgerConstructor).toBeDefined();
    expect(initialState.ingredients).toBeDefined();
    expect(initialState.feeds).toBeDefined();
    expect(initialState.orders).toBeDefined();
    expect(initialState.orderBurger).toBeDefined();
    expect(initialState.orderByNumber).toBeDefined();
    expect(initialState.user).toBeDefined();
  });

  it('должен иметь правильные типы для каждого редюсера', () => {
    expect(typeof initialState.burgerConstructor).toBe('object');
    expect(typeof initialState.ingredients).toBe('object');
    expect(typeof initialState.feeds).toBe('object');
    expect(typeof initialState.orders).toBe('object');
    expect(typeof initialState.orderBurger).toBe('object');
    expect(typeof initialState.orderByNumber).toBe('object');
    expect(typeof initialState.user).toBe('object');
  });

  it('должен иметь возможность отправлять действия', () => {
    const testAction = { type: 'TEST_ACTION' };
    expect(() => store.dispatch(testAction)).not.toThrow();
  });
});
