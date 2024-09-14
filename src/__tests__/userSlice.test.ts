import reducer, {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  clearError,
  getUser,
  getIsAuthenticated,
  getUserLoadingStatus,
  getUserError
} from '../slices/userSlice';
import { RootState } from '../services/store';
import * as api from '../utils/burger-api';
import * as cookie from '../utils/cookie';
import {
  mockUser,
  mockAuthResponse,
  mockRegisterData,
  mockLoginData,
  mockUpdateUserData,
  mockForgotPasswordData,
  mockResetPasswordData
} from './mocks/userMock';

// Мокаем API и функции работы с куками
jest.mock('../utils/burger-api');
jest.mock('../utils/cookie');

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('userSlice', () => {
  const initialState = {
    user: { name: '', email: '' },
    isAuthenticated: false,
    loadingStatus: 'idle' as 'idle' | 'loading' | 'error',
    error: null as string | null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен установить статус загрузки "loading" при вызове любого pending экшена', () => {
    const pendingActions = [
      registerUser.pending, loginUser.pending, fetchUser.pending,
      updateUser.pending, logoutUser.pending, forgotPassword.pending, resetPassword.pending
    ];

    pendingActions.forEach(action => {
      const state = reducer(initialState, { type: action.type });
      expect(getUserLoadingStatus({ user: state } as RootState)).toBe('loading');
      expect(getUserError({ user: state } as RootState)).toBeNull();
    });
  });

  it('должен установить пользователя и аутентификацию при успешной регистрации', async () => {
    (api.registerUserApi as jest.Mock).mockResolvedValue(mockAuthResponse);

    const action = await registerUser(mockRegisterData)(jest.fn(), jest.fn(), {});
    const state = reducer(initialState, action);

    expect(getUser({ user: state } as RootState)).toEqual(mockUser);
    expect(getIsAuthenticated({ user: state } as RootState)).toBe(true);
    expect(getUserLoadingStatus({ user: state } as RootState)).toBe('idle');
    expect(cookie.setCookie).toHaveBeenCalledWith('accessToken', mockAuthResponse.accessToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', mockAuthResponse.refreshToken);
  });

  it('должен установить ошибку при неудачной регистрации', async () => {
    const errorMessage = 'Registration failed';
    (api.registerUserApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const action = await registerUser(mockRegisterData)(jest.fn(), jest.fn(), {});
    const state = reducer(initialState, action);

    expect(getUserLoadingStatus({ user: state } as RootState)).toBe('error');
    expect(getUserError({ user: state } as RootState)).toBe(errorMessage);
  });

  it('должен установить пользователя и аутентификацию при успешном входе', async () => {
    (api.loginUserApi as jest.Mock).mockResolvedValue(mockAuthResponse);

    const action = await loginUser(mockLoginData)(jest.fn(), jest.fn(), {});
    const state = reducer(initialState, action);

    expect(getUser({ user: state } as RootState)).toEqual(mockUser);
    expect(getIsAuthenticated({ user: state } as RootState)).toBe(true);
    expect(getUserLoadingStatus({ user: state } as RootState)).toBe('idle');
    expect(cookie.setCookie).toHaveBeenCalledWith('accessToken', mockAuthResponse.accessToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', mockAuthResponse.refreshToken);
  });

  it('должен обновить данные пользователя при успешном обновлении', async () => {
    const updatedUser = { ...mockUser, ...mockUpdateUserData };
    (api.updateUserApi as jest.Mock).mockResolvedValue({ user: updatedUser });

    const action = await updateUser(mockUpdateUserData)(jest.fn(), jest.fn(), {});
    const state = reducer({ ...initialState, user: mockUser, isAuthenticated: true }, action);

    expect(getUser({ user: state } as RootState)).toEqual(updatedUser);
    expect(getUserLoadingStatus({ user: state } as RootState)).toBe('idle');
  });

  it('должен очистить пользователя при успешном выходе', async () => {
    (api.logoutApi as jest.Mock).mockResolvedValue({});

    const action = await logoutUser()(jest.fn(), jest.fn(), {});
    const state = reducer({ ...initialState, user: mockUser, isAuthenticated: true }, action);

    expect(getUser({ user: state } as RootState)).toEqual({ name: '', email: '' });
    expect(getIsAuthenticated({ user: state } as RootState)).toBe(false);
    expect(cookie.setCookie).toHaveBeenCalledWith('accessToken', '');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
  });

  it('должен установить статус "idle" при успешном запросе на сброс пароля', async () => {
    (api.forgotPasswordApi as jest.Mock).mockResolvedValue({});

    const action = await forgotPassword(mockForgotPasswordData)(jest.fn(), jest.fn(), {});
    const state = reducer(initialState, action);

    expect(getUserLoadingStatus({ user: state } as RootState)).toBe('idle');
  });

  it('должен установить статус "idle" при успешном сбросе пароля', async () => {
    (api.resetPasswordApi as jest.Mock).mockResolvedValue({});

    const action = await resetPassword(mockResetPasswordData)(jest.fn(), jest.fn(), {});
    const state = reducer(initialState, action);

    expect(getUserLoadingStatus({ user: state } as RootState)).toBe('idle');
  });

  it('должен очистить ошибку при вызове clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const action = clearError();
    const state = reducer(stateWithError, action);
    expect(getUserError({ user: state } as RootState)).toBeNull();
  });
});
