import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar } from "../../components";
import { Delete } from "../../libs/icons";

import { useLoader } from "../../contexts";
import { useVerifyIfClientId } from "../../hooks/UseVerifyIfClientId";
import { useFCM } from "../../hooks/UseFCM";

import { CheckService } from "../../service/check/CheckService";
import { ProductService } from "../../service/product/ProductService";
import { PaymentService } from "../../service/payment/PaymentService";

export const Cart = () => {
    const { setLoading } = useLoader();
    const navidate = useNavigate();

    const { id } = useParams();

    const { verifyIfClientId } = useVerifyIfClientId(id);
    useFCM(id, true);

    const [products, setProducts] = useState([]);
    const [productsSelected, setProductsSelected] = useState([]);
    const [productsInCart, setProductsInCart] = useState([]);
    const [total_value, setTotalValue] = useState(0);
    const [client, setClient] = useState("");
    const [email, setEmail] = useState("");

    const getProducts = useCallback(() => {
        ProductService.getAll()
            .then(result => {
                if (result.length > 0) {
                    setProducts(result);
                    return setLoading(false);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, []);

    const getCheck = useCallback(() => {
        CheckService.getById(id)
            .then(result => {
                if (result.length > 0) {
                    setClient(result[0].name_client);
                    localStorage.setItem("client", result[0].name_client);
                    return;
                };

                return toast.error(result.message);
            })
            .catch(error => {
                return toast.error(error.message);
            });
    }, []);

    const removeProduct = (product_id) => {
        const newProductsSelected = productsSelected.filter((product) => product[1] !== product_id);
        setProductsSelected(newProductsSelected);

        const newProductsInCart = productsInCart.filter((product) => product.product_id !== product_id);
        setProductsInCart(newProductsInCart);

        const newTotalValue = total_value - (products.find((product) => product.product_id === product_id).price * productsSelected.find((selected) => selected[1] === product_id)[2]);
        setTotalValue(newTotalValue);

        localStorage.setItem("selected_product", JSON.stringify(newProductsSelected));
        localStorage.setItem("total_value", newTotalValue.toFixed(2));
    };

    useEffect(() => {
        verifyIfClientId();

        setLoading(true);
        const selectedProducts = localStorage.getItem("selected_product");
        if (selectedProducts) {
            setProductsSelected(JSON.parse(selectedProducts));
        };

        getCheck();
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        if (products.length > 0 && productsSelected.length > 0) {
            const filteredProducts = products.filter((product) =>
                productsSelected.some(selected => selected[1] === product.product_id)
            );

            let total_value = 0;
            //let screens = [];

            const productsInCart = filteredProducts.map((product) => {
                const selectedProduct = productsSelected.find((selected) => selected[1] === product.product_id);

                const totalPrice = product.price * selectedProduct[2];

                total_value += totalPrice;

                /* if (!screens.includes(product.screen)) {
                    screens.push(product.screen);
                }; */

                return {
                    product_id: product.product_id,
                    product_name: product.product_name,
                    price: product.price * selectedProduct[2],
                    quantity: selectedProduct[2],
                    obs: selectedProduct[3]
                };
            });

            //localStorage.setItem("screens", JSON.stringify(screens));
            localStorage.setItem("total_value", total_value.toFixed(2));

            setTotalValue(total_value);

            setProductsInCart(productsInCart);
        };
    }, [products, productsSelected]);

    const payment = useCallback(() => {
        setLoading(true);
        const paymentData = {
            transaction_amount: total_value,
            description: `Tô pagando minha comanda - ${client}`,
            payment_method_id: 'pix',
            payer: {
                email: email,
                first_name: client
            },
        };

        PaymentService.createPayment(paymentData)
            .then((result) => {
                if (result) {
                    navidate(`/${id}/to-pay?payment_id=${result.id}`)
                    return
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [total_value, client, email]);

    return (
        <>
            <Navbar title="Meu carrinho" url />
            <div className="flex flex-col items-center gap-10 pb-[100px]">

                <div className="px-10 py-14 shadow-xl bg-[#D39825]/10">

                    <h1 className="text-center text-slate-900 font-bold text-[32px]">{client}</h1>

                    <table className="max-w-1/2 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                        <thead>
                            <tr className="flex justify-between items-center gap-2">
                                <th>Und.</th>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th><Delete /></th>
                            </tr>
                        </thead>

                        {productsInCart.map((product, index) => (
                            <tbody key={index}>
                                <tr className="flex justify-between text-slate-700 font-semibold gap-3 py-1">
                                    <td className="flex justify-between gap-2 w-[15px]">
                                        <span className="text-[#EB8F00]">{product.quantity}x</span>
                                    </td>
                                    <td>{product.product_name}</td>
                                    <td className="flex gap-5 font-bold text-slate-500">
                                        R$ {product.price.toFixed(2).replace(".", ",")}
                                        <span className="text-red-500 cursor-pointer p-1"
                                            onClick={() => removeProduct(product.product_id)}><Delete />
                                        </span>
                                    </td>
                                </tr>
                                {product.obs && (
                                    <tr>
                                        <td className="text-[#EB8F00]">OBS: <span className="text-slate-500">{product.obs}</span></td>
                                    </tr>
                                )}
                            </tbody>
                        ))}
                    </table>

                    <h2 className="mt-5 text-center text-slate-900 font-bold text-[28px]">
                        Total: <span className="text-slate-500">R$ {parseFloat(total_value).toFixed(2).replace(".", ",")}</span>
                    </h2>
                </div>

                <div>
                    <label>
                        <input
                            type="email" placeholder="Digite seu e-mail"
                            className="w-[250px] focus:border-slate-800 border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email} required
                        />
                    </label>
                </div>

                <div className="fixed bottom-0 w-full flex flex-col justify-between items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                    <button className={
                        `${email !== "" ? "bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] hover:border-[#1C1D26]" : "bg-[#1C1D26]/50"}
                        w-2/3 px-1 py-2 text-[20px] font-bold rounded-xl border-2 border-transparent  transition-all delay-75`}
                        type="submit"
                        disabled={productsInCart.length === 0 || email === ""}
                        onClick={() => payment()}
                    >Pagar</button>
                </div>
            </div>
        </>
    );
};
