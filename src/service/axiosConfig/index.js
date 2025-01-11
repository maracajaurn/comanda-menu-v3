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
}, (error) => Promise.reject(error));

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
            sessionStorage.removeItem("token");
            localStorage.removeItem("func");
            localStorage.removeItem("selected_product");
        };
        return Promise.reject(error);
    });

export { API };
