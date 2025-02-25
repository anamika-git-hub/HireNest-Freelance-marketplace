import axios from "axios";
import dotenv from 'dotenv';
import store from "../store/store";
import { logoutUser } from "../store/userSlice";
import toast from "react-hot-toast";

const axiosConfig  = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL!,
    headers: {
        "Content-Type": 'application/json',
    },
    validateStatus: null
})
console.log('Setting up request interceptor');
axiosConfig.interceptors.request.use(
    (config) => {

        console.log('Request interceptor running', config);
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if(accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        if(refreshToken){
            config.headers['refreshToken'] = `Bearer ${refreshToken}`;
        }
        

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosConfig.interceptors.response.use(
    (response) => {
        console.log('Response interceptor success:', response);
        return response;
    },
    
    async (error) => {
        console.log('Response interceptor error:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            config: error.config
        });

        if (error.response && error.response.status === 403) {
            toast.error('Your account has been blocked by the admin.');
            store.dispatch(logoutUser());
            window.location.href = '/login';
        } else if (error.response && error.response.status === 401) {
            // Handle access token expiry
            const originalRequest = error.config;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await axios.post('/auth/refresh-token', { refreshToken });
                    localStorage.setItem('accessToken', response.data.accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    toast.error('Session expired. Please log in again.');
                    store.dispatch(logoutUser());
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;