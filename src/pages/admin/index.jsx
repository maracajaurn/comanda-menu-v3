import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import html2canvas from 'html2canvas';

import { Navbar } from "../../components";
import { useLoader } from "../../contexts";
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

    useEffect(() => {
        setLoading(true);
        const get_func = localStorage.getItem("func");

        if (get_func !== "admin") {
            return navigate("/login");
        };

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

                    return setLoading(false);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                return toast.error(error.message);
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
            return toast.success("Caixa fechado com sucesso!");
        } catch (error) {
            return toast.error(error.message);
        };
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

        getCashierOpen();
    };

    return (
        <>
            <Navbar title={"Resumo do dia"} isLogout sidebar />
            <div className="w-full pt-5 flex flex-col items-center">
                <main className="w-full my-10 pb-10 flex flex-col items-center gap-14" id="screenshotCashier">
                    <div className="flex gap-10 flex-col">

                        <p><span className="font-semibold text-[#1C1d26]">Caixa aberto em</span> {date}</p>

                        <p className="text-2xl text-green-600">Receita</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Money />
                            <div className="text-end">
                                <p className="text-slate-400">Receita Total Gerada</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.total_value || 0).toFixed(2).replace(".", ",").toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col">
                        <p className="text-2xl text-orange-600">Vendas</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50 cursor-pointer"
                            onClick={() => navigate("/comandasFinalizadas")}
                        >

                            <Swath />
                            <div className="text-end">
                                <p className="text-slate-400">Total de comandas fechadas</p>
                                <p className="text-2xl">{cashier.lenght_cheks} comanda{cashier.lenght_cheks === 1 ? "" : "s"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Grafic />
                            <div className="text-end">
                                <p className="text-slate-400">Total de produtos vendidos</p>
                                <p className="text-2xl">{cashier.lenght_products || 0} produto{cashier.lenght_products === 1 ? "" : "s"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col">
                        <p className="text-2xl text-orange-600">Vendas por categoria</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Grafic />
                            <div className="text-end">
                                <p className="text-slate-400">Pix</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.pix || 0).toFixed(2).replace(".", ",").toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <MoneyF />
                            <div className="text-end">
                                <p className="text-slate-400">Dinheiro</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.cash || 0).toFixed(2).replace(".", ",").toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Crédito</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.credit || 0).toFixed(2).replace(".", ",").toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Débito</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.debit || 0).toFixed(2).replace(".", ",").toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full flex flex-col gap-3 justify-between items-center py-3 bg-[#EB8F00] text-slate-100">
                    <h5 className="text-[28px] font-semibold">Finalizar o dia</h5>

                    <div className="flex flex-row-reverse gap-3">
                        <button className="w-12 flex justify-center items-center text-[20px] rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => screenshotCashier()}>
                            <Cam />
                        </button>

                        <button className="px-14 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => closeCashier()}>
                            Fechar caixa
                        </button>

                        <div className="w-12"></div>
                    </div>
                </footer>
            </div>
        </>
    );
};
