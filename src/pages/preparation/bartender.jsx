import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar, CardProductPreparation } from "../../components";

import { useLoader } from "../../contexts";

import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";

import socket from "../../service/socket";
import { OrderService } from "../../service/order/OrderService";

export const Bartender = () => {

    const [oreders, setOrders] = useState([]);

    const navigate = useNavigate();

    const { setLoading } = useLoader();

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "barmen") {
            return navigate("/login");
        };

        getOrders();
    }, []);

    // buscar todos pedidos
    const getOrders = useCallback(() => {
        OrderService.get_orders_from_barmen()
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

    useSocketOrderEvents(getOrders, "bar");

    // sinalizar pedido pronto
    const orderReady = (
        order_id, name_client, name_product, check_id, quantity, obs,
    ) => {

        const order = {
            check_id, status: 0,
            quantity, obs,
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
            <Navbar title="Barmen" isLogout />
            <Toaster />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                <CardProductPreparation oreders={oreders} orderReady={orderReady} />
            </div>
        </>
    );
};