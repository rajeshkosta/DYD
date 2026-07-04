import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pageService } from '../../services/api'; // Ensure you have pageService in your API file

interface Page {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PageState {
  pages: Page[];
  selectedPage: Page | null;
  loading: boolean;
  error: string | null;
}

const initialState: PageState = {
  pages: [],
  selectedPage: null,
  loading: false,
  error: null,
};

// Async thunk for fetching pages
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async () => {
    const response = await pageService.getPage(); 
    return response;
  }
);

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    clearSelectedPage: (state) => {
      state.selectedPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = action.payload.data;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pages';
      });
  },
});

export const { clearSelectedPage } = pageSlice.actions;

export default pageSlice.reducer;