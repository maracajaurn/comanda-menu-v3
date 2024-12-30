import { useState, useEffect, useCallback } from "react";

import { Navbar } from "../../components/navbar";
import { ProductService } from "../../service/product/ProductService";
import { Plus, Delete, Minus, Close } from "../../libs/icons";
import toast, { Toaster } from "react-hot-toast";

export const ClientMenu = () => {

    const [listProducts, setListProducts] = useState([]);

    // Estado que armazena o termo de filtro digitado
    const [filtro, setFiltro] = useState("");

    // reunindo produtos em uma lista para comanda
    const [addProductsTiket, setAddProductsTiket] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        getAllProducts();
    }, []);

    const getAllProducts = useCallback(async () => {
        try {
            await ProductService.getAll()
                .then((result) => { setListProducts(result.data) });
        } catch (error) {
            return
        };
    }, []);

    // adicionar produtos
    const addProduct = (_id) => {
        listProducts.forEach(item => {
            if (item._id === _id) {

                if (addProductsTiket.findIndex(product => product._id === _id) !== -1) {
                    return toast("Esse item já foi adicionado", { icon: "🤨", duration: 1200 });
                };

                const newList = [item, ...addProductsTiket];

                setAddProductsTiket(newList);

                return toast("Adicionado", { icon: "😉", duration: 1200 });
            };
        });
    };

    //remover item da lista
    const removeProduct = (_id) => {

        const exists = addProductsTiket.some(product => product._id === _id);
        if (!exists) {
            return toast("Esse item nem foi adicionado", { icon: "🤨", duration: 1500 });
        };

        const newList = addProductsTiket.filter(product => product._id !== _id);

        setAddProductsTiket(newList);

        return toast("Removido", { icon: "🙄", duration: 1200 });
    };

    // Adicionar obsevação a item
    const obsProduct = (_id, value) => {

        // Primeiro adiciona o produto na lista e dps faz a observação
        const newList = [...addProductsTiket];
        const objEditedIndex = newList.findIndex(product => product._id === _id);

        // verificando se existe um produto para manipular
        if (objEditedIndex !== -1) {
            let objCloned = { ...newList[objEditedIndex] };
            objCloned.obs = value;
            newList[objEditedIndex] = objCloned;
            setAddProductsTiket(newList);
            return;
        } else {
            return toast.error("Primeiro + adicione o produto!", { duration: 1000 });
        };
    };

    // Editando quantidade de cada item
    const alterQnt = async (_id, action) => {

        const newList = [...addProductsTiket];
        const objEditedIndex = newList.findIndex(product => product._id === _id);

        // verificando se existe um produto para manipular
        if (objEditedIndex !== -1) {

            let objCloned = { ...newList[objEditedIndex] };

            if (action === "+") {
                objCloned.qnt += 1;
                toast(`${objCloned.qnt}`, { icon: "😎", duration: 1200 });
            } else if (action === "-" && objCloned.qnt >= 1) {
                objCloned.qnt -= 1;
                toast(`${objCloned.qnt}`, { icon: "😒", duration: 1200 });
            };

            objCloned.totalPrice = objCloned.qnt * objCloned.value;
            const indexObjEdited = newList.findIndex(index => index._id === _id);
            newList[indexObjEdited] = objCloned;

            setAddProductsTiket(newList);
        } else {
            addProduct(_id);
        };
    };

    const itensFiltrados = listProducts.filter(item =>
        item.nameProduct.toLowerCase().includes(filtro.toLowerCase())
    );

    // Pagination calculations
    const totalItems = itensFiltrados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = itensFiltrados.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <Navbar title={"Cardápio"} />
            <Toaster />
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
                    <div key={index} className={`
                    ${addProductsTiket.findIndex(product => product._id === item._id) !== -1 ? "bg-[#EB8F00]/10" : ""}
                    flex flex-col justify-center items-center py-2 w-full rounded-xl shadow-md`}>

                        <div className="flex-col">
                            <h3 className="text-slate-900 font-bold">{item.nameProduct}</h3>
                            <h3 className="text-slate-500 text-[15px] font-semibold">R$ {item.value.toFixed(2).replace(".", ",")}</h3>
                            {addProductsTiket.findIndex(product => product._id === item._id) !== -1 && (
                                <label >
                                    <input
                                        type="text" placeholder="Observação"
                                        className="mt-1 border border-slate-500 rounded-[5px] p-1"
                                        onChange={(e) => obsProduct(item._id, e.target.value)}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-3 border-t-2 pt-3">
                            <div className="flex items-center gap-1 p-1 border-2 border-slate-500 rounded-md">
                                <button className={`
                                p-1 border-r-2 border-slate-500 text-slate-900 hover:text-red-600 transition-all delay-75`}
                                    onClick={() => alterQnt(item._id, "-")}
                                    disabled={addProductsTiket.findIndex(product => product._id === item._id) !== -1 ? false : true}
                                ><Minus /></button>

                                <p className="text-[#EB8F00] font-somibold">
                                    {addProductsTiket.find(product => product._id === item._id)?.qnt || 0}
                                </p>

                                <button className="p-1 border-l-2 border-slate-500 text-slate-900 hover:text-green-500 transition-all delay-75"
                                    onClick={() => alterQnt(item._id, "+")}
                                ><Plus /></button>
                            </div>
                            <button className="text-[#1C1D26] p-2 rounded-md border-2 hover:text-red-600 hover:border-red-600 transition-all delay-75"
                                onClick={() => removeProduct(item._id)}
                            ><Delete /></button>
                        </div>
                    </div>
                ))}

                {totalPages > 1 && (
                    <div className="flex items-center gap-3 mt-5">
                        <button
                            className="font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >Anterior
                        </button>

                        <span>{currentPage} de {totalPages}</span>

                        <button
                            className="font-semibold text-white py-2 px-5 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
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