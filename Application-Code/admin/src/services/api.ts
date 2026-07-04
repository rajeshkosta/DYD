import axios from 'axios';
import { AxiosProgressEvent } from 'axios';
import { Recipient } from '../types';

const BASE_URL = '/';


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/admin/login', credentials);
    // console.log("response", response);
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/api/user/get-Users');
    // console.log("response users ", response);
    return response.data;

  },

  createUser: async (user: any) => {
    const response = await api.post('/api/admin/create-user', user);
    console.log("response", response);
    return response.data;
  },

  deleteUser: async (userId: string, reason: string) => {
    const response = await api.delete(`/api/admin/delete-user/${userId}`, {
      data: { reason },
    });
    // console.log("response", response);

    return response.data;
  },

  updateUser: async (id: string, updatedUser: any) => {
    // console.log("updatedUser", updatedUser, "id", id);
    const response = await api.patch(`/api/admin/update-user/${id}`, updatedUser);
    // console.log("response", response);

    return response.data;
  },

  sendEmail: async (emailData: { recipients: any, subject: string, content: string }) => {
    // console.log("emailData", emailData);
    const response = await api.post('/api/admin/send-email', emailData);
    return response.data;
  },

};

export const mediaAndReviewService = {


  uploadMedia: async (data: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    const response = await api.post('/api/media/upload-media', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          onUploadProgress(progressEvent as unknown as AxiosProgressEvent); // Correct casting
        }
      },
    });
    // console.log("response", response);

    return response.data;
  },

  deleteMedia: async (mediaId: string) => {
    const response = await api.delete(`/api/media/delete-media/${mediaId}`);
    // console.log("response", response.data);

    return response;
  },

  getReviews: async () => {
    console.log("getReviews called");
    const response = await api.get('/api/properties/get-all-reviews');
    console.log("response", response);

    return response.data;
  },

  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/api/properties/delete-review/${reviewId}`);
    // console.log("response", response);

    return response.data;
  },

};

export const queryService = {
  getQueries: async () => {
    const response = await api.get('/api/query/get-queries');
    return response.data;
  },
  deleteQuery: async (queryId: string) => {
    const response = await api.delete(`/api/query/delete-query/${queryId}`);
    return response.data;
  }
}



export const productService = {
  addProduct: async (product: any) => {
    console.log("product", product);
    
    const response = await api.post('/api/product/add-product', product);
    return response.data;
  },
  updateProduct: async (productId: string, product: any) => {
    const response = await api.patch(`/api/product/update-product/${productId}`, product);
    return response.data;
  },
  updateStatus: async (productId: string, status: boolean) => {
    const response = await api.patch(`/api/product/update-status/${productId}`, { status });
    return response.data
  },
  getProducts: async () => {
    const response = await api.get('/api/product/get-product');
    return response.data;
  },
  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/api/product/delete-product/${productId}`);
    return response.data;
  }
}

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/api/order/get-orders');
    return response.data
  },
  updateStatus: async (orderId: string, status: string, reason: string) => {
     console.log("status", status, "orderid", orderId);

    const response = await api.patch(`/api/order/update-order/${orderId}`, { status, reason });
    return response.data
  },
  deleteBooking: async (orderId: string) => {
    const response = await api.delete(`/api/order/delete-order/${orderId}`);
    return response.data
  }
}

export const pageService = {
  getPage: async () => {
    const response = await api.get('/api/page');
    // console.log("response", response);
    return response.data;
  },

  createPage: async (page: any) => {
    const response = await api.post('/api/page/create', page);
    // console.log("response", response);
    return response.data;
  },

  updatePage: async (id: string, page: any) => {
    const response = await api.patch(`/api/page/${id}`, page);
    // console.log("response", response);
    return response.data;
  },

  deletePage: async (id: string) => {
    console.log("id", id);

    const response = await api.delete(`/api/page/${id}`);
    // console.log("response", response);
    return response.data;
  },
}
