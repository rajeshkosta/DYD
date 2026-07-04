import { data } from "autoprefixer";
import axios from "axios";
import qs from "qs";

const BASE_URL = '/';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


export const authService = {
    sendOtp: (data) => {
        // console.log("data", data);

        const response = api.post('/api/user/sent-otp', data);
        return response.data;
    },

    verifyOtp: (data) => {
        // console.log("data", data);
        const response = api.post('/api/user/verify-otp', data);
        // console.log("response", response);
        return response;
    },

    login: (data) => {
        // console.log("data", data);
        const response = api.post('/api/user/create-user', data);
        return response;
    },

    getUserDetail: () => {
        const response = api.get('/api/user/user-details');
        // console.log("response", response);
        return response;
    },

    addAddress: (data) => {
        const response = api.post('/api/user/add-address', data);
        return response;
    },

    updateAddress: (id, data) => {
        // console.log("data", data, "id", id);
        const response = api.patch(`/api/user/update-address/${id}`, data);
        return response;
    },

    deleteAddress: (id) => {
        const response = api.delete(`/api/user/delete-address/${id}`);
        return response;
    },

}

export const freepikService = {
    genrateImage: (data) => {
        const response = api.post('/api/freepik/generate-logo', data);
        return response;
    },

    bgRemove: (data) => {
        // console.log("data", data);
        // const converted = qs.stringify(data);
        // console.log("converted", converted);

        const response = api.post('/api/freepik/remove-bg',
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response;
    },

    uploadMedia: (data) => {
        // console.log("data", ...data);
        const response = api.post('/api/media/upload-media', data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response;
    },

    deleteMedia: (id) => {
        // console.log("id", id);

        const response = api.delete(`/api/media/delete-media/${id}`);
        return response;
    },

    addCreation: (data) => {
        // console.log("data", data);
        const response = api.post('/api/user/add-creation', data);
        return response;
    }
}

export const orderService = {
    placeOrder: (data) => {
        console.log("data", data);
        // return
        const response = api.post('/api/order/create-order', data);
        return response;
    }
}

export const productService = {
    getProducts: () => {
        const response = api.get('/api/product/get-product');
        return response;
    }
}
