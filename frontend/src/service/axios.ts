import axios from "axios";
import store from "../store/store";
import { logoutUser } from "../store/userSlice";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';
import { CookieAttributes } from 'js-cookie';

const setCookie = (name: string, value: string, options: CookieAttributes = {}) => {
  const defaultOptions: CookieAttributes = {
    expires: 7, 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as 'strict' | 'lax' | 'none'
  };
  
  Cookies.set(name, value, { ...defaultOptions, ...options });
};

const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

const removeCookie = (name: string): void => {
  Cookies.remove(name);
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  setCookie('accessToken', accessToken);
  setCookie('refreshToken', refreshToken);
};

export const clearAuthTokens = (): void => {
  removeCookie('accessToken');
  removeCookie('refreshToken');
};

const axiosConfig = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL!,
  headers: {
    "Content-Type": 'application/json',
  },
  validateStatus: (status) => status < 400,
  withCredentials: true 
});

console.log('Setting up request interceptor');
axiosConfig.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers['refreshToken'] = `Bearer ${refreshToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => {
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
      localStorage.removeItem("role");
      clearAuthTokens();
      window.location.href = '/login';
      
    } else if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      const refreshToken = getCookie('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post('/auth/refresh-token', { refreshToken });
          setCookie('accessToken', response.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          toast.error('Session expired. Please log in again.');
          store.dispatch(logoutUser());
          clearAuthTokens();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;