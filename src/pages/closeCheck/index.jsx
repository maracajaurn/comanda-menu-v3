import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar, Calc } from "../../components";

import { useLoader } from "../../contexts";
import { useDebounce } from "../../hooks/UseDebounce";

import socket from "../../service/socket";
import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";
import { SettingService } from "../../service/setting/SettingService";

export const CloseCheck = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { setLoading } = useLoader();
    const { debounce } = useDebounce(1500);

    const [disabledButton, setDisabledButton] = useState(true);

    const [check, setCheck] = useState({
        check_id: 0,
        name_client: "",
        obs: "",
        total_value: 0,
        status: false,
        pay_form: "",
        cashier_id: 0
    });

    const [products, setProducts] = useState([]);

    const [setting, setSetting] = useState({
        serveice_change: 0,
        service_change_percentage: 0,
        image_pix: "",
    });

    const [newNameClient, setNewNameClient] = useState(null);

    const [visibilityCalc, setVisibilityCal] = useState(false);

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "garcom") {
            return navigate("/login");
        };

        getCheck();
        getSetting();
        getOrders();
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

    const getCheck = useCallback(() => {
        CheckService.getById(id)
            .then((result) => {
                if (result) {
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
                    setDisabledButton(false);
                };

                if (result?.status === false) {
                    setLoading(false);
                    toast.error(result.message);
                    return navigate(-1);
                };

                setLoading(false);
            }).catch((error) => {
                toast.error(error.message);
                return navigate(-1);
            });
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
                    toast.error(result.message);
                    return navigate(-1);
                };

                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                return navigate(-1);
            });
    }, []);

    const getSetting = useCallback(() => {
        SettingService.get()
            .then((result) => {
                if (result[0]) {
                    const image = result[0].image_pix?.data;

                    if (image) {
                        const blob = new Blob([new Uint8Array(image)], { type: 'image/jpeg' });
                        blobToBase64(blob)
                            .then((base64Image) => {
                                setSetting((prev) => ({
                                    ...prev,
                                    setting_id: result[0].setting_id,
                                    estabishment_name: result[0].estabishment_name,
                                    serveice_change: result[0].serveice_change,
                                    service_change_percentage: result[0].service_change_percentage,
                                    color: result[0].color,
                                    image_pix: base64Image,
                                }));

                                return;
                            })
                            .catch((error) => {
                                return toast.error('Erro ao converter a imagem: ' + error.message);
                            });
                    } else {
                        return setSetting(result[0]);
                    };
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    }, []);

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject('Erro ao ler o Blob: ' + error);
            };

            reader.readAsDataURL(blob);
        });
    };

    const closeCheck = useCallback(() => {
        setLoading(true);
        CheckService.closeCheck(check.pay_form, id)
            .then((result) => {
                if (result.status) {
                    toast.success(result.message);
                    socket.emit("check_finished", { client: check.name_client, id });
                    return navigate(-2);
                };

                setLoading(false);
                return toast.error(result.message);
            }).catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [check]);

    const cancelCheck = useCallback(() => {
        setLoading(true);

        products.map((product) => {
            const data = {
                check_id: id,
                new_stock: (product.stock + product.quantity),
                product_id: product.product_id,
            };

            OrderService.delete_order(product.order_id, data)
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
        });

        CheckService.deleteById(id)
            .then((result) => {
                if (result.status) {
                    socket.emit("check_canceled", { client: check.name_client });
                    toast.success(result.message);
                    return navigate(-2);
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [check]);

    return (
        <>
            <Navbar title={`Fechar`} url />
            <div className="w-[95%] min-h-[100vh] m-2 p-1 rounded-xl flex items-center justify-center flex-col gap-14">
                <Toaster />
                <div className="px-10 py-14 rounded-md shadow-xl bg-[#D39825]/10">

                    <label>
                        <textarea
                            type="text"
                            className="max-w-[300px] text-center text-slate-900 font-bold text-[32px] bg-transparent"
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
                            </tbody>
                        ))}
                    </table>

                    {setting.serveice_change ? (
                        <>
                            <h2 className="mt-5 text-center text-slate-900 font-bold text-[22px]">
                                Consumo: <span className="text-slate-500">R$ {parseFloat(check.total_value).toFixed(2).replace(".", ",")}</span>
                            </h2>
                            <h2 className="flex flex-col mt-5 text-center text-slate-900 font-bold text-[28px]">
                                Total + {setting.service_change_percentage}% <span className="text-slate-500">R$ {parseFloat(check.total_value + (check.total_value * setting.service_change_percentage / 100)).toFixed(2).replace(".", ",")}</span>
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
