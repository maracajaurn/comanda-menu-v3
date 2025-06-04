import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Cart } from "../../libs/icons";

import { Navbar, LoadingItem, CardProduct, Filter } from "../../components";

import { ProductService } from "../../service/product/ProductService";

import { useToggleView, useLoader } from "../../contexts"
import { useDebounce } from "../../hooks/UseDebounce";
import { useVerifyIfClientId } from "../../hooks/UseVerifyIfClientId";
import { useFCM } from "../../hooks/UseFCM";

export const Menu = () => {
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const { setToggleView } = useToggleView();
    const { debounce } = useDebounce(500);

    const { id } = useParams();
    const { verifyIfClientId } = useVerifyIfClientId(id);
    useFCM(id);

    // listagem de produtos do db
    const [listProducts, setListProducts] = useState([]);

    // Estado que armazena o termo de filtro digitado
    const [filter, setFilter] = useState("");

    // Produto selecionado
    const [selectedProduct, setSelectedProduct] = useState([]);

    const [loadingHasMore, setLoadingHasMore] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isFetching = useRef(false);

    useEffect(() => {
        verifyIfClientId();

        setLoading(false);
        const get_func = localStorage.getItem("func");
        const if_check_id = localStorage.getItem("check_id");
        const if_selected_product = localStorage.getItem("selected_product");

        localStorage.removeItem("screens");

        if (if_selected_product) {
            setSelectedProduct(JSON.parse(if_selected_product));
        };

        if (get_func !== "admin" && !if_check_id) {
            navigate(-1);
        };

        setToggleView(false);
        getAllProducts();
    }, []);

    useEffect(() => {
        if (filter.length > 0) {
            debounce(() => {
                ProductService.getByName(filter)
                    .then((result) => {
                        setListProducts(result);
                        setHasMore(false);
                    })
                    .catch((error) => {
                        return toast.error(error.message);
                    });
            });
        } else {
            setPage(1);
            getAllProducts();
            setHasMore(true);
        };
    }, [filter]);

    const getAllProducts = useCallback(() => {
        if (isFetching.current) return;
        isFetching.current = true;

        setLoadingHasMore(true);
        ProductService.getByPagenated(5, page)
            .then((result) => {
                if (result.length > 0) {
                    mapProducts(result);
                    setPage(prev => prev + 1);
                    setLoadingHasMore(false);
                    return
                };

                if (result?.status === false) {
                    setLoadingHasMore(false);
                    return toast.error(result.message);
                };

                setLoadingHasMore(false);
                setHasMore(false);
                return
            })
            .catch((error) => {
                return toast.error(error.message);
            })
            .finally(() => {
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
            if (!item.image) return item;

            const blob = new Blob([new Uint8Array(item.image?.data)], { type: 'image/webp' });
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
                setListProducts([...listProducts, ...products]);
            })
            .catch((error) => {
                toast.error(error.message);
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

    return (
        <>
            <Navbar title="Bar Areia Vermelha" />
            <div className="w-[95%] min-h-[85vh] pb-[200px] px-3 rounded-xl flex items-center flex-col gap-10">

                <Filter filter={filter} setFilter={setFilter} />

                <CardProduct
                    listProducts={listProducts}
                    selectedProduct={selectedProduct}
                    obsProduct={obsProduct}
                    alterQnt={alterQnt}
                />

                {loadingHasMore && <LoadingItem />}

                <div className="cart fixed bottom-0 right-0 p-5 flex justify-center items-center animate-bounce">
                    <div className="flex gap-3 z-50 relative">
                        {selectedProduct.length > 0 && (
                            <div className="w-[21px] h-[21px] flex justify-center items-center bg-white rounded-full absolute border-2 shadow-2xl -top-1 -left-1 z-10">
                                <h5 className="text-black">{selectedProduct.length}</h5>
                            </div>
                        )}

                        <button className={`
                            ${selectedProduct.length === 0 && "hidden"} w-[50px] h-[50px] p-3 rounded-[100%] text-white font-semibold 
                            bg-[#171821] hover:text-[#171821] hover:bg-[#EB8F00] transition-all delay-75`}
                            onClick={() => { navigate(`/${id}/cart`); setToggleView(false) }}
                            disabled={selectedProduct.length === 0}
                        ><Cart /></button>
                    </div>
                </div>
            </div>
        </>
    );
};
