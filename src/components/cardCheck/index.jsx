import { useToggleView } from "../../contexts";

import { Plus } from "../../libs/icons";

export const CardCheck = ({ listCheck = [], navigate, user_id }) => {

    const { setToggleView } = useToggleView();

    return (
        <>
            {listCheck.length > 0 ? listCheck.map((item) => (
                <div className="w-full sm:w-[280px] md:w-[350px] xl:w-[550px] flex justify-between items-center gap-10 px-5 py-3 rounded-xl bg-slate-100/50 shadow-md"
                    key={item.check_id}>

                    <div className="flex flex-col">
                        <h3 className="text-slate-900 font-bold">{item.name_client}</h3>
                        <h3 className="text-slate-400 font-semibold">{item.obs}</h3>
                        <h4 className="text-slate-500 text-[15px] font-semibold">
                            <span className="font-bold text-[#EB8F00]">Total:</span> R$ {item.total_value ? item.total_value.toFixed(2).replace(".", ",") : "0,00"}</h4>
                        <p>{item.status ? "" : "Encerrada"}</p>
                    </div>

                    <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                        onClick={() => navigate(`/${user_id}/garcom/comanda/${item.check_id}`)}
                    ><Plus /></button>
                </div>
            )) : (
                <div className="border flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                    <div className="flex flex-col">
                        <h3 className="text-slate-900 font-bold">Você não possui comandas em aberto</h3>
                        <h3 className="text-slate-400 font-semibold">Clique em + Nova comanda</h3>
                        <h4 className="text-slate-500 text-[15px] font-semibold">
                            <span className="font-bold text-[#EB8F00]">Total:</span> R$ 0,00</h4>
                    </div>

                    <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                        onClick={() => setToggleView(true)}
                    ><Plus /></button>
                </div>
            )}
        </>
    );
};