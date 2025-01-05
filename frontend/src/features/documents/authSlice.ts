import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/config';  // Utilisez authApi au lieu de api

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
    const response = await authApi.post('/auth/login/', credentials);
    const token = response.data.key;
    localStorage.setItem('token', token); // Stockage du token
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