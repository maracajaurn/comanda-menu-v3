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

const Create_token_for_client = async (client) => {
    try {
        const res = await API.post("/api/auth/create_token_for_client", { client });

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const LoginService = {
    login,
    Create_token_for_client,
};