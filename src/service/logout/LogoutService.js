import { API } from "../axiosConfig";

const logout = async () => {

    try {
        await API.get("/api/logout");
    } catch (error) {
        return new Error(error.message);
    };
};

export const LogoutService = {
    logout
};