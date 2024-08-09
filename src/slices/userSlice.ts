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
import { setCookie } from './../utils/cookie';

const initialState = {
  user: null as TUser | null,
  isAuthenticated: false,
  loadingStatus: 'idle' as 'idle' | 'loading' | 'error',
  error: null as string | null
};

const handlePending = (state: any) => {
  state.loadingStatus = 'loading';
  state.error = null;
};

const handleRejected = (state: any, action: any) => {
  state.loadingStatus = 'error';
  state.error = action.payload as string;
};

const handleAuthFulfilled = (state: any, action: any) => {
  state.loadingStatus = 'idle';
  state.user = action.payload;
  state.isAuthenticated = true;
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      setCookie('accessToken', '');
      localStorage.removeItem('refreshToken');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
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
      state.user = null;
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
        state.user = null;
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
