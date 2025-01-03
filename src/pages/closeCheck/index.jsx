import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar, Calc } from "../../components";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";
import { SettingService } from "../../service/setting/SettingService";
import socket from "../../service/socket";

export const CloseCheck = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [disabledButton, setDisabledButton] = useState(true);

    const [check, setCheck] = useState({
        check_id: 0,
        name_client: "",
        obs: "",
        total_value: 0,
        status: false,
        pay_form: "",
    });

    const [products, setProducts] = useState([]);

    const [setting, setSetting] = useState({
        serveice_change: 0,
        service_change_percentage: 0,
        image_pix: "",
    });

    const [visibilityCalc, setVisibilityCal] = useState(false);

    useEffect(() => {
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "garcom") {
            return navigate("/login");
        };

        getCheck();
        getOrders();
        getSetting();
    }, []);

    const getCheck = useCallback(async () => {
        await CheckService.getById(id)
            .then((result) => {
                if (result) {
                    setCheck((prev) => ({
                        ...prev,
                        check_id: result[0].check_id,
                        name_client: result[0].name_client,
                        obs: result[0].obs,
                        status: result[0].status,
                        total_value: result[0].total_value || 0,
                        pay_form: result[0].pay_form ? result[0].pay_form : "pix"
                    }));
                    setDisabledButton(false);
                } else {
                    toast.error("Comanda não encontrada!");
                    return navigate(-1);
                };
            }).catch((error) => {
                toast.error(error.message);
                return navigate(-1);
            });
    }, []);

    const getOrders = useCallback(async () => {
        try {
            await OrderService.get_orders_by_check(id)
                .then((result) => {
                    setProducts(result);
                });
        } catch (error) {
            toast.error(error);
            return navigate(-1);
        };
    }, []);

    const getSetting = useCallback(async () => {
        await SettingService.get()
            .then((result) => {
                setSetting(result[0]);
            });
    }, []);

    const closeCheck = useCallback(async () => {
        CheckService.closeCheck(check.pay_form, id)
            .then((result) => {
                if (result.status) {
                    toast.success(result.message);
                    socket.emit("check_finished", { client: check.name_client, id });
                    return navigate(-2);
                } else {
                    toast.error(result.message);
                };
            }).catch((error) => {
                toast.error(error.message);
            });
    }, [check]);

    const cancelCheck = useCallback(async () => {
        socket.emit("check_canceled", { client: check.name_client });
        await CheckService.deleteById(id)
            .then((result) => {
                if (result.status) {
                    toast.success(result.message);
                    return navigate(-2);
                } else {
                    toast.error(result.message);
                };
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, [check]);

    return (
        <>
            <Navbar title={`Finalizar: ${check.name_client}`} url />
            <div className="w-[95%] min-h-[100vh] m-2 p-1 rounded-xl flex items-center justify-center flex-col gap-14">
                <Toaster />
                <div className="px-10 py-14 rounded-md shadow-xl bg-[#D39825]/10">
                    <ul className="max-w-2/3 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                        {products.map((e, index) => (
                            <li key={index}
                                className="w-[100%] flex justify-between gap-5 text-slate-700 font-semibold">
                                <span><span className="text-[#EB8F00]">{e.quantity}x</span> - {e.product_name}</span><span className="font-bold text-slate-500">R$ {e.total_price.toFixed(2).replace(".", ",")}</span>
                            </li>
                        ))}
                    </ul>

                    {setting.serveice_change ? (
                        <>
                            <h2 className="mt-5 text-center text-slate-900 font-bold text-[22px]">
                                Consumo: <span className="text-slate-500">R$ {parseFloat(check.total_value).toFixed(2).replace(".", ",")}</span>
                            </h2>
                            <h2 className="flex flex-col mt-5 text-center text-slate-900 font-bold text-[28px]">
                                Total + {setting.service_change_percentage}%: <span className="text-slate-500">R$ {parseFloat(check.total_value + (check.total_value * setting.service_change_percentage / 100)).toFixed(2).replace(".", ",")}</span>
                            </h2>
                        </>
                    ) : (
                        <h2 className="mt-5 text-center text-slate-900 font-bold text-[28px]">
                            Total: <span className="text-slate-500">R$ {parseFloat(check.total_value).toFixed(2).replace(".", ",")}</span>
                        </h2>
                    )}
                </div>

                <label className="flex flex-col text-slate-900 text-[20px] font-semibold">
                    Pagar com:
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={check.check_id}
                        name="selPag"
                        value={check.pay_form}
                        onChange={(e) => setCheck((prev) => ({ ...prev, pay_form: e.target.value }))}>
                        <option value={`pix`} >Pix</option>
                        <option value={`cash`} >Dinheiro</option>
                        <option value={`credit`} >Crédito</option>
                        <option value={`debit`} >Débito</option>
                    </select>
                </label>

                {(setting.image_pix && check.pay_form === "pix") && (
                    <img
                        className="w-[250px] rounded-xl object-cover"
                        src={setting.image_pix}
                        alt="Imagem do QR Code Pix"
                    />
                )}

                <button className="w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    disabled={disabledButton}
                    onClick={() => closeCheck()}
                >{check.status ? "Finalizar Comanda" : "Atualizar Comanda"}</button>

                <div className="flex items-center">
                    <input
                        checked={visibilityCalc}
                        readOnly
                        id="default-radio-2"
                        type="radio"
                        value=""
                        name="default-radio"
                        onClick={() => setVisibilityCal(oldValue => !oldValue)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500  focus:ring-2 " />
                    <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900">{visibilityCalc ? 'Cal. Aberta' : 'Calc. Fechada'}</label>
                </div>

                <Calc visibilityCalc={visibilityCalc} />

                <button className=" w-[250px] p-3 font-semibold rounded-xl bg-red-600 text-white transition-all delay-75"
                    disabled={disabledButton}
                    onClick={() => cancelCheck()}
                >Cancelar Comanda</button>
            </div>
        </>
    );
};
