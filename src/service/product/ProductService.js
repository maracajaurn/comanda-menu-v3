import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/api/product");

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

const getByStock= async () => {
    try {
        const res = await API.get("/api/product/stock/1");

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

const getByName = async (name_product) => {
    try {
        const res = await API.get(`api/product/get_product/by_name?name_product=${name_product}`);
        
        return res.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Erro na resposta da API");
        } else if (error.request) {
            throw new Error("Sem resposta do servidor");
        } else {
            throw new Error(error.message);
        };
    };
};

const getByPagenated = async (limit = 10, page = 1) => {
    try {
        const res = await API.get(`/api/product/paginated?limit=${limit}&page=${page}`);

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

const getById = async (id) => {
    try {
        const res = await API.get(`/api/product/${id}`);

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

const create = async (data) => {
    try {
        const res = await API.post("/api/product", data);

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

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/api/product/${id}`, data);

        if (res.data) return res.data;

        return new Error("Erro ao atualizar a api/product!");
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

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/api/product/${id}`);

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

export const ProductService = {
    create,
    getAll,
    getByStock,
    getByPagenated,
    getByName,
    getById,
    updateById,
    deleteById,
};