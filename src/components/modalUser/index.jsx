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

    const clearForm = () => {
        setValue({ username: "", email: "", password: "", func: "garcom" });
    };

    const validateFields = () => {
        const { username, email, password, func } = value;
        return username && email && password && func;
    };

    const handleSubmit = () => {
        if (!validateFields()) return toast.error("Preencha todos os campos!");

        const data = { ...value };

        const request = action === "new"
            ? UsuarioService.create(data)
            : UsuarioService.updateById(id, data);

        request
            .then(result => toast.success(result.message))
            .catch(err => toast.error(err.message || "Erro inesperado."));

        clearForm();
        setToggleView(false);
    };

    const loadUser = () => {
        UsuarioService.getById(id)
            .then(result => {
                setValue({
                    username: result[0].username,
                    email: result[0].email,
                    func: result[0].func,
                    password: ""
                });
            })
            .catch(error => toast.error(error.message));
    };

    useEffect(() => {
        if (action === "update") loadUser();
        else clearForm();
    }, [action, id]);

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed inset-0 z-50 bg-black/50 backdrop-blur-sm items-center justify-center px-4`}>
            <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 flex flex-col gap-4">
                <button
                    onClick={() => setToggleView(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
                    aria-label="Fechar modal">
                    <Close />
                </button>

                <h2 className="text-xl font-bold text-center text-gray-800">
                    {action === "new" ? "Cadastrar Usuário" : "Atualizar Usuário"}
                </h2>

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Nome de usuário"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("username", e)}
                        value={value.username}
                    />

                    <input
                        type="email"
                        placeholder="E-mail"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("email", e)}
                        value={value.email}
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("password", e)}
                        value={value.password}
                    />

                    <select
                        className="w-full border p-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={value.func}
                        onChange={(e) => handleInput("func", e)}>
                        <option value="admin">Administrador</option>
                        <option value="garcom">Garçom</option>
                        <option value="barmen">Barmen</option>
                        <option value="cozinha">Cozinha</option>
                        <option value="online">Online</option>
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all">
                    <Plus />
                    {action === "new" ? "Cadastrar usuário" : "Atualizar usuário"}
                </button>
            </div>
        </div>
    );
};