import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Plus, Minus, Close, Cart } from "../../libs/icons";

import { ProductService } from "../../service/product/ProductService";

import { useToggleView } from "../../contexts"
import { useConnectionMonitor } from "../../hooks/connectionMonitor";

export const Menu = () => {

    const { setToggleView } = useToggleView()
    const isOnline = useConnectionMonitor();

    const navigate = useNavigate();

    const { id } = useParams();

    // listagem de produtos do db
    const [listProducts, setListProducts] = useState([]);

    // Estado que armazena o termo de filtro digitado
    const [filtro, setFiltro] = useState("");

    // Produto selecionado
    const [selectedProduct, setSelectedProduct] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const get_func = localStorage.getItem("func");
        const if_check_id = localStorage.getItem("check_id");

        if (get_func !== "admin" && !if_check_id) {
            navigate(-1);
        };

        setToggleView(false);
        getAllProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem("selected_product", JSON.stringify(selectedProduct));
    }, [selectedProduct]);

    const getAllProducts = useCallback(async () => {
        await ProductService.getAll()
            .then((result) => {
                mapProducts(result)
            })
            .catch((error) => { return toast.error(error.message || "Ocorreu um erro inesperado."); });
    }, []);

    const mapProducts = (list) => {
        list.map((item) => {
            const blob = new Blob([new Uint8Array(item.image?.data)], { type: 'image/jpeg' });
            blobToBase64(blob)
                .then((base64Image) => {
                    setListProducts((prev) => ([...prev, {
                        product_id: item.product_id,
                        product_name: item.product_name,
                        price: item.price,
                        category: item.category,
                        description: item.description,
                        stock: item.stock,
                        image: base64Image,
                    }]));
                })
                .catch((error) => {
                    toast.error('Erro ao converter a imagem: ' + error.message);
                });
        });
    };

    // converter imagem para base64
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

    // Adicionar obsevação a item
    const obsProduct = useCallback((product_id, value) => {
        const index_selected_product = selectedProduct.findIndex((item) => item[1] === product_id);
        if (index_selected_product !== -1) {
            selectedProduct[index_selected_product][3] = value;
            setSelectedProduct([...selectedProduct]);

            localStorage.setItem("selected_product", JSON.stringify(selectedProduct));
        };
    }, [selectedProduct]);

    // Editando quantidade de cada item
    const alterQnt = useCallback((product_id, action) => {
        const index = selectedProduct.findIndex((item) => item[1] === product_id);

        if (index !== -1) {
            const qnt = selectedProduct[index][2];
            if (action === "+") {
                selectedProduct[index][2] = qnt + 1;
                setSelectedProduct([...selectedProduct])
            } else if (action === "-" && qnt >= 1) {
                if (qnt === 1) {
                    const remove_product = selectedProduct.filter((item) => item[1] !== product_id);
                    setSelectedProduct(remove_product);
                } else {
                    selectedProduct[index][2] = qnt - 1;
                    setSelectedProduct([...selectedProduct]);
                };
            };
        } else if (action === "+") {
            const product = listProducts.find((item) => item.product_id === product_id);
            if (product) {
                setSelectedProduct((prev) => ([...prev, [id, product_id, 1, null]]));
            } else {
                toast.error("Produto não encontrado.");
            };
        };
    }, [listProducts, selectedProduct]);

    const navidateToCart = () => {
        navigate(`/${id}/cart`);
    };

    const itensFiltrados = listProducts.filter(item =>
        item.product_name.toLowerCase().includes(filtro.toLowerCase())
    );

    // Pagination calculations
    const totalItems = itensFiltrados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = itensFiltrados.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <nav className={`fixed top-0 w-full h-16 px-5 flex items-center justify-between bg-[#EB8F00] text-slate-100`}>
                <Toaster />
                <div>
                    {!isOnline ? (
                        <h2 className={`transition-all delay-200 uppercase bg-red-600 px-3 py-2 rounded-md font-bold text-white`}>Sem internet</h2>
                    ) : (
                        <h2 className="transition-all delay-200 font-bold uppercase text-[18px]">Menu</h2>
                    )}
                </div>

                <div className="flex gap-3 z-50 relative">
                    {selectedProduct.length > 0 && (
                        <div className="w-[21px] h-[21px] flex justify-center items-center bg-white rounded-full absolute -top-1 -left-1 z-10">
                            <h5 className="text-black">{selectedProduct.length}</h5>
                        </div>
                    )}

                    <button className={`
                        ${selectedProduct.length === 0 && "opacity-50 cursor-not-allowed -z-10"} w-[50px] h-[50px] p-3 rounded-[100%] text-white font-semibold 
                        bg-[#171821] hover:text-[#171821] border-2 border-transparent hover:border-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75`}
                        onClick={() => { navidateToCart(); setToggleView(false) }}
                        disabled={selectedProduct.length === 0}
                    ><Cart /></button>
                </div>
            </nav>

            <div className="w-[95%] min-h-[85vh] pb-[200px] px-3 rounded-xl flex items-center flex-col gap-10">
                <div className="border px-3 py-5 w-full rounded-xl shadow-md">
                    <label className="flex gap-2 items-center">
                        <input
                            type="text"
                            className="w-full border-2 rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Buscar produto..."
                            onChange={(e) => setFiltro(e.target.value)}
                            value={filtro}
                        />
                        <button type="button" className="border-2 rounded-xl p-[10px] hover:text-red-600 hover:border-red-600 transition-all delay-75">
                            <i onClick={() => setFiltro("")}><Close /></i>
                        </button>
                    </label>
                </div>

                {currentItems.map((item, index) => (
                    <div key={index} className={`flex flex-col justify-between items-center w-full rounded-xl bg-slate-100/50 shadow-md border`}>

                        {item.image && (
                            <div className="h-[300px] w-full rounded-md overflow-hidden"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}>
                            </div>
                        )}

                        <div className="w-full flex flex-col items-center justify-between gap-2 mt-3">
                            <h3 className="text-slate-900 text-[25px] font-bold">{item.product_name}</h3>
                            <p className="text-slate-500 text-[15px] font-semibold">{item.description}</p>
                            <h3 className="text-slate-500 text-[30px] font-semibold">R$ {item.price.toFixed(2).replace(".", ",")}</h3>
                        </div>

                        {selectedProduct.findIndex(product => product[1] === item.product_id) !== -1 && (
                            <label>
                                <input
                                    type="text" placeholder="Observação"
                                    className="w-full mt-1 border border-slate-500 rounded-[5px] p-1"
                                    onChange={(e) => obsProduct(item.product_id, e.target.value)}
                                />
                            </label>
                        )}

                        <div className="flex items-center gap-3 border-2 border-slate-500 rounded-md my-5">
                            <button className="py-1 px-5 border-r-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => alterQnt(item.product_id, "+")}
                            ><Plus /></button>

                            <p className="text-[#EB8F00] font-somibold">
                                {selectedProduct.find(product => product[1] === item.product_id)?.[2] || 0}
                            </p>

                            <button className="py-1 px-5 border-l-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => alterQnt(item.product_id, "-")}
                            ><Minus /></button>
                        </div>
                    </div>
                ))}

                {totalPages > 1 && (
                    <div className="w-full flex justify-between items-center gap-3 mt-5">
                        <button
                            className={`${currentPage === 1 && "opacity-50 cursor-not-allowed -z-10"} font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75`}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >Anterior
                        </button>

                        <span>{currentPage} de {totalPages}</span>

                        <button
                            className={`${currentPage === totalPages && "opacity-50 cursor-not-allowed -z-10"} font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75`}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >Próxima
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
