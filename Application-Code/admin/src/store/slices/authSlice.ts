import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ data: any; token: string }>) => {
      console.log("action.payload", action.payload.data);
      state.user = action.payload.data;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Save both user and token to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.data));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;