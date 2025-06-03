export const CardProductPreparation = ({ oreders = [], orderReady }) => {
    return (
        <>
            {oreders.length ? oreders.map((item) => (
                <div key={item.order_id} className="flex flex-col justify-center items-center px-3 py-5 w-full bg-slate-100/50 rounded-xl shadow-md">

                    <h3 className="font-bold">{item.name_client}</h3>

                    <div className="flex justify-between items-center w-full">

                        <div className="flex justify-between items-center w-full">
                            <div className="flex flex-col mr-1">
                                <h3 className="text-slate-900 font-semibold flex gap-1">{item.quantity}x - {item.product_name}</h3>

                                {item.obs && (
                                    <h3 className="text-slate-500 text-[15px] font-semibold">
                                        <span className="font-bold text-[#EB8F00]">OBS: </span>{item.obs}
                                    </h3>
                                )}
                            </div>

                            <div className=" flex gap-3 border-l-2 pl-3 text-white">
                                <button className="flex gap-1 font-semibold rounded-xl p-3 bg-[#1C1D26] text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                    disabled={!item.status}
                                    onClick={() => orderReady(item.order_id, item.name_client, item.product_name, item.check_id, item.quantity, item.obs, item.notify_id)}
                                >{item.status ? "Pronto" : "Finalizado"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="flex justify-between items-center my-3 px-5 py-3 w-full rounded-xl shadow-md">

                    <div className="flex flex-col">
                        <h3 className="text-slate-900 font-bold">Você não possui pedidos em aberto</h3>
                        <h3 className="text-slate-400 font-semibold">Aguarde o garçom lançar algo ...</h3>
                        <h4 className="text-slate-500 text-[15px] font-semibold">
                            <span className="font-bold text-[#EB8F00]">Porque eu estou!</span> 🙂</h4>
                    </div>
                </div>

            )}
        </>
    )
}