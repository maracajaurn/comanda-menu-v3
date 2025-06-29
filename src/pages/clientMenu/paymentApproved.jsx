import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar } from "../../components";

import { CheckProduct } from "../../libs/icons";

import { useLoader } from "../../contexts";
import { useVerifyIfClientId } from "../../hooks/UseVerifyIfClientId";
import { useFCM } from "../../hooks/UseFCM";


import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";
import { PaymentService } from "../../service/payment/PaymentService";
import { UsuarioService } from "../../service/usuario/UsuarioService";
import { NotificationService } from "../../service/notification/NotificationService";

export const PaymentApproved = () => {

    const { setLoading } = useLoader();

    const navigate = useNavigate();
    const { id } = useParams();

    const { verifyIfClientId } = useVerifyIfClientId(id);
    useFCM(id, true);

    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const payment_id = searchParams.get("payment_id");
    const [notifi_id, setNotifi_id] = useState([]);

    useEffect(() => {
        setLoading(true);
        verifyIfClientId();
        getUsers();
        setProducts(JSON.parse(localStorage.getItem("selected_product")) || []);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getStatusPayment();
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    const getStatusPayment = useCallback(() => {
        PaymentService.getPaymentStatus(payment_id)
            .then((result) => {
                if (result.status === "approved") {
                    if (products.length) {
                        createOrder();
                    };
                    setLoading(false);
                    return;
                } else if (result.status === "refunded" || result.status === "cancelled") {
                    toast.error("O pagamento foi recusado ou cancelado.");
                    navigate(`/${id}/payment_failure`);
                    return;
                } else if (result.status === "pending") {
                    toast.loading("Aguardando a confirmação do pagamento.");
                    navigate(`/${id}/to-pay?payment_id=${payment_id}`);
                    return;
                };
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    }, [payment_id, products]);

    const getUsers = useCallback(() => {
        const funcs = ["online"];
        UsuarioService.getByFunc(funcs)
            .then((result) => {
                setNotifi_id(result);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    const createOrder = useCallback(() => {
        const objSocket = {
            client: localStorage.getItem("client"),
            screens: ["online"],
        };

        const data = {
            list_order: products,
            check_id: id,
            new_stock: JSON.parse(localStorage.getItem("list_stock"))
        };

        OrderService.create_order(data)
            .then((result) => {
                if (result.status) {
                    localStorage.removeItem("selected_product");
                    localStorage.removeItem("screens");
                    localStorage.removeItem("list_stock");
                    socket.emit("new_order", objSocket);
                    setProducts([]);
                    setPaymentInCheck();
                    notify();
                    toast.success(result.message)
                    return
                } else {
                    return toast.error(result.message);
                };
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [products]);

    const setPaymentInCheck = useCallback(() => {
        CheckService.closeCheck("pix", id)
            .then((result) => {
                if (!result.status) {
                    setLoading(false);
                    return toast.error(result.message);
                };
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [id]);

    const notify = useCallback(() => {
        let list_payload = [];

        notifi_id.map((item) => {
            const payload = {
                token: item.notify_id,
                notification: {
                    title: "Pedido Online",
                    body: "Aê! Tem pedido entrando, vê lá!",
                    icon: `/favicon.ico`
                },
                webpush: {
                    fcmOptions: {
                        link: `${process.env.REACT_APP_BASE_URL_FRONT}/${item.user_id}/created_online`,
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
            <Navbar title="Comprovante" />
            <div className="w-full flex flex-col px-5 items-center gap-14">

                <div className="px-10 pt-5 pb-14 gap-5 flex flex-col justify-center shadow-xl shadow-slate-400 bg-[#D39825]/10">
                    <div>
                        <div className=" flex justify-center">
                            <p className="h-[50px] w-[50px] rounded-full text-white bg-green-500"><CheckProduct size={15} /></p>
                        </div>
                        <h1 className="text-center text-slate-900 font-bold text-[30px]">
                            Pagamento realizado com sucesso!
                        </h1>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p className="text-center text-[1.3em]">
                            Logo logo seu pedido estará pronto! <span className="text-[1.5em]">😉</span>
                        </p>
                        <p className="text-center">Caso querira tirar alguma dúvida, comunique-se com nossos atendentes.</p>
                    </div>
                </div>

                <div>
                    <button
                        className="
                            bg-[#1C1D26] hover:bg-[#EB8F00] text-white
                            p-2 text-[20px] font-bold rounded-xl border-2 border-transparent  transition-all delay-75"
                        onClick={() => navigate(`/${id}/wait_for_product`)}
                    >Aguardar preparo</button>
                </div>
            </div>
        </>
    );
};