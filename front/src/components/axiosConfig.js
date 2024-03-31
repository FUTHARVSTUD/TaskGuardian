import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api' // Base URL of your backend API
});

let isRefreshing = false; // Flag to prevent multiple refresh attempts
let refreshSubscribers = []; // Array to store subscribers waiting for new token

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response, // Pass along successful responses
    (error) => {
        const { config, response: { status } } = error;
        const originalRequest = config;

        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshSubscribers.push((token) => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            } else {
                isRefreshing = true;
                originalRequest._retry = true;

                return new Promise((resolve, reject) => {
                    axiosInstance.post('/auth/refresh') // Adjust your refresh endpoint
                        .then(({ data }) => {
                            localStorage.setItem('token', data.token);
                            axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                            originalRequest.headers['Authorization'] = 'Bearer ' + data.token;

                            refreshSubscribers.forEach(cb => cb(data.token));
                            refreshSubscribers = [];

                            resolve(axiosInstance(originalRequest));
                        })
                        .catch((err) => {
                            reject(err);
                            isRefreshing = false;
                        });
                });
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
