import { useEffect, useCallback, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Navbar } from "../../components";
import { QRCode } from "../../libs/icons";

import { useLoader } from "../../contexts";
import { useVerifyIfClientId } from "../../hooks/UseVerifyIfClientId";
import { useFCM } from "../../hooks/UseFCM";

import { PaymentService } from "../../service/payment/PaymentService";

export const ToPay = () => {
    const { setLoading } = useLoader();
    const navigate = useNavigate();
    const inputRef = useRef();

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const payment_id = searchParams.get("payment_id");

    const { verifyIfClientId } = useVerifyIfClientId(id);
    useFCM(id, true);

    const [pix, setPix] = useState({
        qr_code: "",
        qr_code_base64: "",
    });

    const handleCopy = () => {
        inputRef.current.select();
        document.execCommand("copy");
        toast.success("Pix copiado!");
    };

    useEffect(() => {
        verifyIfClientId();
        
        const interval = setInterval(() => {
            getStatusPayment();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusPayment = useCallback(() => {
        PaymentService.getPaymentStatus(payment_id)
            .then((result) => {
                if (result.status === "approved") {
                    toast.success("Pagamento aprovado.");
                    navigate(`/${id}/payment_approved?payment_id=${payment_id}`);
                    return;
                } else if (result.status === "rejected" || result.status === "cancelled") {
                    toast.error("O pagamento foi recusado ou cancelado.");
                    navigate(`/${id}/payment_failure`);
                    return;
                } else if (result.status === "pending") {
                    if (!pix.qr_code_base64 && !pix.qr_code) {
                        setPix({
                            qr_code: result?.point_of_interaction?.transaction_data?.qr_code,
                            qr_code_base64: result?.point_of_interaction?.transaction_data?.qr_code_base64,
                        })
                    };
                    setLoading(false);
                    return;
                };
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
            });
    }, [payment_id]);

    return (
        <>
            <Navbar title="Pagar" url />
            <div className="w-[350px] flex flex-col px-5 items-center gap-14">
                <div className="flex flex-col gap-2 items-center">
                    <h2 className="text-3xl font-bold">
                        Perfeito 😍
                    </h2>
                    <p className="text-lg text-center">
                        Faça o pagamento para se deliciar com seus pedidos.
                    </p>
                </div>

                {pix.qr_code_base64 ? (
                    <img
                        src={`data:image/png;base64,${pix.qr_code_base64}`}
                        alt="QR Code Pix"
                    />
                ) : (
                    <QRCode size={7} />
                )}
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={pix.qr_code}
                        readOnly
                        className="border p-2 w-full"
                    />
                    <button onClick={handleCopy} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Copiar
                    </button>
                </div>

                <div className="text-center">
                    <p>Aponte seu celular ou copie a chave PIX acima para realizar o pagamento.</p>
                </div>
            </div>
        </>
    );
};