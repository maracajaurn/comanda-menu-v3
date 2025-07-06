import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Navbar } from "../../components";
import { Plus } from "../../libs/icons"

import { LoginService } from "../../service/login/LoginService";

export const FirstAccess = () => {
    const navigate = useNavigate();

    const { setLoading } = useLoader();
    setLoading(false);

    const [value, setValue] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const create_user = useCallback(() => {
        setLoading(true);

        LoginService.first_access(value)
            .then((result) => {
                if (result.status) {
                    toast.success(result.message);
                    navigate("/login");
                    return
                };

                toast.error(result.message);
                setLoading(false);
                return
            })
            .catch((error) => {
                toast.error(error.message);
                return
            });
    }, [value]);

    return (
        <>
            <Navbar url="Primeiro acesso" />

            <div className="bg-white min-h-[300px] w-[300px] pb-5 rounded-md flex justify-center items-center flex-col gap-5 overflow-hidden">
                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Nome de usuário"
                        onChange={(e) => handleInput("username", e)}
                        value={value.username}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="email"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="E-mail"
                        onChange={(e) => handleInput("email", e)}
                        value={value.email}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <input
                        type="password"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Senha"
                        onChange={(e) => handleInput("password", e)}
                        value={value.password}
                    />
                </label>

                <button className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    onClick={() => create_user()}
                ><Plus /> Cadastrar usuário</button>
            </div>
        </>
    );
};