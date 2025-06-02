import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar } from "../../components";
import { ModalProduct, Filter } from "../../components";

import { useToggleView, useLoader } from "../../contexts";

import { Delete, Edit } from "../../libs/icons";
import { ProductService } from "../../service/product/ProductService";

export const ShowEditProducts = () => {

    const [listProducts, setListProducts] = useState([]);
    const { toggleView, setToggleView } = useToggleView();
    const { setLoading } = useLoader();

    const [filter, setFilter] = useState("");
    const [idProduct, setIdProduct] = useState(null);
    const [action, setAction] = useState(null);

    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin") {
            return navigate("/login");
        };

        getAllProducts();
    }, [toggleView]);

    const mapProducts = (list) => {
        const mappedProducts = list.map((item) => {
            const blob = new Blob([new Uint8Array(item.image?.data)], { type: 'image/jpeg' });
            return blobToBase64(blob).then((base64Image) => ({
                product_id: item.product_id,
                product_name: item.product_name,
                price: item.price,
                name_category: item.name_category,
                description: item.description,
                stock: item.stock,
                image: item.image ? base64Image : "",
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

    const getAllProducts = useCallback(() => {
        ProductService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    mapProducts(result);
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
                return toast.error(error.message)
            });
    }, []);

    const deleteById = (product_id) => {
        setLoading(true);
        ProductService.deleteById(product_id)
            .then((result) => {
                if (result.status) {
                    setLoading(false);
                    getAllProducts();
                    return toast.success(result.message);
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message)
            });
    };

    const haldletoggleViewModal = (action, _id) => {
        setAction(action);
        setIdProduct(_id);
        setToggleView(true);
        setLoading(true);
    };

    const itensFiltrados = useMemo(() => {
        return listProducts.filter(item =>
            item.product_name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [listProducts, filter]);

    // Pagination calculations
    const totalItems = itensFiltrados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = itensFiltrados.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <Navbar title={"Meus Produtos"} url />
            <div className="w-[95%] min-h-[85vh] pt-3 pb-[190px] px-3 rounded-xl flex items-center flex-col gap-6">

                <ModalProduct action={action} id={idProduct} />
                <div className="flex flex-col-reverse justify-center gap-5 px-3 py-5 w-full rounded-xl">
                    <Filter filter={filter} setFilter={setFilter} />
                    <button className="font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => haldletoggleViewModal("new")}
                    >Novo Produto</button>
                </div>

                {currentItems.length === 0 && (
                    <div className="font-semibold text-xl">Nenhum produto foi encontrado</div>
                )}

                <div className=" w-full flex sm:flex-row flex-wrap flex-col items-center justify-center gap-5">
                    {currentItems.map((product) => (
                        <div key={product.product_id} className="w-full sm:w-[280px] md:w-[350px] xl:w-[550px] flex justify-between gap-3 bg-slate-100/50 items-center px-3 py-2 rounded-xl shadow-md">
                            <div className="w-2/3 flex gap-5 items-center">
                                {product.image && (
                                    <img src={product.image}
                                        className="w-[70px] h-[70px] object-cover rounded-xl" />
                                )}
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-slate-900 font-bold">{product.stock} - {product.product_name}</h3>
                                    <h3 className="text-slate-500 text-[15px] font-semibold">R$ {product.price.toFixed(2).replace(".", ",")}</h3>
                                    <h3 className="text-[#EB8F00] text-[15px]">{product.name_category}</h3>
                                </div>
                            </div>

                            <div className="flex gap-8 border-l-2 pl-3">
                                <button className=" text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                    onClick={() => haldletoggleViewModal("edit", product.product_id)}
                                ><Edit /></button>

                                <button className=" text-slate-900 hover:text-red-500 transition-all delay-75"
                                    onClick={() => deleteById(product.product_id)}
                                ><Delete /></button>
                            </div>
                        </div>
                    ))}
                </div>

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
