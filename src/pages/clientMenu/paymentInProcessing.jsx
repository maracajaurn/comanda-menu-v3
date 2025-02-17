import { useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Navbar } from "../../components";
import { Wait } from "../../libs/icons";

import { useLoader } from "../../contexts";

import { PaymentService } from "../../service/payment/PaymentService";

export const PaymentInProcessing = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const { setLoading } = useLoader();
    const payment_id = searchParams.get("payment_id");

    setLoading(false);

    const getStatusPayment = useCallback(() => {
        PaymentService.getPaymentStatus(payment_id)
            .then((result) => {
                if (result.status === "approved") {
                    navigate(`/${id}/proof?payment_id=${payment_id}`);
                } else if (result.status === "rejected" || result.status === "cancelled") {
                    navigate(`/${id}/payment_failure`);
                };
            })
            .catch(() => {
                return toast.error("Ocorreu um erro ao consultar o status do pagamento.");
            });
    }, [payment_id]);

    useEffect(() => {
        const interval = setInterval(() => {
            getStatusPayment();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Navbar title="Falha com pagamento" />
            <div className="w-full flex flex-col px-5 items-center gap-14">
                <Toaster />
                <div className="px-10 pt-5 pb-14 gap-5 flex flex-col justify-center shadow-xl shadow-slate-400 bg-[#D39825]/10">
                    <div>
                        <div className=" flex justify-center">
                            <p className="h-[50px] w-[50px] rounded-full text-white bg-blue-500"><Wait size={10} /></p>
                        </div>
                        <h1 className="text-center text-slate-900 font-bold text-[30px]">
                            Pagamento pendente ...
                        </h1>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p className="text-center text-[1.3em]">
                            Aguarde enquanto nossa equipe verifica o seu pagamento. <span className="text-[1.5em]">🙏</span>
                        </p>
                        <p className="text-center">Caso tenha alguma dúvida, comunique com nossos atendentes.</p>
                    </div>
                </div>
            </div>
        </>
    );
};