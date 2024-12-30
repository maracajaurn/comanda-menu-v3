import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/user");
        return res.data;
    } catch (error) {
        return new Error(error);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/user/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error);
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/user", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/user/${id}`, data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error);
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/user/${id}`);

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
