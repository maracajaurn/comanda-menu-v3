import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/api/product");

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getByStock= async () => {
    try {
        const res = await API.get("/api/product/stock/1");

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getByPagenated = async (limit = 10, page = 1) => {
    try {
        const res = await API.get(`/api/product/paginated?limit=${limit}&page=${page}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/api/product/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/api/product", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/api/product/${id}`, data);

        if (res.data) return res.data;

        return new Error("Erro ao atualizar a api/product!");
    } catch (error) {
        return new Error(error.message);
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/api/product/${id}`);

        if (res.data) return res.data;

        return new Error("Erro ao deletar api/product!");
    } catch (error) {
        return new Error(error.message);
    };
};

export const ProductService = {
    create,
    getAll,
    getByStock,
    getByPagenated,
    getById,
    updateById,
    deleteById,
};