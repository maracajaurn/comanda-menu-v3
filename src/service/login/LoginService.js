import { API } from "../axiosConfig";

const login = async (data) => {
    try {
        const res = await API.post("/api/auth/login", data);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const LoginService = {
    login
};