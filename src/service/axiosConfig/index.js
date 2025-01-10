import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_BACK,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    };
    return config;
}, (error) => {
    if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        localStorage.removeItem("func");
        window.location.href = "/login";
    };
    return Promise.reject(error);
});

export { API };
