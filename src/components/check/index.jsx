import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CheckService } from "../../service/check/CheckService";
import { CheckProduct } from "../../libs/icons";
import { useDebounce } from "../../hooks/UseDebounce";

export const Check = ({ id, check, setCheck, products = [], checkProduct = false, status = false, serveice_change = false }) => {

    const { debounce } = useDebounce(1500);

    const [updateCheck, setUpdateCheck] = useState({
        name_client: null,
        obs: null
    });

    // Atualizar nome ou obs da comanda
    useEffect(() => {
        if (updateCheck.name_client === null && updateCheck.obs === null) return;

        debounce(() => {
            const data = {
                name_client: updateCheck.name_client || check.name_client,
                obs: updateCheck.obs || check.obs,
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
    }, [updateCheck, check]);

    return (
        <div className="flex flex-col justify-center items-center gap-1 px-10 py-14 shadow-xl bg-[#D39825]/10">
            <label>
                <textarea
                    type="text"
                    className="max-w-[300px] text-center text-slate-900 font-bold text-[32px] bg-transparent"
                    placeholder="Nome do Cliente"
                    onChange={(change) => {
                        setUpdateCheck((prev) => ({ ...prev, name_client: change.target.value }));
                        setCheck((prev) => ({ ...prev, name_client: change.target.value }));
                    }}
                    value={updateCheck.name_client || check.name_client}
                />
            </label>

            <table className="w-full flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
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
                            <td>
                                <span className="font-bold text-slate-500">
                                    R$ {product?.total_price.toFixed(2).replace(".", ",")}
                                </span>
                            </td>
                        </tr>

                        {product.obs && (
                            <tr>
                                <td>
                                    <p className="text-[#EB8F00]">OBS: <span className="text-slate-500">{product.obs}</span></p>
                                </td>
                            </tr>
                        )}

                        {status && (
                            <tr>
                                <td>
                                    {product.status === 0 && (
                                        <p className=" text-green-600  text-[15px]">Pedido pronto</p>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                ))}
            </table>

            <label>
                <textarea
                    type="text"
                    className="mt-5 w-full text-center text-slate-600 font-semibold text-[18px] bg-transparent"
                    placeholder="OBS"
                    onChange={(change) => {
                        setUpdateCheck((prev) => ({ ...prev, obs: change.target.value }));
                        setCheck((prev) => ({ ...prev, obs: change.target.value }));
                    }}
                    value={updateCheck.obs || check.obs}
                />
            </label>

            {serveice_change ? (
                <>
                    <h2 className="text-center text-slate-900 font-bold text-[22px]">
                        Consumo: <span className="text-slate-500">R$ {parseFloat(check.total_value).toFixed(2).replace(".", ",")}</span>
                    </h2>
                    <h2 className="flex flex-col text-center text-slate-900 font-bold text-[28px]">
                        Total + {serveice_change}% <span className="text-slate-500">R$ {parseFloat(check.total_value + (check.total_value * serveice_change / 100)).toFixed(2).replace(".", ",")}</span>
                    </h2>
                </>
            ) : (
                <h2 className="mt-2 text-center text-slate-900 font-bold text-[28px]">
                    Total: <span className="text-slate-500">R$ {parseFloat(check.total_value).toFixed(2).replace(".", ",")}</span>
                </h2>
            )}

            {checkProduct && (
                <h5 className="flex gap-2">
                    <span className="bg-green-500 p-[1px] rounded-full text-white"><CheckProduct /></span>
                    <span className="text-slate-900 font-bold text-[18px]">Pago</span>
                </h5>
            )}
        </div>
    );
}