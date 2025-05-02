import { LoadingItem } from "../loadingItem";

import { Plus, Minus, CheckProduct } from "../../libs/icons";

export const CardProduct = ({ listProducts = [], selectedProduct = [], obsProduct, alterQnt }) => {
    return (
        <>
            {listProducts.length > 0 ? listProducts.map((item, index) =>
                <div key={index} className="card flex flex-col py-4 px-6 w-full rounded-xl bg-slate-100/50 shadow-md border">
                    <div className="w-full flex items-center justify-between gap-1">
                        {item.image ? (
                            <div className="h-[120px] w-[180px] rounded-md bg-slate-300"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}>
                                <div className={`
                                        ${selectedProduct.findIndex(product => product[1] === item.product_id) === -1 && "hidden"}
                                        w-[30px] h-[30px] flex justify-center items-center bg-green-500 rounded-full relative -top-3 -left-3`}>
                                    <h6 className="text-white"><CheckProduct /></h6>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[120px] w-[180px] rounded-md bg-slate-300 animate-pulse">
                                <div className={`
                                    ${selectedProduct.findIndex(product => product[1] === item.product_id) === -1 && "hidden"}
                                    w-[30px] h-[30px] flex justify-center items-center bg-green-500 rounded-full relative -top-3 -left-3`}>
                                    <h6 className="text-white"><CheckProduct /></h6>
                                </div>
                            </div>
                        )}

                        <div className="w-full flex flex-col items-center justify-between gap-2 text-center">
                            <h3 className="text-slate-900 text-[25px] font-bold">{item.product_name}</h3>
                            <p className="text-slate-500 text-[15px] font-semibold">{item.description}</p>
                            <h3 className="text-slate-500 text-[30px] font-semibold"><span className="text-[#EB8F00]">R$</span> {item.price.toFixed(2).replace(".", ",")}</h3>
                        </div>
                    </div>

                    <div className="flex justify-between gap-2 mt-5">
                        <label className="w-full">
                            {selectedProduct.find(product => product[1] === item.product_id)?.[2] && (
                                <textarea
                                    placeholder="Observação"
                                    className="w-full mt-1 border border-slate-500 rounded-[5px] p-1"
                                    onChange={(e) => obsProduct(item.product_id, e.target.value)}
                                    value={selectedProduct.find(product => product[1] === item.product_id)?.[3] || ""}
                                    disabled={selectedProduct.findIndex(product => product[1] === item.product_id) === -1}
                                />
                            )}
                        </label>

                        <div className="w-[150px] flex self-end justify-center items-center gap-3 border-2 border-slate-500 rounded-md my-5">
                            <button className="py-1 px-5 border-r-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => alterQnt(item.product_id, item.stock, "+")}
                            ><Plus /></button>

                            <p className="text-[#EB8F00] font-somibold">
                                {selectedProduct.find(product => product[1] === item.product_id)?.[2] || 0}
                            </p>

                            <button className="py-1 px-5 border-l-2 border-slate-500 text-slate-900 hover:text-[#EB8F00] transition-all delay-75"
                                onClick={() => alterQnt(item.product_id, item.stock, "-")}
                            ><Minus /></button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <LoadingItem />
                </>
            )}
        </>
    );
};