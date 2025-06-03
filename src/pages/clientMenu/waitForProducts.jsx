import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar, Check } from "../../components";

import { useLoader } from "../../contexts";
import { useNotification } from "../../hooks/Notifications";
import { useVerifyIfClientId } from "../../hooks/UseVerifyIfClientId";
import { useFCM } from "../../hooks/UseFCM";

import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";

export const WaitForProducts = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const notify = useNotification();
    useFCM(id);

    const { verifyIfClientId } = useVerifyIfClientId(id);

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

    useEffect(() => {
        verifyIfClientId();
        setLoading(true);

        getCheck();
        getOrders();
    }, [id]);

    // order_ready
    useEffect(() => {
        socket.on("order_ready", (data) => {
            if (data.check_id !== parseInt(id)) return;
            notify(data.check_id, data.client);
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
                <Check
                    id={id}
                    check={check}
                    setCheck={setCheck}
                    products={products}
                    checkProduct
                    status={true}
                    serveice_change={false}
                />

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
