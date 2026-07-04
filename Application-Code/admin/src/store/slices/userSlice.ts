import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  address: string;
  specialRequests?: string[];
  reviews?: any[];
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await userService.getUsers();
    return response;
  }
);



const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
     
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;