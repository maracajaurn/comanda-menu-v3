import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { ModalUser } from "../../components/modalUser";

import { useToggleView } from "../../contexts";

import { Delete, Edit, Plus, Reflesh } from "../../libs/icons";

import { useLoader } from "../../contexts";

import { SettingService } from "../../service/setting/SettingService";
import { UsuarioService } from "../../service/usuario/UsuarioService";
import { CategoryService } from "../../service/category/CategoryService";

export const ManageUser = () => {
    const { toggleView, setToggleView } = useToggleView();
    const { setLoading } = useLoader();

    const [id, setId] = useState(null);

    const [listUser, setListUser] = useState([]);

    const [action, setAction] = useState(null);

    const [setting, setSetting] = useState({
        setting_id: 1,
        estabishment_name: "",
        serveice_change: 0,
        service_change_percentage: 0,
        image_pix: "",
        color: ""
    });

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name_category: "",
        screen: "",
        action: "create" | "update",
        category_id: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        const get_func = localStorage.getItem("func");

        if (get_func !== "admin") {
            return navigate("/login");
        };

        getAllUsers();
    }, [toggleView]);

    useEffect(() => {
        getSetting();
        getAllCategoies();
    }, []);

    const handleSetting = (field, event) => {
        setSetting(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleModal = (action, id) => {
        setId(id);
        setAction(action);
        setToggleView(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Verifica se o arquivo é uma imagem
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validTypes.includes(file.type)) {
                return toast.error("Apenas arquivos de imagem (JPG, PNG) são permitidos.");
            }

            // Verifica se o tamanho do arquivo é maior que 5 mb
            if (file.size > 16 * 1024 * 1024) {
                return toast.error("A imagem deve ser menor que 16 MB.");
            };

            const reader = new FileReader();
            reader.onloadend = () => {
                setSetting((prev) => ({ ...prev, image_pix: reader.result }));
            };
            reader.readAsDataURL(file);
        };
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject('Erro ao ler o Blob: ' + error);
            };

            reader.readAsDataURL(blob);
        });
    };

    const getSetting = useCallback(() => {
        SettingService.get()
            .then((result) => {
                if (result[0]) {
                    const image = result[0].image_pix?.data;

                    if (image) {
                        const blob = new Blob([new Uint8Array(image)], { type: 'image/jpeg' });
                        blobToBase64(blob)
                            .then((base64Image) => {
                                setSetting((prev) => ({
                                    ...prev,
                                    setting_id: result[0].setting_id,
                                    estabishment_name: result[0].estabishment_name,
                                    serveice_change: result[0].serveice_change,
                                    service_change_percentage: result[0].service_change_percentage,
                                    color: result[0].color,
                                    image_pix: base64Image,
                                }));

                                return;
                            })
                            .catch((error) => {
                                return toast.error('Erro ao converter a imagem: ' + error.message);
                            });
                    } else {
                        return setSetting(result[0]);
                    };
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    const updateSetting = useCallback(() => {
        const payload = {
            estabishment_name: setting.estabishment_name,
            serveice_change: setting.serveice_change,
            service_change_percentage: setting.service_change_percentage,
            image_pix: setting.image_pix,
            color: setting.color
        };

        if (!setting.setting_id) {
            return toast.error("Configurações não carregadas.");
        };

        setLoading(true);

        SettingService.update(setting.setting_id, payload)
            .then((result) => {
                getSetting();
                toast.success(result.message);
                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error)
            });
    }, [setting]);

    const getAllUsers = useCallback(() => {
        UsuarioService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    setListUser(result);
                    return setLoading(false);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, []);

    const deleteUser = async (setting_id) => {
        setLoading(true);
        await UsuarioService.deleteById(setting_id)
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    getAllUsers()
                    return toast.success(`${result.message || "Usuário deletado"}`);
                };

                return toast.error(result.message || "Ocoreu um erro ao realizar a operação.")
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message || "Ocoreu um erro ao realizar a operação.")
            });
    };

    const getAllCategoies = useCallback(() => {
        CategoryService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    setCategories(result);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {

            });
    }, []);

    const createCategory = () => {
        if (!newCategory.name_category || !newCategory.screen) {
            return toast.error("Preencha todos os campos.");
        };

        const data = {
            name_category: newCategory.name_category,
            screen: newCategory.screen
        };

        CategoryService.create(data)
            .then((result) => {
                if (result.status) {
                    setNewCategory({ name_category: "", screen: "" });
                    getAllCategoies();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    };

    const updateCategory = () => {
        if (!newCategory.name_category || !newCategory.screen) {
            return toast.error("Preencha todos os campos.");
        };

        const data = {
            name_category: newCategory.name_category,
            screen: newCategory.screen
        };

        CategoryService.updateById(newCategory.category_id, data)
            .then((result) => {
                if (result.status) {
                    setNewCategory({ name_category: "", screen: "", action: "create", category_id: 0 });
                    getAllCategoies();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    };

    const deleteCategory = (id) => {
        CategoryService.deleteById(id)
            .then((result) => {
                if (result.status) {
                    getAllCategoies();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    };

    const handleNewCategory = (field, event) => {
        setNewCategory(prev => ({ ...prev, [field]: event.target.value }));
    };

    return (
        <>
            <Navbar title={"Usuários"} url />
            <div className="flex flex-col gap-10 mb-10">
                
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
                                    {listUser.map((e) => (
                                        <tr key={e.user_id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td scope="row" className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {e.username}
                                            </td>
                                            <td className="px-2 py-2">
                                                {e.email}
                                            </td>
                                            <td className="px-2 py-2">
                                                {e.func === 'admin' ? 'ADM' :
                                                    e.func === 'garcom' ? 'Garçom' :
                                                        e.func === 'barmen' ? 'Barmen' :
                                                            e.func === 'cozinha' ? 'Cozinha' :
                                                                'Online'}
                                            </td>
                                            <td className="px-2 py-2 flex">
                                                <button
                                                    className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                                    onClick={() => handleModal("update", e.user_id)}
                                                ><Edit /></button>

                                                <button
                                                    className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                                    onClick={() => deleteUser(e.user_id)}
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

                <div className="mt-5 flex flex-col gap-6">
                    <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                    >Configurações</h2>

                    <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                        Nome do Estabelecimento
                        <input
                            type="text"
                            id="establishmentName"
                            name="establishmentName"
                            className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => handleSetting("estabishment_name", e)}
                            value={setting.estabishment_name}
                        />
                    </label>

                    <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                        Cobrar Taxa de Serviço?
                        <select className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="serviceCharge"
                            name="serviceCharge"
                            value={setting.serveice_change}
                            onChange={(e) => handleSetting("serveice_change", e)}>
                            <option value="1" >Sim</option>
                            <option value="0" >Não</option>
                        </select>
                    </label>

                    <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                        Percentual de Taxa de Serviço (%)
                        <input
                            type="number"
                            id="serviceChargePercentage"
                            name="serviceChargePercentage"
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => handleSetting("service_change_percentage", e)}
                            value={setting.service_change_percentage}
                        />
                    </label>

                    <label className={`${toggleView ? "-z-10" : ""} relative w-full flex flex-col items-center gap-3`}>
                        <div className="w-full flex flex-col items-center gap-3 border rounded-xl p-3 relative">
                            <button
                                type="button"
                                onClick={() => document.getElementById("qrcodepix").click()}
                                className="w-full py-2 bg-[#EB8F00] text-white font-semibold rounded-lg hover:bg-[#1C1D26] transition-all"
                            >
                                QR Code Pix
                            </button>

                            {setting.image_pix && (
                                <div className="relative w-2/3">
                                    <img
                                        className="w-[250px] rounded-xl object-cover"
                                        src={setting.image_pix}
                                        alt="Imagem do QR Code Pix"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSetting((prev) => ({ ...prev, image_pix: "" }))}
                                        className="absolute bottom-2 right-2 p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-100 transition-all"
                                    >
                                        <Delete />
                                    </button>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            id="qrcodepix"
                            name="qrcodepix"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>

                    <button
                        className="flex gap-1 justify-center w-full p-3 font-semibold text-white self-center mt-5
                            rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                        onClick={() => updateSetting()}
                    ><Reflesh />Atualizar Pix</button>
                </div>

                <div className="mb-5 sm:rounded-lg rounded-md w-[350px] overflow-x-auto">
                    <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                    >Categorias</h2>

                    <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-2 py-2 text-center">
                                    Categoria
                                </th>
                                <th scope="col" className="px-2 py-2 text-center">
                                    Tela
                                </th>
                                <th scope="col" className="px-2 py-2 text-center">
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.category_id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="text-center uppercase px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {category.name_category}
                                    </td>
                                    <td scope="row" className="text-center uppercase px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {category.screen}
                                    </td>
                                    <td className="px-2 py-2 flex justify-center">
                                        <button
                                            className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                            onClick={() => setNewCategory(() => ({
                                                name_category: category.name_category,
                                                screen: category.screen,
                                                action: "update",
                                                category_id: category.category_id
                                            }))}
                                        ><Edit /></button>

                                        <button
                                            className="p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                            onClick={() => deleteCategory(category.category_id)}
                                        ><Delete /></button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-5">
                        <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                            <input type="text"
                                placeholder="Nome da categoria"
                                className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newCategory.name_category}
                                onChange={(e) => handleNewCategory("name_category", e)} />
                        </label>

                        <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                            <select name="screen_category"
                                id="screen_category"
                                value={newCategory.screen}
                                onChange={(e) => handleNewCategory("screen", e)}
                                className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Selecione a tela</option>
                                <option value="bar">Bar</option>
                                <option value="churrasco">Churrasco</option>
                                <option value="sem tela">Sem tela</option>
                            </select>
                        </label>
                        <button
                            className="flex gap-1 justify-center w-full p-3 font-semibold text-white self-center mt-5
                                    rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                            onClick={() => { newCategory.action === "update" ? updateCategory() : createCategory() }}>
                            {newCategory.action === "update" ? (<><Reflesh /> Atualizar categoria</>) : (<><Plus /> Cadastrar categoria</>)}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
