import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/config';

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }) => {
      const response = await api.post('/auth/login/', credentials); // Remove /api prefix
      const token = response.data.key;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      return token;
    }
  );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.status = 'succeeded';
        localStorage.setItem('token', action.payload);
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;