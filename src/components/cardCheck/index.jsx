
import { Plus } from "../../libs/icons";

export const CardCheck = ({ item, navigate }) => {
    return (
        <div className="flex justify-between items-center px-5 py-3 w-full rounded-xl bg-slate-100/50 shadow-md"
            key={item.check_id}>

            <div className="flex flex-col">
                <h3 className="text-slate-900 font-bold">{item.name_client}</h3>
                <h3 className="text-slate-400 font-semibold">{item.obs}</h3>
                <h4 className="text-slate-500 text-[15px] font-semibold">
                    <span className="font-bold text-[#EB8F00]">Total:</span> R$ {item.total_value ? item.total_value.toFixed(2).replace(".", ",") : "0,00"}</h4>
                <p>{item.status ? "" : "Encerrada"}</p>
            </div>

            <button className="p-2 rounded-md bg-[#1C1D26] text-white hover:bg-[#EB8F00] transition-all delay-75"
                onClick={() => navigate(`/garcom/comanda/${item.check_id}`)}
            ><Plus /></button>
        </div>
    );
};