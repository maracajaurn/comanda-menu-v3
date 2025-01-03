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

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error);
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/api/user", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/api/user/${id}`, data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error);
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/api/user/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
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
