import { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import html2canvas from 'html2canvas';

import { Navbar } from "../../components";
import { useLoader } from "../../contexts";
import { useFCM } from "../../hooks/UseFCM";
import { useSocketOrderEvents } from "../../hooks/UseSocketEvents";
import { Grafic, Money, MoneyF, Swath, Cam, Card } from "../../libs/icons";

import { CheckService } from "../../service/check/CheckService";
import { CashierService } from "../../service/cashier/CashierService";

export const Admin = () => {
    const { setLoading } = useLoader();
    const [cashier, setCashier] = useState({
        cashier_id: 0,
        total_value: 0,
        lenght_cheks: 0,
        lenght_products: 0,
        pix: 0,
        debit: 0,
        credit: 0,
        cash: 0,
        status: 0,
        created_at: "",
    });
    const [date, setData] = useState("");
    const navigate = useNavigate();
    const { user_id } = useParams();

    useFCM(user_id, false);

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");
        if (get_func !== "admin") return navigate("/login");
        getCashierOpen();
    }, []);

    const getCashierOpen = useCallback(() => {
        CashierService.getByStatus(1)
            .then((result) => {
                if (result.length > 0) {
                    setCashier(result[0]);
                    const data = new Date(result[0].created_at);
                    const formatado = data.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "America/Sao_Paulo",
                    });
                    setData(formatado);
                    setLoading(false);
                } else if (result?.status === false) {
                    setLoading(false);
                    toast.error(result.message);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
            });
    }, []);

    useSocketOrderEvents(getCashierOpen);

    const closeCashier = useCallback(async () => {
        setLoading(true);
        try {
            screenshotCashier();
            await CashierService.close(cashier.cashier_id);
            await CheckService.deleteAll();
            getCashierOpen();
            toast.success("Caixa fechado com sucesso!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [cashier]);

    const screenshotCashier = () => {
        const node = document.getElementById('screenshotCashier');
        html2canvas(node).then((canvas) => {
            const dataUrl = canvas.toDataURL();
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `caixa-dia-${date}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const formatCurrency = (value) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

    return (
        <>
            <Navbar title={"Resumo do dia"} isLogout sidebar userId={user_id} />
            <div className="w-full pt-5 flex flex-col items-center">
                <main className="w-full max-w-5xl px-4 my-10 pb-20 flex flex-col items-center gap-14" id="screenshotCashier">
                    <section className="w-full flex flex-col gap-6">
                        <p className="text-sm text-gray-500"><span className="font-semibold text-gray-800">Caixa aberto em:</span> {date}</p>

                        <h2 className="text-2xl font-bold text-green-600">Receita</h2>
                        <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
                            <Money className="text-green-600" />
                            <div className="text-right">
                                <p className="text-gray-400">Receita Total Gerada</p>
                                <p className="text-2xl font-semibold text-gray-800">{formatCurrency(cashier.total_value || 0)}</p>
                            </div>
                        </div>
                    </section>

                    <section className="w-full flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-orange-600">Vendas</h2>

                        <div
                            className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => navigate("/comandasFinalizadas")}
                        >
                            <Swath className="text-orange-600" />
                            <div className="text-right">
                                <p className="text-gray-400">Total de comandas fechadas</p>
                                <p className="text-2xl font-semibold text-gray-800">{cashier.lenght_cheks} comanda{cashier.lenght_cheks === 1 ? "" : "s"}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
                            <Grafic className="text-orange-600" />
                            <div className="text-right">
                                <p className="text-gray-400">Total de produtos vendidos</p>
                                <p className="text-2xl font-semibold text-gray-800">{cashier.lenght_products || 0} produto{cashier.lenght_products === 1 ? "" : "s"}</p>
                            </div>
                        </div>
                    </section>

                    <section className="w-full flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-orange-600">Vendas por categoria</h2>

                        {[{
                            label: "Pix",
                            icon: <Grafic className="text-blue-500" />,
                            value: cashier.pix
                        }, {
                            label: "Dinheiro",
                            icon: <MoneyF className="text-green-700" />,
                            value: cashier.cash
                        }, {
                            label: "Cartão Crédito",
                            icon: <Card className="text-purple-600" />,
                            value: cashier.credit
                        }, {
                            label: "Cartão Débito",
                            icon: <Card className="text-indigo-600" />,
                            value: cashier.debit
                        }].map(({ label, icon, value }, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
                                {icon}
                                <div className="text-right">
                                    <p className="text-gray-400">{label}</p>
                                    <p className="text-2xl font-semibold text-gray-800">{formatCurrency(value || 0)}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="w-full max-w-5xl px-4 flex flex-col gap-4 items-center py-6 text-slate-100 bg-[#EB8F00] rounded-t-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-white">Finalizar o dia</h3>
                    <div className="flex flex-row-reverse items-center gap-4">
                        <button
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1C1D26] text-white hover:bg-[#EB8F00] hover:text-black border-2 border-transparent hover:border-[#1C1D26] transition"
                            onClick={screenshotCashier}
                        >
                            <Cam />
                        </button>

                        <button className="px-14 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => closeCashier()}>
                            Fechar caixa
                        </button>
                    </div>
                </footer>
            </div>
        </>
    );
};
