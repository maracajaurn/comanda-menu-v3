import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Navbar, CardProductPreparation } from "../../components";

import socket from "../../service/socket";
import { OrderService } from "../../service/order/OrderService";

export const OnlineOrders = () => {

    const [oreders, setOrders] = useState([]);

    const navigate = useNavigate();

    const { setLoading } = useLoader();

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "online") {
            return navigate("/login");
        };

        getOrders();
    }, []);

    // new_order - ok
    useEffect(() => {
        socket.on("new_order", (data) => {
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
        });

        toast.dismiss();

        return () => { socket.off("new_order") };
    }, []);

    // product_removed - ok
    useEffect(() => {
        socket.on("product_removed", (data) => {
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
        });

        toast.dismiss();

        return () => { socket.off("product_removed") };
    }, []);

    // alterar_quantidade - ok
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
            ), { duration: 10000 });
            getOrders();
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

    // buscar todos pedidos online
    const getOrders = useCallback(() => {
        OrderService.get_created_online()
            .then((result) => {
                if (result.length > 0) {
                    setOrders(result);
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

        setLoading(true);

        OrderService.update_order(order_id, order)
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    toast.success(result.message);
                    socket.emit("order_ready", { client: name_client, product: name_product, check_id: check_id });
                    getOrders();
                    return
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error);
            });
    };

    return (
        <>
            <Navbar title="Pedidos Online" isLogout />
            <Toaster />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                <CardProductPreparation oreders={oreders} orderReady={orderReady}/>
            </div>
        </>
    );
};