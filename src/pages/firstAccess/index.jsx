import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Navbar } from "../../components";
import { Plus } from "../../libs/icons"

import { LoginService } from "../../service/login/LoginService";

export const FirstAccess = () => {
    const { setLoading } = useLoader();
    setLoading(false);

    const [value, setValue] = useState({
        username: "",
        email: "",
        password: "",
        func: "garcom",
    });

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const create_user = async () => {
        setLoading(true);

        await LoginService.firt_access(value)
            .then((result) => {
                toast.success(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
        // setValue(prev => ({ ...prev, password: "", email: "", username: "" }));
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <Toaster />
            <div className="bg-white min-h-[300px] w-[300px] pb-5 rounded-md flex justify-center items-center flex-col gap-5 overflow-hidden">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">Primeiro acesso</h6>
                </div>
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

                <label className="flex flex-col text-slate-900 font-semibold">
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={value.func}
                        name="func"
                        value={value.func}
                        onChange={(e) => handleInput("func", e)}>
                        <option value={`garcom`} >Garçom</option>
                        <option value={`barmen`} >Barmen</option>
                        <option value={`cozinha`} >Cozinha</option>
                        <option value={`admin`} >Administrador</option>
                    </select>
                </label>

                <button className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    onClick={() => create_user()}
                ><Plus /> Cadastrar usuário</button>
            </div>
        </>
    );
};