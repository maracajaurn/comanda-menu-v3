import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Plus, Close } from "../../libs/icons";
import { useToggleView } from "../../contexts";
import { UsuarioService } from "../../service/usuario/UsuarioService";

export const ModalUser = ({ action, id }) => {

    const { toggleView, setToggleView } = useToggleView();

    const [value, setValue] = useState({
        username: "",
        email: "",
        password: "",
        func: "garcom",
    });

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const createUser = () => {
        if (value.username === "" || value.email === "" || value.password === "" | value.func === "") {
            return toast.error("Preencha todos os campos!");
        };

        const data = {
            username: value.username,
            email: value.email,
            password: value.password,
            func: value.func
        };

        UsuarioService.create(data)
            .then((result) => {
                toast.success(`${result.message}`);
            })
            .catch((error) => { return toast.error(error.message) });

        setValue(prev => ({ ...prev, password: "", email: "", username: "" }));

        setToggleView(false);

    };

    const updateById = () => {
        if (value.username === "" || value.email === "" || value.password === "" | value.func === "") {
            return toast.error("Preencha todos os campos!");
        };

        const data = {
            username: value.username,
            email: value.email,
            password: value.password,
            func: value.func
        };

        try {
            UsuarioService.updateById(id, data)
                .then((result) => {
                    toast.success(`${result.message}`);
                })
                .catch((error) => { return toast.error(error) });

            setValue(prev => ({ ...prev, password: "", email: "", username: "" }));
            setToggleView(false);

        } catch (error) {
            return toast.error(error);
        };
    };

    const loadUser = () => {
        UsuarioService.getById(id)
            .then((result) => {
                setValue(prev => ({
                    ...prev,
                    func: result[0].func,
                    email: result[0].email,
                    username: result[0].username
                }));
            })
            .catch((error) => { return toast.error(error.message) });
    };

    useEffect(() => {
        if (action === "update") {
            loadUser();
        } else {
            setValue(prev => ({ ...prev, password: "", email: "", username: "" }));
        };
    }, [action, id]);

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed top-0 left-0 w-full h-[100dvh] flex flex-col gap-10 justify-center items-center bg-slate-950/50 backdrop-blur-sm`}>
            
            <div className="bg-white min-h-[300px] w-[300px] pb-5 rounded-md flex justify-center items-center flex-col gap-5 overflow-hidden">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">{action === "new" ? "Cadastrar Usuário" : "Atualizar Usuário"}</h6>
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
                        <option value={`admin`} >Administrador</option>
                        <option value={`garcom`} >Garçom</option>
                        <option value={`barmen`} >Barmen</option>
                        <option value={`cozinha`} >Cozinha</option>
                        <option value={`online`} >Online</option>
                    </select>
                </label>

                <button className="flex gap-1 justify-center w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    onClick={() => { action === "new" ? createUser() : updateById() }}
                ><Plus /> {action === "new" ? "Cadastrar usuário" : "Atualizar usuário"}</button>
            </div>
            <button className="flex justify-center p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                onClick={() => setToggleView(false)}
            ><Close /></button>
        </div>
    );
};