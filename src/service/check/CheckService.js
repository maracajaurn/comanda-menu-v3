import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/api/check");

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/api/check/${id}`);

        if (res.data) return res.data[0];

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getByStatus = async (status) => {
    try {
        const res = await API.get(`/api/check/status/${status}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const create = async (data) => {
    try {
        const res = await API.post("/api/check", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const createClosed = async (data) => {
    try {
        const res = await API.post("/api/check/closed", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/api/check/${id}`, data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const closeCheck = async (pay_form, check_id) => {
    try {
        const res = await API.put(`/api/check/close/${check_id}`, { pay_form });

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const deleteById = async (id) => {
    try {
        const res = await API.delete(`/api/check/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const deleteAll = async () => {
    try {
        const res = await API.delete(`/api/check`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const CheckService = {
    create,
    createClosed,

    getAll,
    getById,
    getByStatus,

    updateById,
    closeCheck,

    deleteAll,
    deleteById,
};