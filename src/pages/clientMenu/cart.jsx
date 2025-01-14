import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components/navbar";

import { useLoader } from "../../contexts";

import { CheckService } from "../../service/check/CheckService";
import { ProductService } from "../../service/product/ProductService";
import { PaymentService } from "../../service/payment/PaymentService";

export const Cart = () => {

    const { setLoading } = useLoader();

    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [productsSelected, setProductsSelected] = useState([]);
    const [productsInCart, setProductsInCart] = useState([]);
    const [total_value, setTotalValue] = useState(0);
    const [client, setClient] = useState("");
    const [email, setEmail] = useState("");

    const getProducts = useCallback(async () => {
        ProductService.getAll()
            .then(result => {
                setProducts(result);
                setLoading(false);
            })
            .catch(error => {
                toast.error(error.message);
            });
    }, []);

    const getCheck = async () => {
        CheckService.getById(id)
            .then(result => {
                setClient(result.name_client);
                localStorage.setItem("client", result.name_client);
            })
            .catch(error => {
                return toast.error(error.message);
            });
    };

    useEffect(() => {
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

    // TODO: Atualizar a URL da notificação com ngrok
    // Front e Mercado Pago
    const payment = useCallback(() => {
        setLoading(true);
        const paymentData = {
            transaction_amount: total_value,
            description: `Pagamento da comanda ${client}`,
            payer: {
                email: email || "no-email@teste.com"
            },
            back_urls: {
                success: `http://localhost:3000/${id}/proof`,
                failure: `http://localhost:3000/${id}/payment_failure`,
                pending: `http://localhost:3000/${id}/payment_failure`
            },
            items: productsInCart.map((product) => (
                {
                    title: product.product_name,
                    description: product.obs,
                    quantity: product.quantity,
                    unit_price: product.price,
                    currency: "BRL",
                }
            )),
            payment_methods: {
                default_payment_method_id: 'master',
                excluded_payment_types: [
                    {
                        id: 'ticket',
                    },
                ],
                excluded_payment_methods: [
                    {
                        id: 'credit_card',
                    },
                ],
                installments: 1,
                default_installments: 1,
            },
            notification_url: "https://5f9d-170-82-73-253.ngrok-free.app/api/webhook/payment",
            auto_return: "all",
        };

        PaymentService.createPayment(paymentData)
            .then(response => {
                if (response) {
                    setLoading(false);
                    return window.location.href = response;
                };

                setLoading(false);
                return toast.error("Erro ao processar pagamento");
            })
            .catch(error => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [total_value, client, email]);

    return (
        <>
            <Navbar title="Meu carrinho" />
            <div className="flex flex-col items-center gap-10">
                <Toaster />
                <div className="px-10 py-14 shadow-xl bg-[#D39825]/10">

                    <h1 className="text-center text-slate-900 font-bold text-[32px]">{client}</h1>

                    <table className="max-w-2/3 flex gap-5 flex-col divide-y divide-dashed divide-slate-700">
                        <thead>
                            <tr className="flex justify-between items-center">
                                <th>Und.</th>
                                <th>Produto</th>
                                <th>Preço</th>
                            </tr>
                        </thead>

                        {productsInCart.map((product, index) => (
                            <tbody key={index}>
                                <tr className="flex justify-between gap-1 text-slate-700 font-semibold">
                                    <td className="flex items-center justify-between gap-2">
                                        <span className="text-[#EB8F00]">{product.quantity}x</span>
                                    </td>
                                    <td><span>{product.product_name}</span></td>
                                    <td><span className="font-bold text-slate-500">R$ {product.price.toFixed(2).replace(".", ",")}</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        {product.obs && (
                                            <p className="text-[#EB8F00]">OBS: <span className="text-slate-500">{product.obs}</span></p>
                                        )}
                                    </td>
                                </tr>
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
