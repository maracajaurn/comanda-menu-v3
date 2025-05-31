import { API } from "../axiosConfig";

const createPayment = async (paymentData) => {
    try {
        const res = await API.post("/api/payment/process_payment", paymentData);
        
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

const getPaymentStatus = async (payment_id) => {
    try {
        const res = await API.post(`/api/payment/payment_status`, { id: payment_id });
        
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

export const PaymentService = {
    createPayment,
    getPaymentStatus,
};