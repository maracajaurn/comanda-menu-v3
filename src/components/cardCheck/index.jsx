import { useToggleView } from "../../contexts";

import { Plus } from "../../libs/icons";

export const CardCheck = ({ listCheck = [], navigate, user_id }) => {

    const { setToggleView } = useToggleView();

    return (
        <>
            {listCheck.length > 0 ? (
                <div className="w-full flex flex-col md:flex-row md:flex-wrap gap-6">
                    {listCheck.map((item) => (
                        <div
                            className="flex justify-between items-center bg-slate-100/70 rounded-xl shadow-md px-5 py-4 w-full max-w-xl mx-auto"
                            key={item.check_id}>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-slate-900 font-bold text-lg">{item.name_client}</h3>
                                {item.obs && (
                                    <p className="text-slate-500 text-sm font-medium">{item.obs}</p>
                                )}
                                <p className="text-slate-700 text-sm">
                                    <span className="font-bold text-[#EB8F00]">Total:</span>{" "}
                                    R$ {item.total_value ? item.total_value.toFixed(2).replace(".", ",") : "0,00"}
                                </p>
                                {!item.status && (
                                    <span className="text-sm text-red-500 font-semibold">Encerrada</span>
                                )}
                            </div>

                            <button
                                className="p-3 rounded-full bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all duration-200"
                                onClick={() => navigate(`/${user_id}/garcom/comanda/${item.check_id}`)}>
                                <Plus />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-100/70 w-full max-w-xl mx-auto flex justify-between items-center gap-4 px-5 py-4 rounded-xl shadow-md">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-slate-900 font-bold text-lg">Você não possui comandas em aberto</h3>
                        <p className="text-slate-500 font-medium">Clique em + Nova comanda</p>
                        <p className="text-slate-700 text-sm">
                            <span className="font-bold text-[#EB8F00]">Total:</span> R$ 0,00
                        </p>
                    </div>

                    <button
                        className="p-3 rounded-full bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all duration-200"
                        onClick={() => setToggleView(true)}>
                        <Plus />
                    </button>
                </div>
            )}
        </>
    );
};