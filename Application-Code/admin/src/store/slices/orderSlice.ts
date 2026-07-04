import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  created_at: string;
  updatedAt: string;
}

interface Address {
  id: string;
  userId: string;
  name: string;
  house: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderId: string;
  userId: string;
  addressId: string;
  price: number;
  designImage: string | null;
  logo: string;
  size: string;
  status: string;
  quantity: number;
  modeOfPayment: string;
  productName: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  address: Address;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await orderService.getOrders();
    return response;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;

export default orderSlice.reducer;
