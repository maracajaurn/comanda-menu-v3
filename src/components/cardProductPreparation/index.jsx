export const CardProductPreparation = ({ oreders = [], orderReady, notify = () => { } }) => {
    return (
        <>
            {oreders.length ? (
                <div className="w-full flex flex-col gap-6">
                    {oreders.map((item) => (
                        <div
                            key={item.order_id}
                            className="flex flex-col justify-between bg-slate-100/70 rounded-xl shadow-md p-5 w-full max-w-xl mx-auto">
                            <h3 className="font-bold text-lg mb-3 text-slate-900">{item.name_client}</h3>

                            <div className="flex justify-between items-center w-full gap-4">
                                <div className="flex flex-col flex-1">
                                    <h3 className="text-slate-900 font-semibold text-md mb-1">
                                        {item.quantity}x - {item.product_name}
                                    </h3>

                                    {item.obs && (
                                        <p className="text-slate-600 text-sm font-medium">
                                            <span className="font-bold text-[#EB8F00]">OBS: </span>
                                            {item.obs}
                                        </p>
                                    )}
                                </div>

                                <button
                                    className={`flex-shrink-0 px-5 py-2 rounded-xl font-semibold transition-colors duration-300
                                            ${item.status
                                            ? "bg-[#1C1D26] text-white hover:bg-[#EB8F00] hover:text-[#1C1D26]"
                                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        }`}
                                    disabled={!item.status}
                                    onClick={() => {
                                        orderReady(
                                            item.order_id,
                                            item.name_client,
                                            item.product_name,
                                            item.check_id,
                                            item.quantity,
                                            item.obs,
                                            item.notify_id
                                        );
                                        notify(item.check_id, item.product_name);
                                    }}>
                                    {item.status ? "Pronto" : "Finalizado"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center w-full max-w-xl mx-auto p-8 bg-slate-100 rounded-xl shadow-md">
                    <h3 className="text-slate-900 font-bold text-xl mb-2">Você não possui pedidos em aberto</h3>
                    <p className="text-slate-500 font-semibold mb-1">Aguarde o garçom lançar algo ...</p>
                    <p className="text-[#EB8F00] font-bold text-lg">Porque eu estou! 🙂</p>
                </div>
            )}
        </>
    );
};
