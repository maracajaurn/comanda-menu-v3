import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import toast, { Toaster } from "react-hot-toast";
import { SettingService } from "../../service/setting/SettingService";

import { LoginService } from "../../service/login/LoginService";

export const Login = () => {

    const navigate = useNavigate();

    const [value, setValue] = useState({
        email: "",
        password: ""
    });

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    useEffect(() => {
        const get_func = localStorage.getItem("func");

        if (get_func === "barmen" || get_func === "cozinha") {
            navigate(`${get_func}/producao`)
        } else if (get_func === "admin") {
            navigate("/admin")
        } else if (get_func === "garcom") {
            navigate(`/${get_func}/comandas`)
        };
    }, []);


    const login = async () => {

        if (value.email === "" || value.password === "") {
            return toast.error("Preencha todos os campos corretamente!");
        };

        await LoginService.login(value)
            .then((result) => {
                if (result.status) {
                    sessionStorage.setItem("token", result.token);
                    localStorage.setItem("func", result.func);

                    if (result.func === "barmen" || result.func === "cozinha") {
                        navigate(`/${result.func}/producao`);
                        return;
                    } else if (result.func === "admin") {
                        navigate(`/admin`);
                        return;
                    } else if (result.func === "garcom") {
                        navigate(`/${result.func}/comandas`);
                        return;
                    };
                };

                return toast.error(result.message);
            })
            .catch((error) => { return toast.error(error.message) });
    };

    return (
        <div className="h-full w-full">
            <Navbar title="Bem-vindo" />
            <div className="h-full flex justify-center items-center flex-col">
                <Toaster />
                <div className="mb-4">
                    <label className="text-slate-700 text-sm font-bold mb-2">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="E-mail"
                            onChange={(e) => handleInput("email", e)}
                            value={value.email}
                        />
                    </label>
                </div>

                <div className="mb-4">
                    <label className="text-slate-700 text-sm font-bold mb-2">
                        <input
                            type="password"
                            id="pass"
                            name="pass"
                            className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Senha"
                            onChange={(e) => handleInput("password", e)}
                            value={value.password}
                        />
                    </label>
                </div>

                <button className="w-[250px] font-semibold p-3 rounded-xl text-white bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] uppercase"
                    onClick={() => login()}
                >Login</button>
            </div>
        </div>
    );
};
