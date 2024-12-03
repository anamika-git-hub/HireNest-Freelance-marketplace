import axios from "axios";
import dotenv from 'dotenv';
import store from "../store/store";
import { logoutUser } from "../store/userSlice";
console.log('aaaaaaaa', process.env.BASE_URL)

const axiosConfig  = axios.create({
    baseURL: process.env.BASE_URL ||"http://localhost:5000/api/",
    headers: {
        "Content-Type": 'application/json',
    }
})

axiosConfig.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const role = localStorage.getItem('role');
        if(accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

axiosConfig.interceptors.response.use(
    response => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 403) {
            alert('Your account has been blocked by the admin.');
            store.dispatch(logoutUser());
            window.location.href = '/login'; // Redirect to login page
        }else {
            console.log(error);
            
        }
        return Promise.reject(error)
    }
)

export default axiosConfig;