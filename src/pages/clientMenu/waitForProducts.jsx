import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { CheckProduct } from "../../libs/icons";

import { useLoader } from "../../contexts";
import { useDebounce } from "../../hooks/UseDebounce";
import { useNotification } from "../../hooks/Notifications";

import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";

export const WaitForProducts = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { debounce } = useDebounce(1500);
    const notify = useNotification();

    const { setLoading } = useLoader();

    const [products, setProducts] = useState([]);

    const [check, setCheck] = useState({
        check_id: 0,
        name_client: "",
        obs: "",
        total_value: 0,
        status: false,
        pay_form: "",
        cashier_id: 0
    });

    const [newNameClient, setNewNameClient] = useState(null);

    useEffect(() => {
        setLoading(true);

        getCheck();
        getOrders();
    }, [id]);

    // order_ready
    useEffect(() => {
        socket.on("order_ready", (data) => {
            notify(data.check_id);
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
            getOrders();
        });

        toast.dismiss();

        return () => { socket.off("order_ready") };
    }, []);

    // Alterar o nome do cliente
    useEffect(() => {
        if (newNameClient) {
            debounce(() => {
                const data = {
                    name_client: newNameClient,
                    obs: check.obs,
                    total_value: check.total_value,
                    status: check.status,
                    pay_form: check.pay_form,
                    cashier_id: check.cashier_id
                };

                CheckService.updateById(id, data)
                    .then((result) => {
                        if (result.status) {
                            return toast.success(result.message);
                        };
                    })
                    .catch((error) => {
                        return toast.error(error.message);
                    });
            });
        };
    }, [newNameClient]);

    const getOrders = useCallback(() => {
        OrderService.get_orders_by_check(id)
            .then((result) => {
                if (result.length > 0) {
                    setProducts(result);
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

    const getCheck = useCallback(() => {
        CheckService.getById(id)
            .then(result => {
                if (result.length > 0) {
                    setCheck((prev) => ({
                        ...prev,
                        check_id: result[0].check_id,
                        name_client: result[0].name_client,
                        obs: result[0].obs,
                        status: result[0].status,
                        total_value: result[0].total_value || 0,
                        pay_form: result[0].pay_form ? result[0].pay_form : "pix",
                        cashier_id: result[0].cashier_id,
                    }));
                    return;
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch(error => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, []);

    return (
        <>
            <Navbar title="Em preparação" url />
            <div className="flex flex-col items-center gap-10 pb-[200px]">
                <Toaster />
                <div className=" flex flex-col justify-center items-center gap-5 px-10 py-14 shadow-xl bg-[#D39825]/10">

                    <label>
                        <input
                            type="text"
                            className="max-w-[300px] h-auto text-center text-slate-900 font-bold text-[32px] bg-transparent"
                            placeholder="Nome do Cliente"
                            onChange={(change) => setNewNameClient(() => change.target.value)}
                            value={newNameClient !== null ? newNameClient : check.name_client}
                        />
                    </label>

                    <table className="max-w-2/3 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                        <thead>
                            <tr className="flex justify-between items-center">
                                <th>Und.</th>
                                <th>Produto</th>
                                <th>Preço</th>
                            </tr>
                        </thead>

                        {products.map((product, index) => (
                            <tbody key={index}>
                                <tr className="flex justify-between gap-1 text-slate-700 font-semibold">
                                    <td className="flex items-center justify-between gap-2">
                                        <span className="text-[#EB8F00]">{product.quantity}x</span>
                                    </td>
                                    <td><span>{product.product_name}</span></td>
                                    <td><span className="font-bold text-slate-500">R$ {product?.total_price.toFixed(2).replace(".", ",")}</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        {product.obs && (
                                            <p className="text-[#EB8F00]">OBS: <span className="text-slate-500">{product.obs}</span></p>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {product.status === 0 && (
                                            <p className=" text-green-600  text-[15px]">Pedido pronto</p>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>

                    <h2 className="mt-5 text-center text-slate-900 font-bold text-[28px]">
                        Total: <span className="text-slate-500">R$ {parseFloat(check.total_value).toFixed(2).replace(".", ",")}</span>
                    </h2>

                    <h5 className="flex gap-2">
                        <span className="bg-green-500 p-[1px] rounded-full text-white"><CheckProduct /></span>
                        <span className="text-slate-900 font-bold text-[18px]">Pago</span>
                    </h5>
                </div>

                <div>
                    <button
                        className="
                            bg-[#1C1D26] hover:bg-[#EB8F00] text-white
                            p-2 text-[20px] font-bold rounded-xl border-2 border-transparent  transition-all delay-75"
                        onClick={() => navigate(`/${id}/products`)}
                    >Adicionar outros produtos</button>
                </div>
            </div>
        </>
    );
};
