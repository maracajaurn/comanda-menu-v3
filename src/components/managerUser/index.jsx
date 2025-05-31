import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useToggleView } from "../../contexts";
import { useLoader } from "../../contexts";

import { ModalUser } from "../../components/modalUser";
import { Delete, Edit, Plus } from "../../libs/icons";

import { UsuarioService } from "../../service/usuario/UsuarioService";

export const ManagerUser = () => {
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
        UsuarioService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    setListUser(result);
                    setLoading(false);
                    return
                };

                if (result?.status === false) {
                    setLoading(false);
                    toast.error(result.message);
                    return
                };

                setLoading(false);
                return
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                return
            });
    }, []);

    const deleteUser = (setting_id) => {
        setLoading(true);
        UsuarioService.deleteById(setting_id)
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    getAllUsers()
                    toast.success(`${result.message || "Usuário deletado"}`);
                    return
                };

                toast.error(result.message || "Ocoreu um erro ao realizar a operação.")
                return
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message || "Ocoreu um erro ao realizar a operação.")
                return
            });
    };

    return (
        <div className="max-w-[350px] flex justify-center items-center flex-col gap-5 border-b-2 pb-5">
            <ModalUser action={action} id={id} />

            <div className="w-full flex items-center flex-col gap-1 mt-10">
                <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                >Usuários</h2>

                <div className="mb-5 shadow-md sm:rounded-lg rounded-md max-w-[350px] overflow-x-auto">
                    <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-2 py-2 text-center">
                                    Usuário
                                </th>
                                <th scope="col" className="px-2 py-2 text-center">
                                    E-Mail
                                </th>
                                <th scope="col" className="px-2 py-2 text-center">
                                    Função
                                </th>
                                <th scope="col" className="px-2 py-2 text-center">
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listUser.map((item) => (
                                <tr key={item.user_id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {item.username}
                                    </td>
                                    <td className="px-2 py-2">
                                        {item.email}
                                    </td>
                                    <td className="px-2 py-2">
                                        {item.func === 'admin' ? 'ADM' :
                                            item.func === 'garcom' ? 'Garçom' :
                                                item.func === 'barmen' ? 'Barmen' :
                                                    item.func === 'cozinha' ? 'Cozinha' :
                                                        'Online'}
                                    </td>
                                    <td className="px-2 py-2 flex">
                                        <button
                                            className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                            onClick={() => handleModal("update", item.user_id)}
                                        ><Edit /></button>

                                        <button
                                            className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                            onClick={() => deleteUser(item.user_id)}
                                        ><Delete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button className="w-full flex items-center gap-1 justify-center p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                onClick={() => handleModal("new")}
            ><Plus />Cadastrar usuário</button>
        </div>
    )
};