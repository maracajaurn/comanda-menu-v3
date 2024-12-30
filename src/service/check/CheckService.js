import { API } from "../axiosConfig";

const getAll = async () => {
    try {
        const res = await API.get("/check");

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/check/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getByStatus = async (status) => {
    try {
        const res = await API.get(`/check/status/${status}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const create = async (data) => {

    try {
        const res = await API.post("/check", data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const updateById = async (id, data) => {
    try {

        const res = await API.put(`/check/${id}`, data);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const closeCheck = async (pay_form, check_id) => {
    try {
        const res = await API.put(`/check/close/${check_id}`, { pay_form });

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
        const res = await API.delete(`/check/${id}`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const deleteAll = async () => {
    try {
        const res = await API.delete(`/check`);

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const CheckService = {
    create,
    getAll,
    getById,
    getByStatus,
    updateById,
    closeCheck,
    deleteAll,
    deleteById,
};