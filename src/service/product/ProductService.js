import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/product");

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getByPagenated = async (limit, page) => {
    try {
        const res = await API.get(`/product/paginated?limit=${limit}&page=${page}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/product/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/product", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/product/${id}`, data);

        if (res.data) return res.data;

        return new Error("Erro ao atualizar a product!");
    } catch (error) {
        return new Error(error.message);
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/product/${id}`);

        if (res.data) return res.data;

        return new Error("Erro ao deletar product!");
    } catch (error) {
        return new Error(error.message);
    };
};

export const ProductService = {
    create,
    getAll,
    getByPagenated,
    getById,
    updateById,
    deleteById,
};