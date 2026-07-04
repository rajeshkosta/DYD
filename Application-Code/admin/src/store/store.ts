import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import pageReducer from './slices/pageSlice';
import reviewReducer from './slices/reviewSlice';
import queryReducer from './slices/querySlice';
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    pages: pageReducer,
    reviews: reviewReducer,
    queries: queryReducer,
    product: productReducer,
    booking: orderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;