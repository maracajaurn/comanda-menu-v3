import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Cart } from "../../libs/icons";

import { Navbar, CardProduct, Filter } from "../../components";

import { ProductService } from "../../service/product/ProductService";
import { SettingService } from "../../service/setting/SettingService";

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
    useFCM(id, true);

    const [setting, setSetting] = useState({ estabishment_name: "" });
    const [listProducts, setListProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [loadingHasMore, setLoadingHasMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const isFetching = useRef(false);
    const pageRef = useRef(1);

    useEffect(() => {
        verifyIfClientId();
        setLoading(false);
        localStorage.removeItem("screens");

        const stored = localStorage.getItem("selected_product");
        if (stored) setSelectedProduct(JSON.parse(stored));

        setToggleView(false);
        getAllProducts();
        getSetting();
    }, []);

    useEffect(() => {
        if (filter.length > 0) {
            debounce(() => {
                ProductService.getByName(filter)
                    .then(result => {
                        mapProducts(result, true);
                        setHasMore(false);
                    })
                    .catch(error => toast.error(error.message));
            });
        } else {
            pageRef.current = 1;
            setListProducts([]);
            getAllProducts();
            setHasMore(true);
        };
    }, [filter]);

    const getAllProducts = useCallback(() => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoadingHasMore(true);

        ProductService.getByPagenated(5, pageRef.current)
            .then(result => {
                if (result?.length > 0) {
                    mapProducts(result);
                    pageRef.current += 1;
                } else {
                    if (result?.status === false) toast.error(result.message);
                    setHasMore(false);
                }
            })
            .catch(error => toast.error(error.message))
            .finally(() => {
                isFetching.current = false;
                setLoadingHasMore(false);
            });
    }, []);

    const getSetting = useCallback(() => {
        SettingService.get()
            .then(result => {
                if (result[0]) setSetting(result[0]);
                else if (result?.status === false) toast.error(result.message);
            })
            .catch(error => toast.error(error.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                debounce(() => {
                    if (hasMore) getAllProducts();
                });
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [getAllProducts, hasMore]);

    const mapProducts = async (list, filter = false) => {
        try {
            const mapped = await Promise.all(
                list.map(async item => {
                    if (!item.image) return item;
                    const blob = new Blob([new Uint8Array(item.image.data)], { type: 'image/webp' });
                    const base64Image = await blobToBase64(blob);
                    return {
                        product_id: item.product_id,
                        product_name: item.product_name,
                        price: item.price,
                        category_id: item.category_id,
                        category: item.name_category,
                        description: item.description,
                        stock: item.stock,
                        image: base64Image,
                    };
                })
            );

            if (filter) setListProducts(mapped);
            else setListProducts(prev => [...prev, ...mapped]);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject('Erro ao ler o Blob: ' + error);
            reader.readAsDataURL(blob);
        });
    };

    const updateSelectedProduct = (newSelectedProduct, new_stock = []) => {
        setSelectedProduct(newSelectedProduct);
        localStorage.setItem("selected_product", JSON.stringify(newSelectedProduct));

        if (new_stock) {
            const list_stock = JSON.parse(localStorage.getItem("list_stock")) || [];
            const index = list_stock.findIndex((item) => item[1] === new_stock[1]);
            const existsProduct = newSelectedProduct.find((item) => item[1] === new_stock[1]);

            if (index !== -1) {
                if (!existsProduct) list_stock.splice(index, 1);
                else list_stock[index][0] = new_stock[0];
            } else if (existsProduct) {
                list_stock.push(new_stock);
            }

            localStorage.setItem("list_stock", JSON.stringify(list_stock));
        }
    };

    const obsProduct = useCallback((product_id, value) => {
        const index = selectedProduct.findIndex((item) => item[1] === product_id);
        if (index !== -1) {
            const updated = [...selectedProduct];
            updated[index] = [...updated[index]];
            updated[index][3] = value;
            updateSelectedProduct(updated);
        }
    }, [selectedProduct]);

    const alterQnt = useCallback((product_id, stock, action) => {
        const index = selectedProduct.findIndex((item) => item[1] === product_id);

        if (index !== -1) {
            const updated = [...selectedProduct];
            updated[index] = [...updated[index]];
            const qnt = updated[index][2];

            if (action === "+") {
                if (qnt >= stock) return toast("Estoque insuficiente.", { icon: "😢" });
                updated[index][2] = qnt + 1;
                return updateSelectedProduct(updated, [stock - (qnt + 1), product_id]);
            }

            if (action === "-" && qnt >= 1) {
                if (qnt === 1) {
                    const filtered = updated.filter((item) => item[1] !== product_id);
                    return updateSelectedProduct(filtered, [stock, product_id]);
                }
                updated[index][2] = qnt - 1;
                return updateSelectedProduct(updated, [stock - (qnt - 1), product_id]);
            }
        } else if (action === "+") {
            const product = listProducts.find((item) => item.product_id === product_id);
            if (product && stock > 0) {
                const newProduct = [...selectedProduct, [id, product_id, 1, null]];
                return updateSelectedProduct(newProduct, [stock - 1, product_id]);
            }
            return toast.error("Estoque insuficiente ou produto não encontrado.");
        }

        return updateSelectedProduct([...selectedProduct], [stock, product_id]);
    }, [listProducts, selectedProduct]);

    return (
        <>
            <Navbar title={setting.estabishment_name} />

            <main className="w-[95%] min-h-[85vh] pb-[160px] px-3 rounded-xl flex flex-col gap-10 mx-auto">
                <Filter filter={filter} setFilter={setFilter} />

                <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 w-full">
                    <CardProduct
                        listProducts={listProducts}
                        selectedProduct={selectedProduct}
                        obsProduct={obsProduct}
                        alterQnt={alterQnt}
                    />
                </section>

                {selectedProduct.length > 0 && (
                    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                        <button
                            className="relative w-16 h-16 bg-[#171821] hover:bg-[#EB8F00] text-white hover:text-black rounded-full shadow-xl flex items-center justify-center transition-all"
                            onClick={() => {
                                navigate(`/${id}/cart`);
                                setToggleView(false);
                            }}
                        >
                            <Cart />
                            <span className="absolute -top-2 -left-2 w-6 h-6 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center border shadow">
                                {selectedProduct.length}
                            </span>
                        </button>
                    </div>
                )}
            </main>
        </>
    );
};
