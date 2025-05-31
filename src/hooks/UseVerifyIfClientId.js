import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { CheckService } from "../service/check/CheckService";

import toast from "react-hot-toast";

export const useVerifyIfClientId = (id) => {
    const navigate = useNavigate();

    const verifyIfClientId = useCallback(() => {
        CheckService.getById(id)
            .then((result) => {
                if (result[0]?.check_id) {
                    return
                } else {
                    localStorage.removeItem("check_id");
                    localStorage.removeItem("client");
                    localStorage.removeItem("list_stock");
                    localStorage.removeItem("selected_product");
                    localStorage.removeItem("token");
                    localStorage.removeItem("total_value");
                    navigate("/register_client");
                    return
                };
            })
            .catch((error) => {
                toast.error(error);
                navigate("/register_client");
            });
    });

    return { verifyIfClientId };
};