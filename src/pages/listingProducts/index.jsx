import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components/navbar";
import { ListinProductsForCheck } from "../../components/listinProductsForCheck";

import { Plus, Delete, Minus, Close, ClipBoard } from "../../libs/icons";

import { CheckService } from "../../service/check/CheckService";
import { OrderService } from "../../service/order/OrderService";
import { ProductService } from "../../service/product/ProductService";

import socket from "../../service/socket";
import { useToggleView, useLoader } from "../../contexts"

export const ListingProducts = () => {

    const { toggleView, setToggleView } = useToggleView()
    const { setLoading } = useLoader();

    const navigate = useNavigate();

    const { id } = useParams();

    // listagem de produtos do db
    const [listProducts, setListProducts] = useState([]);

    const [client, setClient] = useState("");

    // Estado que armazena o termo de filtro digitado
    const [filtro, setFiltro] = useState("");

    // Produto selecionado
    const [selectedProduct, setSelectedProduct] = useState([]);

    // armazena um array com todos as categorias de produtos 
    // que serão adicionados à comanda
    const [categories, setCategories] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin" && get_func !== "garcom") {
            return navigate("/login");
        };

        setToggleView(false);
        getAllProducts();
        getCheckById();
    }, []);

    const getAllProducts = useCallback(() => {
        ProductService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    return setListProducts(result);
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

    const getCheckById = useCallback(() => {
        CheckService.getById(id)
            .then((result) => {
                if (result.length > 0) {
                    setClient(result[0].name_client);
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
    }, [id]);

    // adicionar produtos
    const addProduct = (product_id, category) => {
        if (selectedProduct.some((item) => item[1] === product_id)) {
            return toast("Produto já adicionado", { icon: "😐", duration: 1200 });
        };

        const if_exists = categories.some((item) => item === category);
        if (!if_exists) {
            setCategories((prev) => [...prev, category]);
        };

        setSelectedProduct((prev) => [...prev, [Number(id), product_id, 1, null]])
        return toast("Adicionado", { icon: "😉", duration: 1200 });
    };

    //remover item da lista
    const removeProduct = (product_id) => {
        if (!selectedProduct.some((item) => item[1] === product_id)) {
            return toast("Oxe ???", { icon: "🤨", duration: 1200 });
        };

        const index = selectedProduct.findIndex((item) => item[1] === product_id);
        if (index !== -1) {
            selectedProduct.splice(index, 1);
            setSelectedProduct([...selectedProduct]);
        };

        return toast("Removido", { icon: "🙄", duration: 1200 });
    };

    // Adicionar obsevação a item
    const obsProduct = (product_id, value) => {
        const index = selectedProduct.findIndex((item) => item[1] === product_id);
        if (index !== -1) {
            selectedProduct[index][3] = value;
            setSelectedProduct([...selectedProduct]);
        };
    };

    // Editando quantidade de cada item
    const alterQnt = async (product_id, stock, action) => {
        const index = selectedProduct.findIndex((item) => item[1] === product_id);
        if (index !== -1) {
            const qnt = selectedProduct[index][2];

            if (action === "+") {

                if (stock > qnt) {
                    selectedProduct[index][2] = qnt + 1;
                    setSelectedProduct([...selectedProduct]);
                } else {
                    return toast.error("Estoque insuficiente!");
                };

            } else if (action === "-") {
                if (qnt > 1) {
                    selectedProduct[index][2] = qnt - 1;
                    setSelectedProduct([...selectedProduct]);
                };
            };
        };
    };

    // enviar novos produtos para a comanda
    const postProducts = useCallback(async () => {
        if (!selectedProduct.length) {
            return toast.error("Adicione produtos!");
        };

        setLoading(true);

        const qtn = []

        listProducts.filter((item) => {
            selectedProduct.filter((selected) => {
                if (item.product_id === selected[1]) {
                    qtn.push([(item.stock - selected[2]), item.product_id])
                };
            });
        });

        OrderService.create_order({ list_order: selectedProduct, check_id: id, new_stock: qtn })
            .then((result) => {
                if (result.status) {
                    const objSocket = {
                        client,
                        categories
                    };

                    socket.emit("new_order", objSocket);
                    setLoading(false);
                    toast.success(result.message)
                    return navigate(-1);
                };

                return toast.error(result.message)
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [selectedProduct, categories]);

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
            <Navbar title={`Produtos`} url />
            <div className="w-[95%] min-h-[85vh] pb-[200px] px-3 rounded-xl flex items-center flex-col gap-10">
                <Toaster />
                <ListinProductsForCheck products={[]} />
                <div className="fixed bottom-0 flex items-center justify-center w-full bg-[#EB8F00] p-1 text-center text-slate-100">
                    <div className="flex flex-col w-2/3">
                        {selectedProduct.length ? (
                            <h5 className="text-xl my-3"><span className="font-bold">{selectedProduct.length}</span> {selectedProduct.length > 1 ? "itens" : "item"}</h5>
                        ) : (
                            <h5 className="text-xl my-3">Adicione produtos</h5>
                        )}

                        <button className="p-3 rounded-md text-white font-semibold bg-[#171821] hover:text-[#171821] border-2 border-transparent hover:border-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                            onClick={() => { postProducts(); setToggleView(false) }}
                        >Adicionar</button>
                    </div>
                    {selectedProduct.length > 0 &&
                        <button className="fixed bottom-1 right-1" onClick={() => setToggleView(!toggleView)}
                        ><ClipBoard /></button>
                    }
                </div>

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
                    <div key={index} className={`flex justify-between items-center px-3 py-1 w-full rounded-xl bg-slate-100/50 shadow-md`}>

                        <div className="w-2/3 flex flex-col items-start">
                            <h3 className="text-slate-900 font-bold">{item.stock} - {item.product_name}</h3>
                            <h3 className="text-slate-500 text-[15px] font-semibold">R$ {item.price.toFixed(2).replace(".", ",")}</h3>
                            <h3 className="text-[#EB8F00] text-[15px] font-semibold">{item.category}</h3>
                            {selectedProduct.findIndex(product => product[1] === item.product_id) !== -1 && (
                                <label >
                                    <input
                                        type="text" placeholder="Observação"
                                        className="w-full mt-1 border border-slate-500 rounded-[5px] p-1"
                                        onChange={(e) => obsProduct(item.product_id, e.target.value)}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="h-full ml-5 flex items-center justify-center gap-3 border-l-2 pl-3">
                            <div className="flex flex-col-reverse items-center gap-1 border-2 border-slate-500 rounded-md">
                                <button className="p-1 border-t-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(item.product_id, item.stock, "-")}
                                ><Minus /></button>

                                <p className="text-[#EB8F00] font-somibold">
                                    {selectedProduct.find(product => product[1] === item.product_id)?.[2] || 0}
                                </p>

                                <button className="p-1 border-b-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(item.product_id, item.stock, "+")}
                                ><Plus /></button>
                            </div>

                            <div className="flex gap-4 flex-col">
                                <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-blue-500 hover:border-blue-500 transition-all delay-75"
                                    onClick={() => addProduct(item.product_id, item.category)}
                                ><Plus /></button>

                                <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-red-600 hover:border-red-600 transition-all delay-75"
                                    onClick={() => removeProduct(item.product_id, item.category)}
                                ><Delete /></button>
                            </div>
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
