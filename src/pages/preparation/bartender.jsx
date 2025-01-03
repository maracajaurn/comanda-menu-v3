import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { OrderService } from "../../service/order/OrderService";
import socket from "../../service/socket";

export const Bartender = () => {

    const [oreders, setOrders] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "barmen") {
            return navigate("/login");
        };

        getOrders();
    }, []);

    // new_order - ok
    useEffect(() => {
        socket.on("new_order", (data) => {
            const verificationIfProcuctFromCategory = data.categories.some((item) =>
                item === "Drink"
            );
            if (verificationIfProcuctFromCategory) {
                toast((t) => (
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <h6>Novo pedido na comanda</h6>
                            <span className="font-semibold">{data.client}</span>
                        </div>
                        <button className="bg-[#EB8F00] text-white rounded-md p-2"
                            onClick={() => toast.dismiss(t.id)}
                        >OK</button>
                    </div>
                ), { duration: 1000000 });
                getOrders();
            };
        });

        toast.dismiss();

        return () => { socket.off("new_order") };
    }, []);

    // product_removed - ok
    useEffect(() => {
        socket.on("product_removed", (data) => {
            const verificationIfProcuctFromCategory = data.category === "Drink";
            if (verificationIfProcuctFromCategory) {
                toast((t) => (
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <h6><span className="font-semibold underline">{data.product_name}</span> cancelado na comanda</h6>
                            <span className="font-semibold">{data.client}</span>
                        </div>
                        <button className="bg-[#EB8F00] text-white rounded-md p-2"
                            onClick={() => toast.dismiss(t.id)}
                        >OK</button>
                    </div>
                ), { duration: 1000000 });
                getOrders();
            };
        });

        toast.dismiss();

        return () => { socket.off("product_removed") };
    }, []);

    // alterar_quantidade - ok
    useEffect(() => {
        socket.on("quantity_change", (data) => {
            if (data.category === "Drink") {
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
                ), { duration: 10000 });
                getOrders();
            };
        });

        toast.dismiss();

        return () => { socket.off("quantity_change") };
    }, []);

    // check_canceled
    useEffect(() => {
        socket.on("check_canceled", (data) => {
            toast((t) => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ), { duration: 2000 });
            getOrders();
        });

        toast.dismiss();

        return () => { socket.off("check_canceled") };
    }, []);

    // check_finished
    useEffect(() => {
        socket.on("check_finished", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data.client}</span> finalizada</h6>
            ), { duration: 2000 });
            getOrders();
        });

        toast.dismiss();

        return () => { socket.off("check_finished") };
    }, []);

    // buscar todos pedidos
    const getOrders = useCallback(async () => {
        try {
            await OrderService.get_orders_from_barmen()
                .then((result) => {
                    setOrders(result);
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    }, []);

    // sinalizar pedido pronto
    const orderReady = (
        order_id,
        name_client,
        name_product,

        check_id,
        quantity,
        obs,
    ) => {

        const order = {
            check_id,
            status: 0,
            quantity,
            obs,
        };

        try {
            OrderService.update_order(order_id, order)
                .then((result) => {
                    if (result.status) {

                        toast.success(result.message);
                        socket.emit("order_ready", { client: name_client, product: name_product });
                        getOrders();
                        return
                    } else {
                        return toast.error(result.message);
                    };
                })
                .catch((error) => { return toast.error(error) });
        } catch (error) {
            return toast.error(error);
        };
    };

    return (
        <>
            <Navbar title="Barmen" isLogout />
            <Toaster />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                {oreders.length ? oreders.map((e) => (
                    <div key={e.order_id} className={`flex flex-col justify-center items-center px-3 py-5 w-full bg-slate-100/50 rounded-xl shadow-md`}>

                        <h3 className="font-bold">{e.name_client}</h3>

                        <div className="flex justify-between items-center w-full">

                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-col mr-1">
                                    <h3 className="text-slate-900 font-semibold flex gap-1">{e.quantity}x - {e.product_name}</h3>

                                    {e.obs && (
                                        <h3 className="text-slate-500 text-[15px] font-semibold">
                                            <span className="font-bold text-[#EB8F00]">OBS: </span>{e.obs}
                                        </h3>
                                    )}
                                </div>

                                <div className=" flex gap-3 border-l-2 pl-3 text-white">
                                    <button className="flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                        disabled={!e.status}
                                        onClick={() => orderReady(e.order_id, e.name_client, e.product_name, e.check_id, e.quantity, e.obs)}
                                    >{e.status ? "Pronto" : "Finalizado"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">Você não possui pedidos em aberto</h3>
                            <h3 className="text-slate-400 font-semibold">Aguarde o garçom lançar algo ...</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Porque eu estou!</span> 🙂</h4>
                        </div>
                    </div>

                )}
            </div>
        </>
    );
};