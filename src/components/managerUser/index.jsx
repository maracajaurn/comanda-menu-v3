import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useToggleView } from "../../contexts";
import { useLoader } from "../../contexts";

import { ModalUser } from "../../components/modalUser";
import { Delete, Edit, Plus } from "../../libs/icons";

import { UsuarioService } from "../../service/usuario/UsuarioService";

export const ManagerUser = ({ showComponent }) => {
    const { setToggleView } = useToggleView();
    const { setLoading } = useLoader();

    const [listUser, setListUser] = useState([]);
    const [action, setAction] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleModal = (action, id) => {
        setId(id);
        setAction(action);
        setToggleView(true);
    };

    const getAllUsers = useCallback(() => {
        setLoading(true);
        UsuarioService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    setListUser(result);
                    setLoading(false);
                    return;
                }
                if (result?.status === false) {
                    toast.error(result.message);
                    setLoading(false);
                    return;
                }
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }, []);

    const deleteUser = (user_id) => {
        setLoading(true);
        UsuarioService.deleteById(user_id)
            .then((result) => {
                if (result.status) {
                    toast.success(result.message || "Usuário deletado");
                    getAllUsers();
                    setLoading(false);
                    return;
                }
                toast.error(result.message || "Erro ao deletar usuário");
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message || "Erro ao deletar usuário");
                setLoading(false);
            });
    };

    return (
        <div className={`${showComponent === 1 ? "flex" : "hidden"} flex-col mt-5 w-full max-w-[1100px] mx-auto px-4`}>
            <ModalUser action={action} id={id} />

            <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold">
                Usuários
            </h2>

            <div className="overflow-x-auto mt-6 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full text-sm text-[#1C1D26]">
                    <thead className="bg-[#EB8F00] text-white sticky top-0">
                        <tr>
                            {["Usuário", "E-Mail", "Função", "Ação"].map((header) => (
                                <th key={header} className="px-6 py-3 whitespace-nowrap font-semibold text-center border-r border-orange-300 last:border-r-0">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {listUser.map((item, idx) => (
                            <tr
                                key={item.user_id}
                                className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-[#FFFDF7]" : "bg-white"
                                    } hover:bg-[#FFF4DB] transition-colors`}>
                                <td className="px-6 py-3 text-center font-medium">{item.username}</td>
                                <td className="px-6 py-3 text-center break-all text-nowrap">{item.email}</td>
                                <td className="px-6 py-3 text-center font-semibold">
                                    {item.func === "admin"
                                        ? "ADM"
                                        : item.func === "garcom"
                                            ? "Garçom"
                                            : item.func === "barmen"
                                                ? "Barmen"
                                                : item.func === "cozinha"
                                                    ? "Cozinha"
                                                    : "Online"}
                                </td>
                                <td className="px-6 py-3 text-center flex justify-center gap-3">
                                    <button
                                        className="p-2 rounded-md text-white bg-[#EB8F00] hover:bg-[#1C1D26] hover:text-white transition-colors"
                                        onClick={() => handleModal("update", item.user_id)}
                                        aria-label={`Editar usuário ${item.username}`}>
                                        <Edit />
                                    </button>
                                    <button
                                        className="p-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                                        onClick={() => deleteUser(item.user_id)}
                                        aria-label={`Deletar usuário ${item.username}`}>
                                        <Delete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-colors duration-200"
                onClick={() => handleModal("new")}
                aria-label="Cadastrar novo usuário">
                <Plus /> Cadastrar usuário
            </button>
        </div>
    );
};
