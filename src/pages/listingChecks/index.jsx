import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { useToggleView, useLoader } from "../../contexts";

import { Plus } from "../../libs/icons";

import { Navbar, NewCheck } from "../../components";

import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";

export const ListingChecks = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

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

    // new_order
    useEffect(() => {
        socket.on("new_order", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Novo pedido na comanda</h6>
                        <span className="font-semibold">{data}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => {
                            toast.dismiss(t.id);
                            getCheckByStatus();
                        }}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getCheckByStatus();
        });

        toast.dismiss();

        return () => { socket.off("new_order") };
    }, []);

    // new_check
    useEffect(() => {
        socket.on("new_check", () => {
            toast("Nova comanda", { duration: 2000 });
            getCheckByStatus();
        });

        toast.dismiss();

        return () => { socket.off("new_check") };
    }, []);

    // check_finished
    useEffect(() => {
        socket.on("check_finished", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data}</span> finalizada</h6>
            ), { duration: 2000 });
            getCheckByStatus();
        });

        toast.dismiss();

        return () => { socket.off("check_finished") };
    }, []);

    // order_ready
    useEffect(() => {
        socket.on("order_ready", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.product}</span> pronto na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
        });

        toast.dismiss();

        return () => { socket.off("order_ready") };
    }, []);

    // product_removed
    useEffect(() => {
        socket.on("product_removed", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.product.nameProduct}</span> cancelado na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getCheckByStatus();
        });

        toast.dismiss();

        return () => { socket.off("product_removed") };
    }, []);

    // quantity_change
    useEffect(() => {
        socket.on("quantity_change", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6><span className="font-semibold">{data.action} {data.product_name}</span> na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getCheckByStatus();
        });

        toast.dismiss();

        return () => { socket.off("quantity_change") };
    }, []);

    // check_canceled
    useEffect(() => {
        socket.on("check_canceled", (data) => {
            toast(() => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ), { duration: 2000 });
            getCheckByStatus();
        });

        toast.dismiss();

        return () => { socket.off("check_canceled") };
    }, []);

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

    return (
        <>
            <Navbar title={`Todas as comandas`} isLogout />
            <div className="w-[95%] min-h-[90vh] py-3 px-5 rounded-xl flex items-center flex-col gap-5">
                <NewCheck />
                <Toaster />
                {rows.length ? rows.map((e) => (
                    <div className={` ${e.status ? "flex" : "hidden"} justify-between items-center my-3 px-5 py-3 w-full rounded-xl bg-slate-100/50 shadow-md`}
                        key={e.check_id}>

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">{e.name_client}</h3>
                            <h3 className="text-slate-400 font-semibold">{e.obs}</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Total:</span> R$ {e.total_value ? e.total_value.toFixed(2).replace(".", ",") : "0,00"}</h4>
                            <p>{e.status ? "" : "Encerrada"}</p>
                        </div>

                        <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => navigate(`/garcom/comanda/${e.check_id}`)}
                        ><Plus /></button>
                    </div>
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