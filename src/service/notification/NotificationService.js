import { API } from "../axiosConfig";

const notifyUser = async (payload) => {
    try {
        const res = await API.post(`/api/notification/notifyUser`, payload);

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

export const NotificationService = {
    notifyUser,
};