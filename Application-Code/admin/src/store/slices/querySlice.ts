import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryService } from '../../services/api';  // Make sure you have queryService in your api file

interface Query {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface QueryState {
  queries: Query[];
  selectedQuery: Query | null;
  loading: boolean;
  error: string | null;
}

const initialState: QueryState = {
  queries: [],
  selectedQuery: null,
  loading: false,
  error: null,
};

// Async thunk for fetching queries
export const fetchQueries = createAsyncThunk(
  'queries/fetchQueries',
  async () => {
    const response = await queryService.getQueries(); 
    return response;
  }
);

const querySlice = createSlice({
  name: 'queries',
  initialState,
  reducers: {
    clearSelectedQuery: (state) => {
      state.selectedQuery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = action.payload.data;   
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch queries';
      });
  },
});

export const { clearSelectedQuery } = querySlice.actions;

export default querySlice.reducer;
