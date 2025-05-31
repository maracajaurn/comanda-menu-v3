import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useLoader } from "../../contexts";
import { useToggleView } from "../../contexts";

import { Delete, Reflesh } from "../../libs/icons";

import { SettingService } from "../../service/setting/SettingService";

export const Settings = () => {
    const { toggleView } = useToggleView();
    const { setLoading } = useLoader();

    const [setting, setSetting] = useState({
        setting_id: 1,
        estabishment_name: "",
        serveice_change: 0,
        service_change_percentage: 0,
        image_pix: "",
        color: ""
    });

    useEffect(() => {
        getSetting();
    }, []);

    const handleSetting = (field, event) => {
        setSetting(prev => ({ ...prev, [field]: event.target.value }));
    };

    const updateSetting = useCallback(() => {
        const payload = {
            estabishment_name: setting.estabishment_name,
            serveice_change: setting.serveice_change,
            service_change_percentage: setting.service_change_percentage,
            image_pix: setting.image_pix,
            color: setting.color
        };

        if (!setting.setting_id) {
            toast.error("Configurações não carregadas.");
            return
        };

        setLoading(true);

        SettingService.update(setting.setting_id, payload)
            .then((result) => {
                getSetting();
                toast.success(result.message);
                setLoading(false);
                return
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error)
                return
            });
    }, [setting]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Verifica se o arquivo é uma imagem
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!validTypes.includes(file.type)) {
                toast.error("Apenas arquivos de imagem (JPG, PNG) são permitidos.");
                return
            };

            // Verifica se o tamanho do arquivo é maior que 5 mb
            if (file.size > 16 * 1024 * 1024) {
                toast.error("A imagem deve ser menor que 16 MB.");
                return
            };

            const reader = new FileReader();
            reader.onloadend = () => {
                setSetting((prev) => ({ ...prev, image_pix: reader.result }));
            };
            reader.readAsDataURL(file);
        };
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

    return (
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
    );
};