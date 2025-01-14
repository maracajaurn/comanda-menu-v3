import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components/navbar";
import { CheckProduct } from "../../libs/icons";

import { useLoader } from "../../contexts";

import { OrderService } from "../../service/order/OrderService";
import socket from "../../service/socket";

export const Proof = () => {

    const { setLoading } = useLoader();

    const navigate = useNavigate();
    const { id } = useParams();

    const [products, setProducts] = useState(null);

    useEffect(() => {
        localStorage.getItem("selected_product");

        setProducts(JSON.parse(localStorage.getItem("selected_product")));
    }, []);

    useEffect(() => {
        if (products) {
            createOrder();
        };
    }, [products]);

    const createOrder = useCallback(async () => {
        setLoading(true);

        const objSocket = {
            client: localStorage.getItem("client"),
            categories: JSON.parse(localStorage.getItem("categories")),
        };

        if (objSocket.categories.length === 0) {
            return
        };

        OrderService.create_order({ list_order: products, check_id: id })
            .then((result) => {

                if (result.status) {
                    localStorage.removeItem("selected_product");
                    socket.emit("new_order", objSocket);
                    setLoading(false);
                    return toast.success(result.message)
                };

                setLoading(false);
                return toast.error(result.message);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [products]);

    return (
        <>
            <Navbar title="Comprovante" />
            <div className="w-full flex flex-col px-5 items-center gap-14">
                <Toaster />
                <div className="px-10 pt-5 pb-14 gap-5 flex flex-col justify-center shadow-xl shadow-slate-400 bg-[#D39825]/10">
                    <div>
                        <div className=" flex justify-center">
                            <p className="h-[50px] w-[50px] rounded-full text-white bg-green-500"><CheckProduct size={15} /></p>
                        </div>
                        <h1 className="text-center text-slate-900 font-bold text-[30px]">
                            Pagamento realizado com sucesso!
                        </h1>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p className="text-center text-[1.3em]">
                            Logo logo seu pedido estará pronto! <span className="text-[1.5em]">😉</span>
                        </p>
                        <p className="text-center">*Caso querira tirar alguma dúvida, comunique com nossos atendentes.</p>
                    </div>
                </div>

                <div>
                    <button
                        className="
                            bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] hover:border-[#1C1D26] text-white
                            p-2 text-[20px] font-bold rounded-xl border-2 border-transparent  transition-all delay-75"
                        onClick={() => navigate(`/${id}/wait_for_product`)}
                    >Aguardar preparo</button>
                </div>
            </div>

            <footer className="fixed bottom-0 w-full h-[130px] flex items-center px-5 py-3 bg-[#EB8F00] text-slate-100">
                <div className="container mx-auto text-center">
                    <p className="text-sm">Desenvolvido por <strong>Jackson Souza</strong></p>
                    <p className="text-sm">© 2025 - Todos os direitos reservados.</p>
                    <div className="flex justify-center space-x-4 mt-3">
                        <a
                            href="https://instagram.com/jackssads"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline bg-slate-900 rounded-md p-3"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://linkedin.com/in/jackssads"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline bg-slate-900 rounded-md p-3"
                        >
                            Linkedin
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};