import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Plus, Minus, Close, Cart, CheckProduct } from "../../libs/icons";

import { Navbar } from "../../components";

import { ProductService } from "../../service/product/ProductService";

import { useToggleView, useLoader } from "../../contexts"
import { useDebounce } from "../../hooks/UseDebounce";

export const Menu = () => {

    const { setToggleView } = useToggleView();
    const { debounce } = useDebounce(500);
    const { setLoading } = useLoader();

    const navigate = useNavigate();

    const { id } = useParams();

    // listagem de produtos do db
    const [listProducts, setListProducts] = useState([]);

    // Estado que armazena o termo de filtro digitado
    const [filtro, setFiltro] = useState("");

    // Produto selecionado
    const [selectedProduct, setSelectedProduct] = useState([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isFetching = useRef(false);

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");
        const if_check_id = localStorage.getItem("check_id");
        const if_selected_product = localStorage.getItem("selected_product");

        localStorage.removeItem("categories");

        if (if_selected_product) {
            setSelectedProduct(JSON.parse(if_selected_product));
        };

        if (get_func !== "admin" && !if_check_id) {
            navigate(-1);
        };

        setToggleView(false);
        getAllProducts();
    }, []);

    const getAllProducts = useCallback(() => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        console.log("Current page", page)
        ProductService.getByPagenated(10, page)
            .then((result) => {
                if (result.length > 0) {
                    mapProducts([...listProducts, ...result]);
                    setPage(prev => prev + 1);
                    return setLoading(false);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                setHasMore(false);
                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            })
            .finally(() => {
                setLoading(false);
                isFetching.current = false;
            });
    }, [page, listProducts]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                debounce(() => {
                    if (hasMore) getAllProducts();
                });
            };
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [getAllProducts, hasMore]);

    const mapProducts = (list) => {
        const mappedProducts = list.map((item) => {
            const blob = new Blob([new Uint8Array(item.image?.data)], { type: 'image/jpeg' });
            return blobToBase64(blob).then((base64Image) => ({
                product_id: item.product_id,
                product_name: item.product_name,
                price: item.price,
                category: item.category,
                description: item.description,
                stock: item.stock,
                image: base64Image,
            }));
        });

        Promise.all(mappedProducts)
            .then((products) => {
                setListProducts(products);
            })
            .catch((error) => {
                toast.error('Erro ao processar produtos: ' + error.message);
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

    const handleCategories = useCallback(() => {
        const categories = JSON.parse(localStorage.getItem("categories") || "[]");

        const selectedCategories = selectedProduct.map((product) => {
            const productData = listProducts.find((item) => item.product_id === product[1]);
            return productData.category;
        });


        const newCategories = selectedCategories.filter(
            (category) => category && !categories.includes(category)
        );

        if (newCategories.length > 0) {
            const updatedCategories = [...newCategories];
            localStorage.setItem("categories", JSON.stringify(updatedCategories));
        }
    }, [selectedProduct, listProducts]);

    // Wrapper para setSelectedProduct
    const updateSelectedProduct = (newSelectedProduct, new_stock = []) => {
        setSelectedProduct(newSelectedProduct);
        localStorage.setItem("selected_product", JSON.stringify(newSelectedProduct));

        if (new_stock) {
            const list_stock = JSON.parse(localStorage.getItem("list_stock")) || [];

            const if_exists_stock = list_stock.find((item) => item[1] === new_stock[1]);
            const if_exists_product = newSelectedProduct.find((item) => item[1] === new_stock[1]);

            const index = list_stock.findIndex((item) => item[1] === new_stock[1]);

            if (if_exists_stock) {
                if (!if_exists_product) {
                    list_stock.splice(index, 1);
                } else {
                    list_stock[index][0] = new_stock[0];
                };
            } else {
                if (if_exists_product) {
                    list_stock.push(new_stock);
                };
            };
            localStorage.setItem("list_stock", JSON.stringify(list_stock));
        };
    };

    // Adicionar obsevação a item
    const obsProduct = useCallback((product_id, value) => {
        const index_selected_product = selectedProduct.findIndex((item) => item[1] === product_id);
        if (index_selected_product !== -1) {
            const updatedProduct = [...selectedProduct];
            updatedProduct[index_selected_product][3] = value;

            updateSelectedProduct(updatedProduct);
        };
    }, [selectedProduct]);

    // Editando quantidade de cada item
    const alterQnt = useCallback((product_id, stock, action) => {
        const index = selectedProduct.findIndex((item) => item[1] === product_id);

        if (index !== -1) {
            const qnt = selectedProduct[index][2];

            if (action === "+") {

                if (qnt >= stock) {
                    return toast("Estoque insuficiente.", { icon: "😢" });
                } else {
                    selectedProduct[index][2] = qnt + 1;
                    const updatedStock = [stock - (qnt + 1), product_id];
                    return updateSelectedProduct([...selectedProduct], updatedStock);
                };

            } else if (action === "-" && qnt >= 1) {

                if (qnt === 1) {
                    const remove_product = selectedProduct.filter((item) => item[1] !== product_id);
                    return updateSelectedProduct(remove_product, [stock, product_id]);
                } else {
                    selectedProduct[index][2] = qnt - 1;
                    const updatedStock = [stock - (qnt - 1), product_id];
                    setSelectedProduct([...selectedProduct]);
                    return updateSelectedProduct([...selectedProduct], updatedStock);
                };

            };

        } else if (action === "+") {
            const product = listProducts.find((item) => item.product_id === product_id);

            if (product) {

                if (stock > 0) {
                    const newProduct = [...selectedProduct, [id, product_id, 1, null]];
                    const updatedStock = [(stock - 1), product_id];
                    return updateSelectedProduct(newProduct, updatedStock);
                } else {
                    return toast.error("Estoque insuficiente.");
                };

            } else {
                return toast.error("Produto não encontrado.");
            };
        };

        return updateSelectedProduct([...selectedProduct], [stock, product_id]);
    },
        [listProducts, selectedProduct]
    );

    const navigateToCart = () => {
        handleCategories();
        navigate(`/${id}/cart`);
    };

    const itensFiltrados = listProducts.filter(item =>
        item.product_name.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <>
            <Navbar title="Menu" url />

            <div className="w-[95%] min-h-[85vh] pb-[200px] px-3 rounded-xl flex items-center flex-col gap-10">
                <Toaster />
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

                {itensFiltrados.map((item, index) => (
                    <div key={index} className={`flex flex-col py-4 px-6 w-full rounded-xl bg-slate-100/50 shadow-md border`}>
                        <div className="flex items-center justify-between gap-1">
                            {item.image && (
                                <div className="h-[120px] w-[120px] rounded-md bg-slate-300"
                                    style={{
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}>
                                    <div className={`
                                    ${selectedProduct.findIndex(product => product[1] === item.product_id) === -1 && "hidden"}
                                    w-[30px] h-[30px] flex justify-center items-center bg-green-500 rounded-full relative -top-3 -left-3 z-10`}>
                                        <h6 className="text-white"><CheckProduct /></h6>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col items-center justify-between gap-2">
                                <h3 className="text-slate-900 text-[25px] font-bold">{item.product_name}</h3>
                                <p className="text-slate-500 text-[15px] font-semibold">{item.description}</p>
                                <h3 className="text-slate-500 text-[30px] font-semibold">R$ {item.price.toFixed(2).replace(".", ",")}</h3>
                            </div>
                        </div>

                        <div className="flex justify-between gap-2 mt-5">
                            <label className="w-full">
                                {selectedProduct.find(product => product[1] === item.product_id)?.[2] && (
                                    <textarea
                                        placeholder="Observação"
                                        className="w-full mt-1 border border-slate-500 rounded-[5px] p-1"
                                        onChange={(e) => obsProduct(item.product_id, e.target.value)}
                                        value={selectedProduct.find(product => product[1] === item.product_id)?.[3] || ""}
                                        disabled={selectedProduct.findIndex(product => product[1] === item.product_id) === -1}
                                    />
                                )}
                            </label>

                            <div className="w-[150px] flex self-end justify-center items-center gap-3 border-2 border-slate-500 rounded-md my-5">
                                <button className="py-1 px-5 border-r-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(item.product_id, item.stock, "+")}
                                ><Plus /></button>

                                <p className="text-[#EB8F00] font-somibold">
                                    {selectedProduct.find(product => product[1] === item.product_id)?.[2] || 0}
                                </p>

                                <button className="py-1 px-5 border-l-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => alterQnt(item.product_id, item.stock, "-")}
                                ><Minus /></button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="fixed bottom-0 right-0 p-5 flex justify-center items-center">
                    <div className="flex gap-3 z-50 relative">
                        {selectedProduct.length > 0 && (
                            <div className="w-[21px] h-[21px] flex justify-center items-center bg-white rounded-full absolute -top-1 -left-1 z-10">
                                <h5 className="text-black">{selectedProduct.length}</h5>
                            </div>
                        )}

                        <button className={`
                        ${selectedProduct.length === 0 && "hidden"} w-[50px] h-[50px] p-3 rounded-[100%] text-white font-semibold 
                        bg-[#171821] hover:text-[#171821] border-2 border-transparent hover:border-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75`}
                            onClick={() => { navigateToCart(); setToggleView(false) }}
                            disabled={selectedProduct.length === 0}
                        ><Cart /></button>
                    </div>
                </div>
            </div>
        </>
    );
};
