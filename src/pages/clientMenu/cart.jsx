import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Navbar } from "../../components/navbar";

import { ProductService } from "../../service/product/ProductService";

export const Cart = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [productsSelected, setProductsSelected] = useState([]);
    const [productsInCart, setProductsInCart] = useState([]);
    const [total_value, setTotalValue] = useState(0);

    const getProducts = useCallback(async () => {
        try {
            const result = await ProductService.getAll();
            setProducts(result);
        } catch (error) {
            console.error("Error fetching products", error);
        };
    }, []);

    useEffect(() => {
        const selectedProducts = localStorage.getItem("selected_product");
        if (selectedProducts) {
            setProductsSelected(JSON.parse(selectedProducts));
        };

        getProducts();
    }, [getProducts]);

    useEffect(() => {
        if (products.length > 0 && productsSelected.length > 0) {
            const filteredProducts = products.filter((product) =>
                productsSelected.some(selected => selected[1] === product.product_id)
            );

            let total_value = 0;

            const productsInCart = filteredProducts.map((product) => {
                const selectedProduct = productsSelected.find((selected) => selected[1] === product.product_id);

                const totalPrice = product.price * selectedProduct[2];

                total_value += totalPrice;

                return {
                    product_id: product.product_id,
                    product_name: product.product_name,
                    price: product.price * selectedProduct[2],
                    quantity: selectedProduct[2],
                    obs: selectedProduct[3]
                };
            });

            localStorage.setItem("total_value", total_value.toFixed(2));

            setTotalValue(total_value);

            setProductsInCart(productsInCart);
        };
    }, [products, productsSelected]);

    return (
        <>
            <Navbar title="Meu carrinho" />
            <div className="px-10 py-14 shadow-xl bg-[#D39825]/10">
                <table className="max-w-2/3 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                    <tr className="flex justify-between items-center">
                        <th>Und.</th>
                        <th>Produto</th>
                        <th>Preço</th>
                    </tr>
                    {productsInCart.map((product, index) => (
                        <div className="">
                            <tr key={index} className="flex justify-between gap-1 text-slate-700 font-semibold">
                                <td className="flex items-center justify-between gap-2">
                                    <span className="text-[#EB8F00]">{product.quantity}x</span>
                                </td>

                                <td>
                                    <span>{product.product_name}</span>
                                </td>

                                <td>
                                    <span className="font-bold text-slate-500">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                                </td>
                            </tr>
                            {product.obs && (
                                <p className="text-[#EB8F00]">OBS: <span className="text-slate-500">{product.obs}</span></p>
                            )}
                        </div>
                    ))}
                </table>
                <h2 className="mt-5 text-center text-slate-900 font-bold text-[28px]">
                    Total: <span className="text-slate-500">R$ {parseFloat(total_value).toFixed(2).replace(".", ",")}</span>
                </h2>
            </div>
            <div className="fixed bottom-0 w-full flex flex-col justify-between items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                <button className="w-2/3 px-1 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                    onClick={() => navigate(`/${id}/payment`)}
                >Pagar</button>
            </div>
        </>
    );
};
