import { API } from "../axiosConfig";

const get_orders_by_status = async (status) => {
    try {
        const res = await API.get(`order/status/${status}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const get_orders_from_cozinha = async () => {

    console.log("entrou no get_orders_from_cozinha");
    try {
        const res = await API.get("order/cuisine/1");
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const get_orders_from_barmen = async () => {
    try {
        const res = await API.get("order/barmen/1");
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const get_order_by_id = async (order_id) => {
    try {
        const res = await API.get(`order/${order_id}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const get_orders_by_check = async (check_id) => {
    try {
        const res = await API.get(`order/check_id/${check_id}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const create_order = async (list_order) => {
    try {
        const res = await API.post("order", list_order);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const update_order = async (order_id, order) => {
    try {
        const res = await API.put(`order/${order_id}`, order);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const delete_order = async (order_id, check_id) => {
    try {
        const res = await API.delete(`order/${order_id}?check_id=${check_id}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

export const OrderService = {
    get_orders_by_status,
    get_orders_by_check,
    get_orders_from_cozinha,
    get_orders_from_barmen,
    get_order_by_id,
    create_order,
    update_order,
    delete_order,
};