import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Close } from "../../libs/icons";

import { useLoader } from "../../contexts";

import socket from "../../service/socket";
import { useToggleView } from "../../contexts";
import { CheckService } from "../../service/check/CheckService";
import { CashierService } from "../../service/cashier/CashierService"

export const NewCheck = ({ is_client = false, user_id }) => {

    const navigate = useNavigate();

    const { loading, setLoading } = useLoader();

    const [value, setValue] = useState({
        name_client: "",
        cashier_id: null,
        obs: ""
    });

    const { toggleView, setToggleView } = useToggleView();

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    useEffect(() => {
        CashierService.getByStatus(1)
            .then((result) => {
                setValue(prev => ({ ...prev, cashier_id: result[0].cashier_id }));
            }).catch((error) => {
                return toast.error(error.message);
            });
    }, []);

    const createCheck = useCallback(() => {
        if (value.name_client === "") {
            setValue(prev => ({ ...prev, name_client: "Nova comanda" }));
        };

        if (value.name_client !== "") {
            const data = {
                name_client: value.name_client,
                cashier_id: value.cashier_id,
                obs: value.obs,
            };

            setLoading(true);

            CheckService.create(data)
                .then((result) => {
                    if (result.status) {
                        setToggleView(false);
                        localStorage.removeItem("check_id");
                        navigate(`/${user_id}/garcom/comanda/${result.check_id}`);

                        socket.emit("nova_comanda", data);
                        toast.success(result.message);
                        setValue(prev => ({ ...prev, name_client: "", obs: "" }));
                        setLoading(false);
                    };

                    setLoading(false);
                    return toast.error(result.message);
                }).catch((error) => {
                    setLoading(false);
                    return toast.error(error.message);
                });
        };
    }, [value]);

    return (
        <div className={`${toggleView ? "block" : "hidden"} fixed top-0 left-0 h-[100dvh] w-[100vw] bg-slate-950/50 backdrop-blur-sm py-3 px-1 flex flex-col justify-center items-center gap-5`}>
            
            <div className="h-[300px] w-[300px] rounded-md border-hidden bg-white pb-10 flex flex-col justify-between items-center overflow-hidden">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">Nova comanda</h6>
                </div>
                <div className="flex flex-col items-center gap-3">

                    <label className="w-[270px] text-sm font-bold mb-2 text-[#1C1D26]">
                        <input
                            className="text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="text-[#1C1D26] bg-transparent border rounded-xl w-full p-3 leading-tight focus:outline-none focus:shadow-outline"
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

            {!is_client && (
                <button className="flex justify-center p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    onClick={() => setToggleView(false)}
                ><Close /></button>
            )}

        </div>
    );
};