import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { Navbar } from "../../components/navbar";

import { useLoader } from "../../contexts";

import { CashierService } from "../../service/cashier/CashierService";

export const SalesHistory = () => {
    const { setLoading } = useLoader();

    const [group, setGroup] = useState({});

    useEffect(() => {
        setLoading(true);
        CashierService.get()
            .then((result) => {
                const grouped = result.reduce((acc, item) => {
                    const date = new Date(item.updated_at);
                    const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);

                    return acc;
                }, {});

                setGroup(grouped);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Navbar title="Histórico de Vendas" url />

            <main className="w-full max-w-[1100px] mx-auto px-6 my-10">
                {Object.entries(group).length === 0 && (
                    <p className="text-center text-gray-500 mt-20">Nenhum dado encontrado.</p>
                )}

                {Object.entries(group).map(([month, records]) => (
                    <section
                        key={month}
                        className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <header className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-[#1C1D26]">
                                Mês: {month}
                            </h2>
                            <button
                                className="px-4 py-2 bg-[#EB8F00] text-white rounded-lg font-semibold hover:bg-[#d17900] transition"
                                onClick={() => toast("Função de exportar ainda não implementada")}
                                aria-label={`Exportar dados do mês ${month}`}>
                                Exportar
                            </button>
                        </header>

                        <div className="overflow-x-auto rounded-md">
                            <table className="min-w-full table-auto border-collapse text-sm text-[#1C1D26]">
                                <thead className="bg-[#EB8F00] text-white sticky top-0">
                                    <tr>
                                        {[
                                            "#",
                                            "Comandas",
                                            "Produtos",
                                            "Total",
                                            "Pix",
                                            "Débito",
                                            "Crédito",
                                            "Dinheiro",
                                            "Fechado",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="py-3 px-5 whitespace-nowrap font-semibold border-r border-orange-300 last:border-r-0">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((item, index) => (
                                        <tr
                                            key={item.cashier_id}
                                            className={`border-b border-gray-200 hover:bg-[#FFF4DB] transition-colors ${index % 2 === 0 ? "bg-[#FFFDF7]" : "bg-white"
                                                }`} >
                                            <td className="px-5 py-3">{index + 1}</td>
                                            <td className="px-5 py-3">{item.lenght_cheks || 0}</td>
                                            <td className="px-5 py-3">{item.lenght_products || 0}</td>
                                            <td className="px-5 py-3 font-semibold">
                                                {item.total_value
                                                    ? item.total_value.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })
                                                    : "R$ 0,00"}
                                            </td>
                                            <td className="px-5 py-3">
                                                {item.pix
                                                    ? item.pix.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })
                                                    : "R$ 0,00"}
                                            </td>
                                            <td className="px-5 py-3">
                                                {item.debit
                                                    ? item.debit.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })
                                                    : "R$ 0,00"}
                                            </td>
                                            <td className="px-5 py-3">
                                                {item.credit
                                                    ? item.credit.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })
                                                    : "R$ 0,00"}
                                            </td>
                                            <td className="px-5 py-3">
                                                {item.cash
                                                    ? item.cash.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })
                                                    : "R$ 0,00"}
                                            </td>
                                            <td className="px-5 py-3">
                                                {new Date(item.updated_at).toLocaleDateString("pt-BR")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <footer className="mt-6 text-right">
                            <p className="text-lg font-semibold text-[#EB8F00]">
                                Total do mês:{" "}
                                {records
                                    .reduce((acc, item) => acc + (item.total_value || 0), 0)
                                    .toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                            </p>
                        </footer>
                    </section>
                ))}
            </main>
        </>
    );
};
