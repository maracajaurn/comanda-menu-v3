import { API } from "../axiosConfig";

const  get = async () => {
    try {
        const res = await API.get("/api/setting");

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

const update = async (setting_id, data) => {
    try {
        const res = await API.put(`/api/setting/${setting_id}`, data);

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

export const SettingService = {
    get,
    update
};