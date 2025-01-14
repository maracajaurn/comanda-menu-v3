import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Navbar } from "../../components";

import { CheckService } from "../../service/check/CheckService";
import { CashierService } from "../../service/cashier/CashierService"

export const RegisterClient = () => {

    const navigate = useNavigate();
    const { loading, setLoading } = useLoader();
    
    const [value, setValue] = useState({
        name_client: "",
        cashier_id: null,
        obs: ""
    });

    useEffect(() => {
        const check_id = localStorage.getItem("check_id");
        if (check_id) {
            navigate(`/${check_id}/products`);
        };
    }, []);

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    useEffect(() => {
        CashierService.getByStatus(1)
            .then((result) => {
                setValue(prev => ({ ...prev, cashier_id: result[0].cashier_id }));
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                return toast.error(error.message || "Ocorreu um erro ao buscar o caixa.");
            });
    }, []);

    const createCheck = () => {
        if (value.name_client === "") {
            setValue(prev => ({ ...prev, name_client: "Nova comanda" }));
        };

        if (value.name_client !== "") {
            setLoading(true);

            const data = {
                name_client: value.name_client,
                cashier_id: value.cashier_id,
                obs: value.obs,
            };

            setLoading(true);

            CheckService.createClosed(data)
                .then((result) => {
                    if (result.status) {
                        localStorage.setItem("check_id", result.check_id);
                        navigate(`/${result.check_id}/products`);
                        setValue(prev => ({ ...prev, name_client: "", obs: "" }));
                        setLoading(false);
                        
                        return toast.success(result.message);
                    };

                    setLoading(false);
                    return toast.error(result.message);
                }).catch((error) => {
                    setLoading(false);
                    return toast.error(error.message || "Ocorreu um erro ao criar a comanda.");
                });
        };
    };

    return (
        <div className={`flex justify-center items-center`}>
            <Navbar title="Bem-vindo" />
            <Toaster />
            <div className="h-[300px] w-[300px] rounded-md border shadow-md shadow-slate-500 bg-white pb-10 flex flex-col justify-between items-center overflow-hidden">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">Cliente</h6>
                </div>
                <div className="flex flex-col items-center gap-3">

                    <label className="w-[270px] text-sm font-bold mb-2 text-[#1C1D26]">
                        <input
                            className="focus:border-slate-800 text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="name_client"
                            name="name_client"
                            required
                            placeholder="Nome do cliente"
                            onChange={(e) => handleInput("name_client", e)}
                            value={value.name_client}
                        />
                    </label>

                    <label className="w-[270px] text-sm font-bold mb-2 text-[#1C1D26]">
                        <input
                            className="focus:border-slate-800 text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            id="indicacao"
                            name="obs"
                            required
                            placeholder="Observação"
                            onChange={(e) => handleInput("obs", e)}
                            value={value.obs}
                        />
                    </label>
                </div>

                <button onClick={() => createCheck()}
                    disabled={loading}
                    className="w-[270px] rounded-xl bg-[#EB8F00] text-white font-semibold p-3 hover:bg-[#1C1D26] hover:text-white"
                >Cadastrar</button>
            </div>
        </div>
    );
};