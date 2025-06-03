import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useLoader } from "../../contexts";

import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";
import { useAlarm } from "../../hooks/UseAlert";

import { Navbar, CardProductPreparation } from "../../components";

import socket from "../../service/socket";
import { OrderService } from "../../service/order/OrderService";
import { NotificationService } from "../../service/notification/NotificationService";

export const OnlineOrders = () => {

    const [oreders, setOrders] = useState([]);

    const navigate = useNavigate();

    const { setLoading } = useLoader();
    const { playAlarm } = useAlarm();

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "online") {
            return navigate("/login");
        };

        getOrders();
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

    useSocketOrderEvents(() => {
        playAlarm();
        getOrders();
    }, "online");

    // sinalizar pedido pronto
    const orderReady = (order_id, name_client, name_product, check_id, quantity, obs, token) => {

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
                    socket.emit("order_ready", { client: name_client, product: name_product, check_id: check_id });
                    getOrders();

                    if (token) {
                        notifi_client(token, check_id, name_product);
                    };
                    
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

    const notifi_client = (token, check_id, product_name) => {
        const payload = {
            token,
            title: "Pedido pronto",
            body: `Aê! Tem pedido pronto aí, ehm..\n\n${product_name} pronto, corre! 😉`,
            link: `${process.env.REACT_APP_BASE_URL_FRONT}/${check_id}/wait_for_product`,
        };

        NotificationService.notifyUser(payload)
            .then((result) => {
                toast.success(result.message);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <>
            <Navbar title="Pedidos Online" isLogout />

            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                <CardProductPreparation oreders={oreders} orderReady={orderReady} />
            </div>
        </>
    );
};