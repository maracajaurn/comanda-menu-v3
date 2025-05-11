import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Navbar } from "../../components";

import { CheckService } from "../../service/check/CheckService";
import { CashierService } from "../../service/cashier/CashierService"
import { LoginService } from "../../service/login/LoginService";

export const RegisterClient = () => {

    const navigate = useNavigate();
    const { loading, setLoading } = useLoader();

    const [value, setValue] = useState({
        name_client: "",
        cashier_id: null,
        obs: ""
    });

    useEffect(() => {
        setLoading(false);
        const check_id = localStorage.getItem("check_id");
        if (check_id) {
            navigate(`/${check_id}/products`);
        };
    }, []);

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const getCashier = useCallback(() => {
        CashierService.getByStatus(1)
            .then((result) => {
                if (result.length > 0) {
                    return createCheck(result[0].cashier_id);
                };

                setLoading(false);
                return toast.error(result.message);
            }).catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [value]);

    const authenticateClient = useCallback(() => {
        if (value.name_client === "") {
            return toast.error("O nome do cliente é obrigatório.");
        };

        localStorage.setItem("client", value.name_client);

        LoginService.Create_token_for_client(value.name_client)
            .then((result) => {
                if (result.status) {
                    localStorage.setItem("token", result.token);
                    return getCashier();
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [value]);

    const createCheck = useCallback((cashier_id) => {

        const data = {
            name_client: value.name_client,
            cashier_id,
            obs: value.obs,
        };

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
                return toast.error(error.message);
            });

    }, [value]);

    return (
        <>
            <div className={`flex justify-center items-center`}>
                <Navbar title="Bem-vindo" />
                
                <div className="w-[300px] rounded-md flex flex-col justify-between items-center gap-10">
                    <div className="flex flex-col items-center gap-3">

                        <label className="min-w-[350px] text-sm font-bold mb-2 text-[#1C1D26]">
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

                        <label className="min-w-[350px] h-auto text-sm font-bold mb-2 text-[#1C1D26]">
                            <textarea
                                className="h-[150px] focus:border-slate-800 text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
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

                    <button onClick={() => authenticateClient()}
                        disabled={loading}
                        className="min-w-[350px] rounded-xl bg-[#EB8F00] text-white font-semibold p-3 hover:bg-[#1C1D26] hover:text-white"
                    >Cadastrar</button>
                </div>
            </div>
        </>
    );
};
