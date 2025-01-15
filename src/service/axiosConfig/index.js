import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL_BACK,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "is_client": "CustomValue",
    },
});

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    };
    config.headers["is_client"] = localStorage.getItem("client");
    return config;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
            sessionStorage.removeItem("token");
            localStorage.removeItem("total_value");
            localStorage.removeItem("categories");
            localStorage.removeItem("selected_product");
            localStorage.removeItem("client");
            localStorage.removeItem("client_id");
            localStorage.removeItem("func");
        };
        return Promise.reject(error);
    });

export { API };
