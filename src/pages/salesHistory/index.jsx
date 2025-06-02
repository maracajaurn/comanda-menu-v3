import { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";

import { Navbar } from "../../components/navbar";

import { useLoader } from "../../contexts";

import { CashierService } from "../../service/cashier/CashierService";

export const SalesHistory = () => {
    const { setLoading } = useLoader();

    const [group, setGroup] = useState({});

    useEffect(() => {
        CashierService.get()
            .then((result) => {
                const agrupado = result.reduce((acc, item) => {
                    const date = new Date(item.updated_at);
                    const chave = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                    if (!acc[chave]) acc[chave] = [];
                    acc[chave].push(item);

                    return acc;
                }, {});

                setGroup(agrupado);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }, []);

    return (
        <>
            <Navbar title="Histórico de Vendas" url />
            <div className="w-full px-5 flex flex-col items-center gap-24 self-start mt-10">
                {Object.entries(group).map(([mes, registros]) => (
                    <div key={mes} className="w-full mx-2 overflow-auto sm:w-[500px] md:w-[800px] lg:w-[1000px]">
                        <h2 className="text-xl font-bold mb-2 fixed">Mês: {mes}</h2>
                        <table className="w-full mt-10 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        #
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Comandas
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Produtos
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Total
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Pix
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Débito
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Crédito
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Dinheiro
                                    </th>
                                    <th scope="col" className="px-2 py-2 text-center">
                                        Fechado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {registros.map((item, index) => (
                                    <tr key={item.cashier_id} className="odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-2 py-2 text-nowrap">{index + 1}</td>
                                        <td className="px-2 py-2 text-nowrap">{item.lenght_cheks || 0}</td>
                                        <td className="px-2 py-2 text-nowrap">{item.lenght_products || 0}</td>
                                        <td className="px-2 py-2 text-nowrap">R$ {item.total_value || "0,00"}</td>
                                        <td className="px-2 py-2 text-nowrap">R$ {item.pix || "0,00"}</td>
                                        <td className="px-2 py-2 text-nowrap">R$ {item.debit || "0,00"}</td>
                                        <td className="px-2 py-2 text-nowrap">R$ {item.credit || "0,00"}</td>
                                        <td className="px-2 py-2 text-nowrap">R$ {item.cash || "0,00"}</td>
                                        <td className="px-2 py-2 text-nowrap">{new Date(item.updated_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 font-semibold fixed">
                            Total do mês: R$ {registros.reduce((acc, item) => acc + (item.total_value || 0), 0)}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
