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

    const getSetting = useCallback(async () => {
        await SettingService.get()
            .then((result) => {
                const image = result.image_pix?.data;

                if (image) {
                    const blob = new Blob([new Uint8Array(image)], { type: 'image/jpeg' });
                    blobToBase64(blob)
                        .then((base64Image) => {
                            setSetting((prev) => ({
                                ...prev,
                                setting_id: result.setting_id,
                                estabishment_name: result.estabishment_name,
                                serveice_change: result.serveice_change,
                                service_change_percentage: result.service_change_percentage,
                                color: result.color,
                                image_pix: base64Image,
                            }));
                        })
                        .catch((error) => {
                            toast.error('Erro ao converter a imagem: ' + error.message);
                        });
                } else {
                    setSetting(result);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    const updateSetting = useCallback(async () => {
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

        await SettingService.update(setting.setting_id, payload)
            .then((result) => {
                getSetting();
                toast.success(result.message);
                setLoading(false);
                return
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error)
            });
    }, [setting]);

    const getAllUsers = useCallback(async () => {
        await UsuarioService.getAll()
            .then((result) => {
                setListUser(result);
                setLoading(false);
            })
            .catch((error) => { return toast.error(error.message || "Ocoreu um erro ao realizar a operação.") });
    }, []);

    const deleteUser = async (setting_id) => {
        setLoading(true);
        await UsuarioService.deleteById(setting_id)
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    toast.success(`${result.message || "Configurações atualizadas"}`);
                    getAllUsers()
                };

                return toast.error(result.message || "Ocoreu um erro ao realizar a operação.")
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message || "Ocoreu um erro ao realizar a operação.")
            });
    };

    return (
        <>
            <Navbar title={"Usuários"} url />
            <div className="flex flex-col gap-10 mb-10">
                <div className="flex justify-center items-center flex-col gap-5 border-b-2 pb-5">
                    <ModalUser action={action} id={id} />
                    <Toaster />

                    <div className="w-full flex items-center flex-col gap-1 mt-10">
                        <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                        >Usuários</h2>

                        <div className="mb-5 overflow-x-auto shadow-md sm:rounded-lg rounded-md">
                            <table className="w-[300px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                                            <th scope="row" className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {e.username}
                                            </th>
                                            <td className="px-2 py-2">
                                                {e.email}
                                            </td>
                                            <td className="px-2 py-2">
                                                {e.func === 'admin' ? 'ADM' :
                                                    e.func === 'garcom' ? 'Garçom' :
                                                        e.func === 'barmen' ? 'Barmen' :
                                                            e.func === 'cozinha' ? 'Cozinha' : ''}
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

                <div>
                    <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                    >Configurações</h2>

                    <div className="mt-5 flex flex-col gap-6">
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
                                value={setting.serveice_change ? "1" : "0"}
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
                        ><Reflesh />Atualizar configurações</button>
                    </div>
                </div>
            </div>
        </>
    );
};