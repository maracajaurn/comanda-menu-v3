import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar, CInput } from "../../components";

import { useLoader } from "../../contexts";

import { LoginService } from "../../service/login/LoginService";

export const Login = () => {

    const navigate = useNavigate();

    const { setLoading } = useLoader();

    const [value, setValue] = useState({
        email: "",
        password: ""
    });

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event }));
    };

    useEffect(() => {
        setLoading(false);
        const get_func = localStorage.getItem("func");
        const user_id = localStorage.getItem("user_id");

        if (get_func === "barmen" || get_func === "cozinha") {
            navigate(`/${user_id}/${get_func}/producao`)
        } else if (get_func === "admin") {
            navigate("/admin")
        } else if (get_func === "garcom") {
            navigate(`/${user_id}/${get_func}/comandas`)
        };
    }, []);

    const login = async () => {

        if (value.email === "" || value.password === "") {
            return toast.error("Preencha todos os campos corretamente!");
        };

        setLoading(true);
        await LoginService.login(value)
            .then((result) => {
                if (result.status) {

                    setLoading(false);

                    localStorage.setItem("token", result.token);
                    localStorage.setItem("func", result.func);
                    localStorage.setItem("user_id", result.user_id);

                    if (result.func === "barmen" || result.func === "cozinha") {
                        navigate(`/${result.user_id}/${result.func}/producao`);
                        return;
                    } else if (result.func === "admin") {
                        navigate(`/admin`);
                        return;
                    } else if (result.func === "garcom") {
                        navigate(`/${result.user_id}/${result.func}/comandas`);
                        return;
                    } else if (result.func === "online") {
                        navigate(`/${result.user_id}/created_online`);
                        return;
                    };
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message)
            });
    };
    
    return (
        <div className="h-full w-full">
            <Navbar title="Bem-vindo" />
            <div className="h-full flex justify-center items-center flex-col">
                <CInput
                    id="email"
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    onChange={(e) => handleInput("email", e)}
                    value={value.email}
                />

                <CInput
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Senha"
                    onChange={(e) => handleInput("password", e)}
                    value={value.password}
                />

                <button className="w-[250px] font-semibold flex justify-center p-3 text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75 uppercase"
                    onClick={() => login()}
                >Login</button>
            </div>
        </div>
    );
};
