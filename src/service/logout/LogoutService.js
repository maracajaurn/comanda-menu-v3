import { API } from "../axiosConfig";

const logout = async (user_id) => {
    try {
        const res = await API.post("/api/auth/logout", { user_id });

        localStorage.removeItem("selected_product");
        localStorage.removeItem("list_stock");
        localStorage.removeItem("token");
        localStorage.removeItem("total_value");
        localStorage.removeItem("client");
        localStorage.removeItem("client_id");
        localStorage.removeItem("check_id");
        localStorage.removeItem("func");
        localStorage.removeItem("user_id");

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

export const LogoutService = {
    logout
};