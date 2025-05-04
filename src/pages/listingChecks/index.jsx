import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { useToggleView, useLoader } from "../../contexts";

import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";

import { Plus } from "../../libs/icons";

import { Navbar, NewCheck, Filter, CardCheck } from "../../components";

import { CheckService } from "../../service/check/CheckService";

export const ListingChecks = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState("");

    const { toggleView, setToggleView } = useToggleView();
    const { setLoading } = useLoader();

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
                <NewCheck />
                <Toaster />

                {rows.length > 10 && (
                    <Filter filter={filter} setFilter={setFilter} placeholder="Buscar comanda..." />
                )}

                {itensFiltrados.length ? itensFiltrados.map((item) => (
                    <CardCheck item={item} navigate={navigate} />
                )) : (
                    <div className="border flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">Você não possui comandas em aberto</h3>
                            <h3 className="text-slate-400 font-semibold">Clique em + Nova comanda</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Total:</span> R$ 0,00</h4>
                        </div>

                        <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => setToggleView(true)}
                        ><Plus /></button>
                    </div>
                )}

                <button className="mt-[100px] flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                    onClick={() => setToggleView(true)}
                ><Plus /> Nova comanda</button>
            </div>
        </>
    );
};