import { LoadingItem } from "../loadingItem";

import { Plus, Minus, CheckProduct } from "../../libs/icons";

export const CardProduct = ({ listProducts, selectedProduct, obsProduct, alterQnt }) => {
    if (listProducts.length === 0) return <LoadingItem />;

    return listProducts.map((item) => {
        const selected = selectedProduct.find(p => p[1] === item.product_id);
        const qnt = selected?.[2] || 0;
        const obs = selected?.[3] || "";

        return (
            <div key={item.product_id} className="bg-white/90 rounded-xl border shadow p-5 flex flex-col gap-4 animate-fadeUp">

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-[180px] h-[120px] rounded-md overflow-hidden bg-slate-200">
                        {item.image ? (
                            <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-300 animate-pulse" />
                        )}

                        {selected && (
                            <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                                <CheckProduct />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-bold text-slate-800">{item.product_name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                        <h4 className="text-2xl font-semibold text-[#EB8F00]">
                            R$ <span className="text-slate-600">{item.price.toFixed(2).replace(".", ",")}</span>
                        </h4>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                    <textarea
                        placeholder="Observação"
                        className="w-full p-2 border rounded-md resize-none text-sm"
                        value={obs}
                        onChange={(e) => obsProduct(item.product_id, e.target.value)}
                        disabled={!selected}
                    />

                    <div className="flex items-center justify-between w-full md:w-[180px] bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
                        <button
                            onClick={() => alterQnt(item.product_id, item.stock, "-")}
                            className="w-1/3 flex items-center justify-center py-2 text-xl text-slate-700 hover:text-[#EB8F00] transition-all hover:scale-105"
                        >
                            <Minus />
                        </button>

                        <span className="w-1/3 text-center font-semibold text-[#EB8F00] text-lg select-none">
                            {qnt}
                        </span>

                        <button
                            onClick={() => alterQnt(item.product_id, item.stock, "+")}
                            className="w-1/3 flex items-center justify-center py-2 text-xl text-slate-700 hover:text-[#EB8F00] transition-all hover:scale-105"
                        >
                            <Plus />
                        </button>
                    </div>
                </div>
            </div>
        );
    });
};