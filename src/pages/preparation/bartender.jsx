import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar, CardProductPreparation } from "../../components";

import { useLoader } from "../../contexts";
import { useFCM } from "../../hooks/UseFCM";

import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";

import socket from "../../service/socket";
import { OrderService } from "../../service/order/OrderService";
import { UsuarioService } from "../../service/usuario/UsuarioService";
import { NotificationService } from "../../service/notification/NotificationService";

export const Bartender = () => {

    const [oreders, setOrders] = useState([]);
    const [notifi_id, setNotifi_id] = useState([]);

    const navigate = useNavigate();

    const { setLoading } = useLoader();
    const { user_id } = useParams();

    useFCM(user_id, false);

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "barmen") {
            return navigate("/login");
        };

        getOrders();
        getUsers();
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

    const getUsers = useCallback(() => {
        const funcs = ["garcom"];
        UsuarioService.getByFunc(funcs)
            .then((result) => {
                setNotifi_id(result);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    useSocketOrderEvents(getOrders, "bar");

    // sinalizar pedido pronto
    const orderReady = (order_id, name_client, name_product, check_id, quantity, obs) => {

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
                    setOrders({});
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

    const notify = useCallback((check_id, product_name) => {
        let list_payload = [];

        notifi_id.map((item) => {
            const payload = {
                token: item.notify_id,
                notification: {
                    title: "Pedido pronto",
                    body: `Aê! Tem pedido pronto aí, ehm... \n${product_name} pronto!`,
                    icon: `/favicon.ico`
                },
                webpush: {
                    fcmOptions: {
                        link: `${process.env.REACT_APP_BASE_URL_FRONT}/${item.user_id}/garcom/comanda/${check_id}`,
                    },
                },
            };

            list_payload.push(payload);
        });

        NotificationService.notifyUser(list_payload)
            .catch((error) => {
                toast.error(error.message);
            });
    }, [notifi_id]);

    return (
        <>
            <Navbar title="Barmen" isLogout />

            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                <CardProductPreparation
                    oreders={oreders}
                    orderReady={orderReady}
                    notify={notify}
                />
            </div>
        </>
    );
};