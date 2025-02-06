import { API } from "../axiosConfig";

const get = async () => {
    try {
        const res = await API.get("/api/cashier");

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getById = async (id) => {
    try {
        const res = await API.get(`/api/cashier/${id}`);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const getByStatus = async (status) => {
    try {
        const res = await API.get(`/api/cashier/status/${status}`);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const close = async (cashier_id) => {
    try {
        const res = await API.put(`/api/cashier/close/${cashier_id}`);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const update = async (id, data) => {
    try {
        const res = await API.put(`/api/cashier/${id}`, data);

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
        const res = await API.delete(`/api/cashier/${id}`);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const CashierService = {
    get,
    getById,
    getByStatus,
    close,
    update,
    deleteById,
};