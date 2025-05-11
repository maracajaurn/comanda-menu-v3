import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Plus } from "../../libs/icons";

import { Navbar } from "../../components";

import { useLoader } from "../../contexts";

import { Global, Users } from "../../libs/icons";

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
                
                {rows.length > 0 ? rows.map((e) => (
                    <div className={` ${e.status ? "hidden" : "flex"}  justify-between items-center my-3 px-5 py-3 w-full rounded-xl bg-slate-100/50 shadow-md`}
                        key={e.check_id}>

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold flex flex-col gap-3">
                                {e.created_for === 1 ? (
                                    <span className="text-green-500 flex gap-1"><Global /> Online</span>
                                ) : (
                                    <span className="text-blue-600 flex gap-1"><Users /> Garçom</span>
                                )}
                                <span>{e.name_client}</span>
                            </h3>
                            <h3 className="text-slate-400 font-semibold">{e.obs}</h3>
                            <h4 className="text-slate-500 text-[15px] font-semibold">
                                <span className="font-bold text-[#EB8F00]">Total:</span> R$ {parseFloat(e.total_value || 0).toFixed(2).replace(".", ",")}</h4>
                            <p className="text-slate-500 text-[15px] font-semibold flex gap-1">
                                <span>Pagamento:</span>
                                <span className="font-bold text-[#EB8F00]">
                                    {e.pay_form === "credit" ? "Crédito" :
                                        e.pay_form === "debit" ? "Débito" :
                                            e.pay_form === "pix" ? "Pix" :
                                                e.pay_form === "cash" ? "Dinheiro" :
                                                    "Ainda não foi pago"}
                                </span>
                            </p>
                        </div>

                        <button className=" p-2 rounded-md bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => navigate(`/garcom/comanda/${e.check_id}`)}
                        ><Plus /></button>
                    </div>
                )) : (
                    <div className="flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                        <div className="flex flex-col">
                            <h3 className="text-slate-900 font-bold">Você não possui comandas finalizadas</h3>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};