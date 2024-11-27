import axios from "axios";
import { log } from "console";
console.log(process.env.BASE_URL)

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
        if(error.response) {
            const {data} = error.response;

        }else {
            console.log(error);
            
        }
        return Promise.reject(error)
    }
)

export default axiosConfig;