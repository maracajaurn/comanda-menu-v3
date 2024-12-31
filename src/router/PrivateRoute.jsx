import { Navigate } from "react-router-dom";

import { Load } from "../libs/icons";
import { useAuth } from "../service/auth/Auth";

export const PrivateRoute = ({ children }) => {

    const auth = useAuth();

    if (auth === null) {
        return (
            <div role="status">
                <Load />
                <span className="sr-only">Aguarde...</span>
            </div>
        );
    };

    return auth ? children : <Navigate to="/login" />;
};