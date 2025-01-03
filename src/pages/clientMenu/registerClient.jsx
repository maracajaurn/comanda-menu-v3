import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { NewCheck } from "../../components/newCheck";
import { useToggleView } from "../../contexts/ToggleViewNote";

export const RegisterClient = () => {
    
    const navigate = useNavigate();

    const { setToggleView } = useToggleView();

    useEffect(() => {
        const check_id = localStorage.getItem("check_id");
        if (check_id) {
            navigate(`/garcom/comanda/${check_id}`);
        };

        setToggleView(true);
    }, []);

    return (
        <NewCheck is_client={true} />
    );
};