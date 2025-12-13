import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

import { auth } from "./auth";

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Hooks will use errorMapper to get user friendly messages
        return Promise.reject(error);
    }
);
