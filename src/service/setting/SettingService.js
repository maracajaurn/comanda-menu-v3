import { API } from "../axiosConfig";

const  get = async () => {
    try {
        const res = await API.get("/api/setting");

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

const update = async (setting_id, data) => {
    try {
        const res = await API.put(`/api/setting/${setting_id}`, data);

        if (res.data) {
            return res.data;
        };

        return new Error(res.message);
    } catch (error) {
        return new Error(error.message);
    };
};

export const SettingService = {
    get,
    update
};