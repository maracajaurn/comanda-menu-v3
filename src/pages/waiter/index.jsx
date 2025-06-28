import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar, Footer } from "../../components";

import { useToggleView, useLoader } from "../../contexts";

import { useDebounce } from "../../hooks/UseDebounce";
import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";

import { Delete, Plus, Minus } from "../../libs/icons";

import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";

export const Waiter = () => {

    const { debounce } = useDebounce(700);

    const navigate = useNavigate();

    const { id } = useParams();
    const { user_id } = useParams();

    const { setToggleView } = useToggleView();
    const { setLoading } = useLoader();

    const [listProducts, setListProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [client, setClient] = useState("");
    const [checkStatus, setCheckStatus] = useState(true);

    const [updateOrder, setUpdateOrder] = useState({
        order_id: "",
        data: {
            check_id: 0,
            status: 0,
            quantity: 0,
            obs: "",
            new_stock: [undefined, undefined]
        },
        screens: "",
        product_name: "",
        action: "",
    });

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "garcom") {
            navigate("/login");
        };

        setToggleView(false);
        getOrdersByCheck();
        getCheckById();
    }, [totalPrice, id]);

    // Atualizar quantidade de produtos
    useEffect(() => {
        if (updateOrder.order_id) {
            debounce(() => {
                setLoading(true);
                OrderService.update_order(updateOrder.order_id, updateOrder.data)
                    .then((result) => {
                        if (result.status) {
                            toast.success(result.message);

                            const data = {
                                screens: updateOrder.screens,
                                action: updateOrder.action,
                                product_name: updateOrder.product_name,
                                client
                            };

                            setLoading(false);
                            socket.emit("quantity_change", data);
                            return getCheckById();
                        };

                        setLoading(false);

                        return toast.error(result.message);
                    })
                    .catch((error) => {
                        setLoading(false);
                        return toast.error(error.message);
                    });

                setUpdateOrder({
                    order_id: "",
                    data: {
                        check_id: 0,
                        status: 0,
                        quantity: 0,
                        obs: "",
                        new_stock: [undefined, undefined]
                    },
                    category: "",
                    product_name: "",
                    action: "",
                });
            });
        };
    }, [updateOrder]);

    const getCheckById = useCallback(() => {
        CheckService.getById(id)
            .then((result) => {
                if (result.length > 0) {
                    setClient(result[0].name_client);

                    setTotalPrice(parseFloat(result[0].total_value || 0).toFixed(2).replace(".", ","));

                    // verificando status da comanda
                    if (!result[0].status) {
                        setCheckStatus(false);
                    };

                    return setLoading(false);
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message)
            });
    }, []);

    const getOrdersByCheck = useCallback(() => {
        OrderService.get_orders_by_check(id)
            .then((result) => {
                if (result.length > 0) {
                    return setListProducts(result);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message)
            });
    }, []);

    useSocketOrderEvents(getCheckById, "waiter");

    // Editar quantidade do produto na lista
    const alterQnt = (
        order_id, quantity, obs, screen,
        product_name, stock, product_id, action
    ) => {
        const data = {
            check_id: id,
            status: 1,
            quantity: quantity,
            obs: obs,
        };

        if (action === "+") {
            const new_stock = updateOrder.data.new_stock[0] ?? stock;

            if (new_stock > 0) {
                if (updateOrder.data.quantity) {
                    data.quantity = updateOrder.data.quantity + 1;
                    data.new_stock = [updateOrder.data.new_stock[0] - 1, product_id];
                } else {
                    data.quantity = data.quantity + 1;
                    data.new_stock = [stock - 1, product_id];
                };
            } else {
                setLoading(false);
                return toast.error("Estoque insuficiente!");
            };
        } else if (action === "-") {
            const new_stock = updateOrder.data.new_stock[0] > 0 ? updateOrder.data.new_stock[0] : stock;
            const new_quantity = updateOrder.data.quantity > 0 ? updateOrder.data.quantity : quantity;

            if (new_stock >= 0 && new_quantity > 1) {
                if (updateOrder.data.quantity) {
                    data.quantity = updateOrder.data.quantity - 1;
                    data.new_stock = [updateOrder.data.new_stock[0] + 1, product_id];
                } else {
                    data.quantity = data.quantity - 1;
                    data.new_stock = [stock + 1, product_id];
                };
            } else {
                return setLoading(false);
            };
        };

        setUpdateOrder({ order_id, data, action, screens: screen, product_name });
    };

    // remover item da comanda pelo índice
    const deleteItem = (
        order_id, product_name, screen,
        quantity, product_id, stock
    ) => {
        setLoading(true);

        const data = {
            check_id: id,
            new_stock: (stock + quantity),
            product_id: product_id,
        };

        OrderService.delete_order(order_id, data)
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    setListProducts((prev) => prev.filter((item) => item.order_id !== order_id));
                    socket.emit("product_removed", { product_name, client, screens: screen });
                    getCheckById();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    };

    return (
        <>
            <Navbar title={`${client}`} url />

            <div className="w-full max-w-7xl mx-auto px-4 min-h-[85vh] pb-[190px] flex flex-col items-center gap-10">
                <div className="w-full flex flex-wrap justify-center gap-6">
                    {listProducts.map((e, index) => (
                        <div key={index} className="w-full sm:w-[300px] md:w-[400px] xl:w-[550px] flex justify-between items-center px-4 py-3 bg-slate-100/50 rounded-xl shadow-md">
                            <div className="flex flex-col gap-1 max-w-[70%]">
                                <h3 className="text-slate-900 font-bold flex gap-1">
                                    <span>{e.quantity}x</span> {e.product_name}
                                </h3>
                                <h4 className="text-slate-500 text-sm font-semibold">
                                    R$ {e.total_price.toFixed(2).replace(".", ",")}
                                </h4>
                                {e.obs && (
                                    <h3 className="text-slate-500 text-sm font-semibold">
                                        <span className="text-[#EB8F00] font-bold">OBS:</span> {e.obs}
                                    </h3>
                                )}
                                {e.status === 0 && (
                                    <h3 className="text-[#EB8F00] text-sm font-semibold">Pedido Pronto</h3>
                                )}
                            </div>

                            <div className="flex gap-2 border-l-2 pl-3 text-white">

                                {e.status ? (
                                    <div className="flex flex-col-reverse items-center border border-slate-500 rounded-md">
                                        <button className="px-2 py-1 border-t border-slate-500 text-slate-900 hover:text-[#EB8F00] transition"
                                            onClick={() => alterQnt(e.order_id, e.quantity, e.obs, e.screen, e.product_name, e.stock, e.product_id, "-")}
                                        ><Minus /></button>

                                        <p className="text-[#EB8F00]">
                                            {(updateOrder.order_id === e.order_id ? updateOrder.data.quantity ?? e.quantity : e.quantity)}
                                        </p>

                                        <button className="px-2 py-1 border-b border-slate-500 text-slate-900 hover:text-green-500 transition"
                                            onClick={() => alterQnt(e.order_id, e.quantity, e.obs, e.screen, e.product_name, e.stock, e.product_id, "+")}
                                        ><Plus /></button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col-reverse items-center border border-slate-500 rounded-md">
                                        <button className="px-2 py-1 border-t border-slate-500/30 text-slate-900/30"
                                        ><Minus /></button>

                                        <p className="text-[#EB8F00]">{e.quantity}</p>

                                        <button className="px-2 py-1 border-b border-slate-500/30 text-slate-900/30"
                                        ><Plus /></button>
                                    </div>
                                )}

                                <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-red-600 hover:border-red-600 transition-all delay-75"
                                    onClick={() => deleteItem(e.order_id, e.product_name, e.screen, e.quantity, e.product_id, e.stock)}
                                ><Delete /></button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="mt-12 flex items-center gap-2 font-semibold px-6 py-3 rounded-xl bg-[#EB8F00] text-white hover:bg-[#1C1D26] transition-all"
                    onClick={() => navigate(`/${user_id}/garcom/comanda/${id}/add-product`)}>
                    <Plus /> Adicionar item
                </button>
            </div>

            <Footer id={id} totalValue={totalPrice} checkStatus={checkStatus} user_id={user_id} />
        </>
    );
};