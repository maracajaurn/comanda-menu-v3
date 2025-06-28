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
        <div className={`${toggleView ? "flex" : "hidden"} fixed inset-0 z-50 bg-black/50 backdrop-blur-sm items-center justify-center px-4`}>
            <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 flex flex-col gap-4">

                {!is_client && (
                    <button
                        onClick={() => setToggleView(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
                        aria-label="Fechar">
                        <Close />
                    </button>
                )}

                <h2 className="text-xl font-bold text-center text-gray-800">
                    Nova Comanda
                </h2>

                <div className="flex flex-col gap-3">
                    <input
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        type="text"
                        placeholder="Nome do cliente"
                        onChange={(e) => handleInput("name_client", e)}
                        value={value.name_client}
                    />

                    <input
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        type="text"
                        placeholder="Observação"
                        onChange={(e) => handleInput("obs", e)}
                        value={value.obs}
                    />
                </div>

                <button
                    onClick={() => createCheck()}
                    disabled={loading}
                    className="w-full bg-amber-500 text-white font-semibold p-3 rounded-xl hover:bg-amber-600 transition">
                    Cadastrar
                </button>
            </div>
        </div>
    );
};