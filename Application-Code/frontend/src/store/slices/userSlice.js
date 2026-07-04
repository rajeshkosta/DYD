import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/api" // Import your API service

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk("user/fetchUserDetails", async (_, { rejectWithValue }) => {
    try {
        const response = await authService.getUserDetail();
        // console.log("response", response.data.data);

        return response.data.data; // Assuming API returns user data in `response.data`
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching user details");
    }
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        userDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUserDetails: (state) => {
            state.userDetails = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
