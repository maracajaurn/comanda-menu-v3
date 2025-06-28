import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Right } from "../../libs/icons";

import { Navbar } from "../../components";

import { useLoader } from "../../contexts";

import { CheckService } from "../../service/check/CheckService";

export const ClosedChecks = () => {
    const [rows, setRows] = useState([]);
    const { setLoading } = useLoader();

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "garcom") {
            return navigate("/login");
        };

        getAllChecks();
    }, []);

    const getAllChecks = useCallback(() => {
        CheckService.getByStatus(0)
            .then((result) => {
                if (result.length > 0) {
                    setRows(result);
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
                toast.error(error.message);
                return navigate(-1);
            });
    }, []);

    return (
        <>
            <Navbar title={`Comandas Fechadas`} url />

            <div className="w-[95%] min-h-[90vh] py-3 px-5 rounded-xl flex items-center flex-col gap-5">
                <div className="w-full flex sm:flex-row flex-wrap flex-col items-center justify-center gap-5">

                    {rows.length > 0 ? rows.map((e) => (
                        <div className="w-full sm:w-[280px] md:w-[350px] xl:w-[550px] my-3 px-5 py-4 rounded-xl bg-white shadow-md border border-slate-200 flex justify-between items-center gap-3"
                            key={e.check_id}>

                            <div className="flex flex-col justify-between gap-4">

                                <div className="flex flex-col gap-1">
                                    <span className={`text-sm font-semibold ${e.created_for === 1 ? "text-green-600" : "text-blue-600"}`}>
                                        {e.created_for === 1 ? "Online" : "Garçom"}
                                    </span>
                                    <h3 className="text-xl text-slate-900 font-bold">{e.name_client}</h3>
                                    {e.obs && <p className="text-slate-500 text-sm">{e.obs}</p>}
                                </div>

                                <div className="flex flex-col gap-1 mt-2">

                                    <p className="text-sm text-slate-600">
                                        <span className="font-semibold text-[#EB8F00]">Total:</span> R$ {parseFloat(e.total_value || 0).toFixed(2).replace(".", ",")}
                                    </p>

                                    <p className="text-sm text-slate-600">
                                        <span className="font-semibold text-[#EB8F00]">Pagamento:</span>{" "}
                                        {e.pay_form === "credit" ? "Crédito" :
                                            e.pay_form === "debit" ? "Débito" :
                                                e.pay_form === "pix" ? "Pix" :
                                                    e.pay_form === "cash" ? "Dinheiro" :
                                                        "Ainda não foi pago"}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="p-4 h-fit rounded-full bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75 text-sm font-semibold"
                                onClick={() => navigate(`/admin/garcom/comanda/${e.check_id}`)}>
                                <Right />
                            </button>
                        </div>
                    )) : (
                        <div className="w-full px-5 py-6 text-center rounded-xl shadow-md bg-white border border-slate-200">
                            <h3 className="text-slate-700 font-semibold text-lg">Você não possui comandas finalizadas</h3>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};