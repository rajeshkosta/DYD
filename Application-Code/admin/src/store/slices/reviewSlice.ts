import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mediaAndReviewService } from '../../services/api';

interface Review {
  id: string;
  rating: number;
  review: string;
  resortName: string;
  roomName: string;
  date: string;
}

interface ReviewState {
  reviews: Review[];
  selectedReview: Review | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  selectedReview: null,
  loading: false,
  error: null,
};

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async () => {
    const response = await mediaAndReviewService.getReviews();
    return response;
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      });
  },
});

export const { clearSelectedReview } = reviewSlice.actions;

export default reviewSlice.reducer;
