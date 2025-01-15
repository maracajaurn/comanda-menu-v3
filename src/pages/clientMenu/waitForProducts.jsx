import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components/navbar";
import { CheckProduct } from "../../libs/icons";

import { useLoader } from "../../contexts";

import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";

export const WaitForProducts = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { setLoading } = useLoader();

    const [products, setProducts] = useState([]);
    const [total_value, setTotalValue] = useState(0);
    const [client, setClient] = useState("");

    useEffect(() => {
        setLoading(true);

        getCheck();
        getOrders();
    }, [id]);

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
                    setClient(result[0].name_client);
                    setTotalValue(result[0].total_value);
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
            <Navbar title="Esperando ficar pronto ..." />
            <div className="flex flex-col items-center gap-10">
                <Toaster />
                <div className=" flex flex-col justify-center items-center gap-5 px-10 py-14 shadow-xl bg-[#D39825]/10">

                    <h1 className="text-center text-slate-900 font-bold text-[32px]">{client}</h1>

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
                            </tbody>
                        ))}
                    </table>

                    <h2 className="mt-5 text-center text-slate-900 font-bold text-[28px]">
                        Total: <span className="text-slate-500">R$ {parseFloat(total_value).toFixed(2).replace(".", ",")}</span>
                    </h2>

                    <h5 className="flex gap-2">
                        <span className="bg-green-500 p-[1px] rounded-full text-white"><CheckProduct /></span>
                        <span className="text-slate-900 font-bold text-[18px]">Pago</span>
                    </h5>
                </div>

                <div>
                    <button
                        className="
                            bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] hover:border-[#1C1D26] text-white
                            p-2 text-[20px] font-bold rounded-xl border-2 border-transparent  transition-all delay-75"
                        onClick={() => navigate(`/${id}/products`)}
                    >Adicionar outros produtos</button>
                </div>
            </div>
        </>
    );
};
