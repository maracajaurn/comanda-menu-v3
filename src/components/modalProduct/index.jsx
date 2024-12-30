import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useToggleView } from "../../contexts";
import { Plus, Close, Delete } from "../../libs/icons";
import { ProductService } from "../../service/product/ProductService";

export const ModalProduct = ({ action, id }) => {

    const [value, setValue] = useState({
        product_name: "",
        price: 0,
        category: "Bebida",
        description: "",
        stock: 0,
        image: "",
    });

    const { toggleView, setToggleView } = useToggleView();

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const createProduct = () => {

        if (value.product_name === "" || value.category === "" || value.price === 0) {
            return toast.error("preencha todos os campos");
        };

        const data = {
            product_name: value.product_name,
            price: value.price,
            category: value.category,
            description: value.description,
            stock: value.stock,
            image: value.image,
        };

        ProductService.create(data)
            .then((result) => {
                setToggleView(false);
                toast(result.message);

                setValue(prev => ({ ...prev, "product_name": "" }));
                setValue(prev => ({ ...prev, "price": 0 }));
                setValue(prev => ({ ...prev, "category": "Bebida" }));
            })
            .catch((error) => { return toast.error(error.message); })
    };

    const updateById = () => {

        if (value.product_name === "" || value.category === "" || value.price === 0) {
            return toast.error("preencha todos os campos");
        };

        const data = {
            product_name: value.product_name,
            price: value.price,
            category: value.category,
            description: value.description,
            stock: value.stock,
            image: value.image,
        };

        ProductService.updateById(id, data)
            .then((result) => {
                setToggleView(false);
                return toast.success(result.message);
            })
            .catch((error) => { return toast.error(error.message); })
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
                setValue((prev) => ({ ...prev, image: reader.result }));
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

    useEffect(() => {
        if (id) {
            ProductService.getById(id)
                .then((result) => {
                    const image = result[0].image?.data;

                    if (image) {
                        const blob = new Blob([new Uint8Array(image)], { type: 'image/jpeg' });
                        blobToBase64(blob)
                            .then((base64Image) => {
                                setValue((prev) => ({
                                    ...prev,
                                    product_name: result[0].product_name,
                                    price: result[0].price,
                                    category: result[0].category,
                                    description: result[0].description,
                                    stock: result[0].stock,
                                    image: base64Image,
                                }));
                            })
                            .catch((error) => {
                                toast.error('Erro ao converter a imagem: ' + error.message);
                            });
                    } else {
                        setValue(result[0]);
                    };
                })
                .catch((error) => { return toast.error(error.message) });
        } else {
            setValue(prev => ({
                ...prev,
                product_name: "",
                price: 0,
                category: "Bebida",
                description: "",
                stock: 0,
                image: "",
            }));
        }
    }, [id]);

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed top-0 left-0 w-full h-[100dvh] flex flex-col gap-10 justify-center items-center bg-slate-950/50`}>
            <Toaster />
            <div className="bg-white min-h-[300px] w-[300px] pb-5 rounded-md flex justify-center items-center flex-col gap-2 overflow-auto">
                <div className="p-5 bg-[#EB8F00] w-full">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">{action === "new" ? "Cadastrar Produto" : "Atualizar Produto"}</h6>
                </div>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <p>Nome do produto</p>
                    <input
                        type="text"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Produto"
                        onChange={(change) => handleInput("product_name", change)}
                        value={value.product_name}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <p>Preço</p>
                    <input
                        type="number"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Preço"
                        onChange={(change) => handleInput("price", change)}
                        value={value.price}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <p>Descrição</p>
                    <textarea
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Descrição"
                        onChange={(change) => handleInput("description", change)}
                        value={value.description}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <p>Estoque</p>
                    <input
                        type="number"
                        className="w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Estoque"
                        onChange={(change) => handleInput("stock", change)}
                        value={value.stock}
                    />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2">
                    <p>Categoria</p>
                    <select className="w-[250px] border p-3 rounded-xl"
                        id={value.category}
                        name="category"
                        value={value.category}
                        onChange={(category) => handleInput("category", category)}>
                        <option value={`Bebida`} >Bebida</option>
                        <option value={`Drink`} >Sucos & Drinks</option>
                        <option value={`Petisco`} >Petisco</option>
                        <option value={`Porcao`} >Porção</option>
                        <option value={`Refeicao`} >Refeição</option>
                        <option value={`Salada`} >Salada</option>
                        <option value={`Doce`} >Doce</option>
                    </select>
                </label>

                <label className={`relative w-[90%] flex flex-col items-center gap-3`}>
                    <div className="w-full flex flex-col items-center gap-3 border rounded-xl p-2 relative">
                        <button
                            type="button"
                            onClick={() => document.getElementById("qrcodepix").click()}
                            className="w-full py-2 bg-[#EB8F00] text-white font-semibold rounded-lg hover:bg-[#1C1D26] transition-all"
                        >
                            Imagem do produto
                        </button>

                        {value.image && (
                            <div className="relative w-2/3">
                                <img
                                    className="w-[250px] rounded-xl object-cover"
                                    src={value.image}
                                    alt="Imagem do produto"
                                />
                                <button
                                    type="button"
                                    onClick={() => setValue((prev) => ({ ...prev, image: "" }))}
                                    className="absolute bottom-0 right-0 p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-100 transition-all"
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

                <button className="flex justify-center w-[250px] p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    onClick={() => action === "new" ? createProduct() : updateById()}
                ><Plus /> {action === "new" ? "Cadastrar" : "Atualizar"}</button>
            </div>

            <button className="flex justify-center p-3 font-semibold text-white rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                onClick={() => setToggleView(false)}
            ><Close /></button>
        </div>
    );
};