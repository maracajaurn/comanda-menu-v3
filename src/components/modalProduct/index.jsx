import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useToggleView, useLoader } from "../../contexts";
import { Plus, Close, Delete } from "../../libs/icons";
import { ProductService } from "../../service/product/ProductService";
import { CategoryService } from "../../service/category/CategoryService";

export const ModalProduct = ({ action, id }) => {

    const [value, setValue] = useState({
        product_name: "",
        price: 0,
        category_id: 0,
        description: undefined,
        stock: 0,
        image: null,
    });

    const [categories, setCategories] = useState([]);

    const { toggleView, setToggleView } = useToggleView();

    const { setLoading } = useLoader();

    const handleInput = (field, event) => {
        setValue(prev => ({ ...prev, [field]: event.target.value }));
    };

    const createProduct = () => {
        if (value.product_name === "" || value.category_id === "0" || value.price === 0) {
            toast.error("preencha todos os campos");
            return
        };

        setLoading(true);

        const data = {
            product_name: value.product_name,
            price: value.price,
            category_id: value.category_id,
            description: value.description,
            stock: value.stock,
            image: value.image,
        };

        ProductService.create(data)
            .then((result) => {

                if (!result.status) {
                    return toast.error(result.message);
                };

                setValue(prev => ({
                    ...prev,
                    "product_name": "",
                    "price": 0,
                    "category_id": "Bebida",
                }));

                setToggleView(false);
                setLoading(false);
                return toast.success(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
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
                setLoading(false);
                return toast.error(error.message);
            });
    }, []);

    const updateById = () => {
        if (value.product_name === "" || value.category_id === "0" || value.price === 0) {
            toast.error("preencha todos os campos");
            return
        };

        setLoading(true);

        const data = {
            product_name: value.product_name,
            price: value.price,
            category_id: value.category_id,
            description: value.description,
            stock: value.stock,
            image: value.image,
        };

        ProductService.updateById(id, data)
            .then((result) => {

                if (!result.status) {
                    toast.error(result.message);
                    return
                };

                setValue(prev => ({
                    ...prev,
                    "product_name": "",
                    "price": 0,
                    "category_id": 0,
                }));

                setToggleView(false);
                setLoading(false);
                toast.success(result.message);
                return
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                return
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Verifica se o arquivo é uma imagem
            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            if (!validTypes.includes(file.type)) {
                toast.error("Apenas arquivos de imagem (JPG, PNG, WEBP) são permitidos.");
                return
            };

            // Verifica se o tamanho do arquivo é maior que 5 mb
            if (file.size > 5 * 1024 * 1024) {
                toast.error("A imagem deve ser menor que 5 MB.");
                return
            };

            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    const webpDataUrl = canvas.toDataURL("image/webp", 0.8);

                    setValue((prev) => ({ ...prev, image: webpDataUrl }));
                };
                img.src = e.target.result;
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
                        const blob = new Blob([new Uint8Array(image)], { type: 'image/webp' });
                        blobToBase64(blob)
                            .then((base64Image) => {
                                setValue((prev) => ({
                                    ...prev,
                                    product_name: result[0].product_name,
                                    price: result[0].price,
                                    category_id: result[0].category_id,
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
                category_id: 0,
                description: null,
                stock: 0,
                image: null,
            }));
        }

        getAllCategoies();
    }, [id]);

    return (
        <div className={`${toggleView ? "flex" : "hidden"} fixed inset-0 z-50 bg-black/50 backdrop-blur-sm items-center justify-center px-4`}>
            <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 overflow-auto max-h-[90vh] flex flex-col gap-4">

                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
                    onClick={() => setToggleView(false)}
                    aria-label="Fechar">
                    <Close />
                </button>

                <h2 className="text-xl font-bold text-center text-gray-800">
                    {action === "new" ? "Cadastrar Produto" : "Atualizar Produto"}
                </h2>

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Nome do produto"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("product_name", e)}
                        value={value.product_name}
                    />

                    <input
                        type="number"
                        placeholder="Preço"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("price", e)}
                        value={value.price}
                    />

                    <textarea
                        placeholder="Descrição"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("description", e)}
                        value={value.description || ""}
                    />

                    <input
                        type="number"
                        placeholder="Estoque"
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onChange={(e) => handleInput("stock", e)}
                        value={value.stock}
                    />

                    <select
                        className="w-full border rounded-xl p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={value.category_id}
                        onChange={(e) => handleInput("category_id", e)}>
                        <option value={0}>Selecione uma categoria</option>
                        {categories.map(cat => (
                            <option key={cat.category_id} value={cat.category_id}>
                                {cat.name_category}
                            </option>
                        ))}
                    </select>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => document.getElementById("qrcodepix").click()}
                            className="w-full py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
                            type="button">
                            Imagem do produto
                        </button>

                        {value.image && (
                            <div className="relative mt-2">
                                <img
                                    src={value.image}
                                    alt="Produto"
                                    className="w-full rounded-xl max-w-xs object-cover"
                                />
                                <button
                                    onClick={() => setValue((prev) => ({ ...prev, image: null }))}
                                    className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-100"
                                    type="button">
                                    <Delete />
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            id="qrcodepix"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e)}
                        />
                    </div>
                </div>

                <button
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-all"
                    onClick={() => action === "new" ? createProduct() : updateById()}>
                    <Plus />
                    {action === "new" ? "Cadastrar" : "Atualizar"}
                </button>
            </div>
        </div>
    );
};