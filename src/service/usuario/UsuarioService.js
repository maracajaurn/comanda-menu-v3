import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/api/user");
        return res.data;
    } catch (error) {
        return new Error(error);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/api/user/${id}`);

        return res.data;
    } catch (error) {
        return new Error(error);
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/api/user", data);

        return res.data;
    return res.data;} catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Erro na resposta da API");
        } else if (error.request) {
            throw new Error("Sem resposta do servidor");
        } else {
            throw new Error(error.message);
        }
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/api/user/${id}`, data);

        return res.data;
    } catch (error) {
        return new Error(error);
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/api/user/${id}`);

        return res.data;
    } catch (error) {
        return new Error(error);
    };
};

export const UsuarioService = {
    create,
    getAll,
    getById,
    updateById,
    deleteById,
};
