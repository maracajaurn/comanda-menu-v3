import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { useToggleView } from "../../contexts";
import { Navbar, Footer } from "../../components";
import { Delete, Plus, Minus } from "../../libs/icons";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";
import socket from "../../service/socket";

export const Waiter = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const { setToggleView } = useToggleView();

    const [listProducts, setListProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [client, setClient] = useState("");
    const [checkStatus, setCheckStatus] = useState(true);

    useEffect(() => {
        setToggleView(false);
        getCheckById();
    }, [totalPrice, id]);

    // lista_novo_pedido
    useEffect(() => {
        socket.on("lista_novo_pedido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Novo pedido na comanda</h6>
                        <span className="font-semibold">{data}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getCheckById();
        });

        return () => { socket.off("lista_novo_pedido") };
    }, []);

    // nova_comanda
    useEffect(() => {
        socket.on("nova_comanda", () => {
            toast("Nova comanda", { duration: 2000 });
            getCheckById();
        });

        return () => { socket.off("nova_comanda") };
    }, []);

    // comanda_finalizada
    useEffect(() => {
        socket.on("comanda_finalizada", (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data}</span> finalizada</h6>
            ), { duration: 2000 });
            getCheckById();
        });

        return () => { socket.off("comanda_finalizada") };
    }, []);

    // produto_pronto
    useEffect(() => {
        socket.on("produto_pronto", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.nameProduct}</span> pronto na comanda</h6>
                        <span className="font-semibold">{data.nameClient}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getCheckById();
        });

        return () => { socket.off("produto_pronto") };
    }, []);

    // produto_removido
    useEffect(() => {
        socket.on("produto_removido", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Pedido <span className="font-semibold">{data.product.nameProduct}</span> cancelado na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            getCheckById();
        });

        return () => { socket.off("produto_removido") };
    }, []);

    // alterar_quantidade
    useEffect(() => {
        socket.on("alterar_quantidade", (data) => {
            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6><span className="font-semibold">{data.action} {data.product.nameProduct}</span> na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });

            getCheckById();

            return () => { socket.off("alterar_quantidade") };
        });
    }, []);

    // comanda_cancelada
    useEffect(() => {
        socket.on("comanda_cancelada", (data) => {
            toast((t) => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ), { duration: 2000 });

            if (data.id === id) {
                navigate(`/garcom/comandas`);
            };
            getCheckById();
        });

        return () => { socket.off("comanda_cancelada") };
    }, []);

    const getCheckById = useCallback(async () => {
        try {
            await CheckService.getById(id)
                .then((result) => {

                    setClient(result[0].name_client);

                    setTotalPrice(parseFloat(result[0].total_value || 0).toFixed(2).replace(".", ","));

                    // verificando status da comanda
                    if (!result[0].status) {
                        setCheckStatus(false);
                    };
                });

            await OrderService.get_orders_by_check(id)
                .then((result) => {
                    setListProducts(result);
                });
        } catch (error) {
            toast.error(error.message);
            return navigate(-1);
        };
    }, []);

    // Editar quantidade do produto na lista
    const alterQnt = async (order_id, quantity, obs, action) => {

        if (quantity > 0) {
            const data = {
                check_id: id,
                status: 1,
                quantity: quantity,
                obs: obs
            };

            if (action === "+") {
                data.quantity = data.quantity + 1;
            } else if (action === "-") {
                data.quantity = data.quantity - 1;
            };

            await OrderService.update_order(order_id, data)
                .then((result) => {
                    toast(result.message);
                    getCheckById();
                })
                .catch((error) => {
                    return toast.error(error.message);
                });
        };
    };

    // remover item da comanda pelo índice
    const deleteItem = async (order_id) => {
        await OrderService.delete_order(order_id, id)
            .then(() => {
                getCheckById();
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <>
            <Navbar title={`${client}`} url />

            <div className="w-[95%] min-h-[85vh] pb-[190px] px-3 rounded-xl flex items-center flex-col gap-10">
                <Toaster />
                {listProducts.map((e, index) => (
                    <div key={index} className="flex justify-between items-center px-3 py-1 w-full bg-slate-100/20 rounded-xl shadow-md">
                        <div className="flex flex-col mr-1">
                            <h3 className="text-slate-900 font-bold flex gap-1"><span>{e.quantity}x - </span> {e.product_name}</h3>

                            <h4 className="text-slate-500 text-[15px] font-semibold">R$ {e.total_price.toFixed(2).replace(".", ",")}</h4>

                            {e.obs && (
                                <h3 className="text-slate-500 text-[15px] font-semibold"><span className="text-[#EB8F00]">OBS</span>: {e.obs}</h3>
                            )}

                            {e.status === 0 && (
                                <h3 className="text-[#EB8F00] text-[15px] font-semibold">Pedido Pronto</h3>
                            )}
                        </div>

                        <div className="flex gap-2 border-l-2 pl-3 text-white">

                            {e.status ? (
                                <div className="flex flex-col-reverse items-center gap-1 border-2 border-slate-500 rounded-md">
                                    <button className="p-1 border-t-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                        onClick={() => alterQnt(e.order_id, e.quantity, e.obs, "-")}
                                    ><Minus /></button>

                                    <p className="text-[#EB8F00] font-somibold">{e.quantity}</p>

                                    <button className="p-1 border-b-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                        onClick={() => alterQnt(e.order_id, e.quantity, e.obs, "+")}
                                    ><Plus /></button>
                                </div>
                            ) : (

                                <div className="flex flex-col-reverse items-center border-2 border-slate-500/30 rounded-md">
                                    <button className="p-1 border-t-2 border-slate-500/30 text-slate-900/30"
                                    ><Minus /></button>

                                    <p className="text-[#EB8F00] font-somibold">{e.quantity}</p>

                                    <button className="p-1 border-b-2 border-slate-500/30 text-slate-900/30"
                                    ><Plus /></button>
                                </div>
                            )}

                            <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-red-600 hover:border-red-600 transition-all delay-75"
                                onClick={() => deleteItem(e.order_id)}
                            ><Delete /></button>
                        </div>
                    </div>
                ))}

                <button className="mt-[30px] flex gap-1 p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-all delay-75"
                    onClick={() => navigate(`/garcom/comanda/${id}/add-product`)}
                ><Plus /> Adicionar item</button>
            </div>

            <Footer id={id} totalValue={totalPrice} checkStatus={checkStatus} />
        </>
    );
};