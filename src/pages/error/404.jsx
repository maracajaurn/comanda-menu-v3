import { useEffect } from "react";

import { useLoader } from "../../contexts";

import { Navbar } from "../../components";

import { XError } from "../../libs/icons";

export const NotFound = () => {

    const { setLoading } = useLoader();

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            <Navbar title="404" url />
            <div className="w-full flex flex-col px-5 items-center gap-14">

                <div className="px-10 pt-5 pb-14 gap-5 flex flex-col justify-center shadow-xl shadow-slate-400 bg-[#D39825]/10">
                    <div>
                        <div className=" flex justify-center">
                            <p className="h-[50px] w-[50px] rounded-full text-white bg-red-500"><XError size={15} /></p>
                        </div>
                        <h1 className="text-center text-slate-900 font-bold text-[30px]">
                            404 - Página não encontrada
                        </h1>
                    </div>

                    <div className="flex flex-col gap-5 items-center">
                        <p className="text-center text-[1.3em]">
                            Vai pra onde? Essa página nem existe.
                        </p>
                        <span className="text-[3em]">🤨</span>
                        <p className="text-center">Caso queira tirar alguma dúvida, fale com nossos atendentes.</p>
                    </div>
                </div>
            </div>
        </>
    );
};