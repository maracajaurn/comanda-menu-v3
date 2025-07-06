import { API } from "../axiosConfig";

const login = async (data) => {
    try {
        const res = await API.post("/api/auth/login", data);

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

const first_access = async (data) => {
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

export const LoginService = {
    login,
    first_access,
    Create_token_for_client,
};