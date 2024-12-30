import { API } from "../axiosConfig";

const get = async () => {
    try {
        const res = await API.get("/cashier");

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
        const res = await API.get(`/cashier/${id}`);

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
        const res = await API.get(`/cashier/status/${status}`);

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
        const res = await API.put(`/cashier/${id}`, data);

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
        const res = await API.delete(`/cashier/${id}`);

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
    update,
    deleteById,
};