import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useLoader } from "../../contexts";
import { useVerifyIfClientId } from "../../hooks/UseVerifyIfClientId";
import { useFCM } from "../../hooks/UseFCM";

import { Navbar } from "../../components";

import { XError } from "../../libs/icons";

export const PaymentFailure = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    useFCM(id, true);

    const { verifyIfClientId } = useVerifyIfClientId(id);

    const { setLoading } = useLoader();

    setLoading(false);

    useEffect(() => {
        verifyIfClientId();
    }, []);

    return (
        <>
            <Navbar title="Falha com pagamento" />
            <div className="w-full flex flex-col px-5 items-center gap-14">

                <div className="px-10 pt-5 pb-14 gap-5 flex flex-col justify-center shadow-xl shadow-slate-400 bg-[#D39825]/10">
                    <div>
                        <div className=" flex justify-center">
                            <p className="h-[50px] w-[50px] rounded-full text-white bg-red-500"><XError size={15} /></p>
                        </div>
                        <h1 className="text-center text-slate-900 font-bold text-[30px]">
                            Pagamento não realizado ...
                        </h1>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p className="text-center text-[1.3em]">
                            Aconteceu um problema com o seu pagamento. <span className="text-[1.5em]">😣</span>
                        </p>
                        <p className="text-center">Caso queira tirar alguma dúvida, fale com nossos atendentes.</p>
                    </div>
                </div>

                <div>
                    <button
                        className="
                        bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] hover:border-[#1C1D26] text-white
                        p-2 text-[20px] font-bold rounded-xl border-2 border-transparent  transition-all delay-75"
                        onClick={() => navigate(`/${id}/products`)}
                    >Voltar para o menu</button>
                </div>
            </div>
        </>
    );
};