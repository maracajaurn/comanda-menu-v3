import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_BACK,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    };
    config.headers.is_client = localStorage.getItem("client");
    return config;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/401";
            localStorage.removeItem("token");
            localStorage.removeItem("total_value");
            localStorage.removeItem("list_stock");
            localStorage.removeItem("selected_product");
            localStorage.removeItem("client");
            localStorage.removeItem("client_id");
            localStorage.removeItem("check_id");
            localStorage.removeItem("func");
        };
        return Promise.reject(error);
    });

export { API };
