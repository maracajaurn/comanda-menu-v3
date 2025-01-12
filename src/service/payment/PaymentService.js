import { API } from "../axiosConfig";

const createPayment = async (paymentData) => {
    try {
        const res = await API.post("/api/payment/process_payment", paymentData);
        if (res.data) return res.data;

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const PaymentService = {
    createPayment,
};