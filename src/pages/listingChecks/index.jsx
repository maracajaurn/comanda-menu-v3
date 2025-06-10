import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useToggleView, useLoader } from "../../contexts";

import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";
import { useFCM } from "../../hooks/UseFCM";

import { Plus } from "../../libs/icons";

import { Navbar, NewCheck, Filter, CardCheck } from "../../components";

import { CheckService } from "../../service/check/CheckService";

export const ListingChecks = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState("");

    const { toggleView, setToggleView } = useToggleView();
    const { setLoading } = useLoader();

    const { user_id } = useParams();
    
    useFCM(user_id, false);

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "garcom") {
            return navigate("/login");
        };

        getCheckByStatus();
    }, [toggleView]);

    const getCheckByStatus = useCallback(() => {
        CheckService.getByStatus(1)
            .then((result) => {
                if (result.length > 0) {
                    setRows(result);
                    return setLoading(false);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, []);

    useSocketOrderEvents(getCheckByStatus, "waiter");

    const itensFiltrados = rows.filter(item =>
        item.name_client.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <>
            <Navbar title={`Todas as comandas`} isLogout />
            <div className="w-[95%] min-h-[90vh] py-3 rounded-xl flex items-center flex-col gap-5">
                <NewCheck user_id={user_id} />

                {rows.length > 10 && (
                    <Filter filter={filter} setFilter={setFilter} placeholder="Buscar comanda..." />
                )}

                <div className="w-full flex sm:flex-row flex-wrap flex-col items-center justify-center gap-5">
                    <CardCheck listCheck={itensFiltrados} navigate={navigate} user_id={user_id} />
                </div>

                <button className="mt-[100px] flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                    onClick={() => setToggleView(true)}
                ><Plus /> Nova comanda</button>
            </div>
        </>
    );
};