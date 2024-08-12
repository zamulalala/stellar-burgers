import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { getCookie, setCookie } from './../utils/cookie';

const initialState = {
  user: {
    name: '',
    email: ''
  } as TUser,
  isAuthenticated: getCookie('accessToken') ? true : false,
  loadingStatus: 'idle' as 'idle' | 'loading' | 'error',
  error: null as string | null
};

const handlePending = (state: any) => {
  state.loadingStatus = 'loading';
  state.error = null;
};

const handleRejected = (state: any, action: any) => {
  state.loadingStatus = 'error';
  state.error = action.error.message || 'An error occurred';
};

const handleAuthFulfilled = (state: any, action: any) => {
  state.loadingStatus = 'idle';
  state.user = action.payload;
  state.isAuthenticated = true;
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    await logoutApi();
    setCookie('accessToken', '');
    localStorage.removeItem('refreshToken');
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    await forgotPasswordApi(data);
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    await resetPasswordApi(data);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearUser(state) {
      state.user = {
        name: '',
        email: ''
      };
      state.isAuthenticated = false;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getUserLoadingStatus: (state) => state.loadingStatus,
    getUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(fetchUser.pending, handlePending)
      .addCase(fetchUser.fulfilled, handleAuthFulfilled)
      .addCase(fetchUser.rejected, handleRejected)
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, handleRejected)
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.loadingStatus = 'idle';
        state.user = {
          name: '',
          email: ''
        };
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, handleRejected)
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loadingStatus = 'idle';
      })
      .addCase(forgotPassword.rejected, handleRejected)
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.loadingStatus = 'idle';
      })
      .addCase(resetPassword.rejected, handleRejected);
  }
});

export const { clearError } = userSlice.actions;

export const {
  getUser,
  getIsAuthenticated,
  getUserLoadingStatus,
  getUserError
} = userSlice.selectors;

export default userSlice.reducer;
