import { API } from "../axiosConfig";

const get_orders_by_status = async (status) => {
    try {
        const res = await API.get(`/api/order/status/${status}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const get_orders_from_cozinha = async () => {
    try {
        const res = await API.get("/api/order/cuisine/1");
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const get_orders_from_barmen = async () => {
    try {
        const res = await API.get("/api/order/barmen/1");
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const get_order_by_id = async (order_id) => {
    try {
        const res = await API.get(`/api/order/${order_id}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const get_created_online = async () => {
    try {
        const res = await API.get("/api/order/list/check/created_online");

        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const get_orders_by_check = async (check_id) => {
    try {
        const res = await API.get(`/api/order/check_id/${check_id}`);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const create_order = async (list_order) => {
    try {
        const res = await API.post("/api/order", list_order);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const update_order = async (order_id, order) => {
    try {
        const res = await API.put(`/api/order/${order_id}`, order);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    }
};

const delete_order = async (order_id, data) => {
    try {

        const check_id = data.check_id;
        const product_id = data.product_id;
        const new_stock = data.new_stock;

        const res = await API.delete(`/api/order/${order_id}?check_id=${check_id}&product_id=${product_id}&new_stock=${new_stock}`);
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
    get_created_online,
    create_order,
    update_order,
    delete_order,
};