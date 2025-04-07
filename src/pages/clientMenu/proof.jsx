import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";

import { CheckProduct } from "../../libs/icons";

import { useLoader } from "../../contexts";

import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";
import { PaymentService } from "../../service/payment/PaymentService";

export const Proof = () => {

    const { setLoading } = useLoader();

    const navigate = useNavigate();
    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const payment_id = searchParams.get("payment_id");

    useEffect(() => {
        localStorage.getItem("selected_product");

        setProducts(JSON.parse(localStorage.getItem("selected_product")));
    }, []);

    useEffect(() => {
        getStatusPayment();
    }, [products]);

    const getStatusPayment = useCallback(() => {
        PaymentService.getPaymentStatus(payment_id)
            .then((result) => {
                if (result.status === "approved") {
                    if (products) {
                        createOrder();
                    };

                    return;
                } else if (result.status === "rejected" || result.status === "cancelled") {
                    toast.error("O pagamento foi recusado ou cancelado.");
                    navigate(`/${id}/payment_failure`);
                    return;
                };
            })
            .catch((error) => {
                return toast.error("Ocorreu um erro ao consultar o status do pagamento.");
            });
    }, [payment_id, products]);

    const createOrder = useCallback(() => {
        setLoading(true);

        const objSocket = {
            client: localStorage.getItem("client"),
            categories: JSON.parse(localStorage.getItem("categories")) || [],
        };

        if (objSocket.categories.length === 0 || products.length === 0) {
            setLoading(false);
            return
        };

        const data = {
            list_order: products,
            check_id: id,
            new_stock: JSON.parse(localStorage.getItem("list_stock")),
        };

        OrderService.create_order(data)
            .then((result) => {
                if (result.status) {
                    localStorage.removeItem("selected_product");
                    localStorage.removeItem("categories");
                    localStorage.removeItem("list_stock");
                    socket.emit("new_order", objSocket);
                    setPaymentInCheck();
                    setLoading(false);
                    return toast.success(result.message)
                };

                setLoading(false);
                return toast.error("Ocorreu um erro ao realizar o pedido.");
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

    return (
        <>
            <Navbar title="Comprovante" />
            <div className="w-full flex flex-col px-5 items-center gap-14">
                <Toaster />
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
                        <p className="text-center">*Caso querira tirar alguma dúvida, comunique-se com nossos atendentes.</p>
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