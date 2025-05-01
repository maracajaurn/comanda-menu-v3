import { API } from "../axiosConfig";

const login = async (data) => {
    try {
        const res = await API.post("/api/auth/login", data);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Erro na resposta da API");
        } else if (error.request) {
            throw new Error("Sem resposta do servidor");
        } else {
            throw new Error(error.message);
        }
    };
};

const firt_access = async (data) => {
    try {
        const res = await API.post("api/auth/first_access", data);
        return res.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Erro na resposta da API");
        } else if (error.request) {
            throw new Error("Sem resposta do servidor");
        } else {
            throw new Error(error.message);
        }
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
        if (error.response) {
            throw new Error(error.response.data.message || "Erro na resposta da API");
        } else if (error.request) {
            throw new Error("Sem resposta do servidor");
        } else {
            throw new Error(error.message);
        }
    };
};

export const LoginService = {
    login,
    firt_access,
    Create_token_for_client,
};