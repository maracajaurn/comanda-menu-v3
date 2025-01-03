import { useState, useEffect } from "react";
import { API } from "../axiosConfig";

export const useAuth = () => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                
                const response = await API.get("/api/check", {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setAuth(true);
                } else {
                    setAuth(false);
                }
            } catch (error) {
                setAuth(false);
            };
        };

        fetchAuth();
    }, []);

    return auth;
};
