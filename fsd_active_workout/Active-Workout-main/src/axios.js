// src/
// src/axios.js
// api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Interceptor to add token to headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export { api };

