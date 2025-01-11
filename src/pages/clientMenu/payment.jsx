import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar } from "../../components/navbar";

export const Payment = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [total_value, setTotalValue] = useState(0);

    useEffect(() => {
        const get_total_value = localStorage.getItem("total_value");

        if (get_total_value) {
            setTotalValue(get_total_value);
        }
    }, []);

    return (
        <>
            <Navbar title="Pagamento" />
            <div className="payment">
                <p>Total: R$ {total_value}</p>
            </div>
        </>
    );
};