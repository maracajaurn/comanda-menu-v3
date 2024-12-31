import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from 'html2canvas';

import { Navbar } from "../../components";
import { Grafic, Money, MoneyF, Swath, Print, Cam, Card } from "../../libs/icons";
import { CashierService } from "../../service/cashier/CashierService";
import { CheckService } from "../../service/check/CheckService";

export const Admin = () => {

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
        getAllCashier();
        const today = new Date().toLocaleDateString("pt-BR");
        
        const get_func = localStorage.getItem("func");
        
        if (get_func !== "admin") {
            navigate("/login");
        };

        setData(today);
    }, []);

    const getAllCashier = useCallback(async () => {
        await CashierService.getById(1)
            .then((result) => {
                setCashier(result[0]);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    }, []);

    const closeCashier = () => {
        try {
            CashierService.deleteById(cashier.cashier_id);
            CheckService.deleteAll();
            CashierService.get();
            screenshotCashier();
        } catch (error) {
            return toast.error(error);
        };
    };

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

        getAllCashier();
    };

    const printCashier = () => {
        const janelaDeImpressao = window.open('', '_blank');
        janelaDeImpressao.document.write('<html><head><title>Imprimir</title></head><body>');
        janelaDeImpressao.document.write(`<p>Receita Total Gerada: <b>R$ ${cashier.total_value}</b></p>`);
        janelaDeImpressao.document.write(`<p>Total de Comandas: <b>${cashier.lenght_cheks}</b></p>`);
        janelaDeImpressao.document.write(`<p>Total de Produtos Vendidos: <b>${cashier.lenght_products}</b></p>`);
        janelaDeImpressao.document.write(`<p>Vendas por categoria</p>`);
        janelaDeImpressao.document.write(`<p>Pix: <b>R$ ${cashier.pix}</b></p>`);
        janelaDeImpressao.document.write(`<p>Dineiro: <b>R$ ${cashier.cash}</b></p>`);
        janelaDeImpressao.document.write(`<p>Cartão Crédito: <b>R$ ${cashier.credit}</b></p>`);
        janelaDeImpressao.document.write(`<p>Cartão Débito: <b>R$ ${cashier.debit}</b></p>`);
        janelaDeImpressao.document.write('</body></html>');
        janelaDeImpressao.document.close();
        janelaDeImpressao.print();
    };

    return (
        <>
            <Navbar title={"Resumo do dia"} isLogout />
            <div className="w-full pt-5 flex flex-col items-center">
                <Toaster />
                <div className="flex justify-between bg-slate-100/20 py-5 px-1 w-[97%] my-10 rounded-md shadow-md gap-1">

                    <button className="w-1/3 font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => navigate("/produtos")}
                    >Produtos</button>

                    <button className="w-1/3 font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => navigate("/usuarios")}
                    >Configurações</button>

                    <button className="w-1/3 font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                        onClick={() => navigate("/garcom/comandas")}
                    >Comandas</button>
                </div>

                <main className="w-full my-10 pb-10 flex flex-col items-center gap-14" id="screenshotCashier">
                    <div className="flex gap-10 flex-col">

                        <p><span className="font-semibold text-[#1C1d26]">Data:</span> {date}</p>

                        <p className="text-2xl text-green-600">Receita</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Money />
                            <div className="text-end">
                                <p className="text-slate-400">Receita Total Gerada</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.total_value).toFixed(2).replace(".", ",") || "0,00"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col">
                        <p className="text-2xl text-orange-600">Vendas</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20 cursor-pointer"
                            onClick={() => navigate("/comandasFinalizadas")}
                        >

                            <Swath />
                            <div className="text-end">
                                <p className="text-slate-400">Total de comandas fechadas</p>
                                <p className="text-2xl">{cashier.lenght_cheks} comanda{cashier.lenght_cheks === 1 ? "" : "s"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Grafic />
                            <div className="text-end">
                                <p className="text-slate-400">Total de produtos vendidos</p>
                                <p className="text-2xl">{cashier.lenght_products || 0} produto{cashier.lenght_products === 1 ? "" : "s"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-10 flex-col">
                        <p className="text-2xl text-orange-600">Vendas por categoria</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Grafic />
                            <div className="text-end">
                                <p className="text-slate-400">Pix</p>
                                <p className="text-2xl">R$ {Number(cashier.pix).toFixed(2).replace(".", ",") || "0,00"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <MoneyF />
                            <div className="text-end">
                                <p className="text-slate-400">Dinheiro</p>
                                <p className="text-2xl">R$ {Number(cashier.cash).toFixed(2).replace(".", ",") || "0,00"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Crédito</p>
                                <p className="text-2xl">R$ {Number(cashier.credit).toFixed(2).replace(".", ",") || "0,00"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/20">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Débito</p>
                                <p className="text-2xl">R$ {Number(cashier.debit).toFixed(2).replace(".", ",") || "0,00"}</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full flex flex-col gap-3 justify-between items-center py-3 bg-[#EB8F00] text-slate-100">
                    <h5 className="text-[28px] font-semibold">Finalizar o dia</h5>

                    <div className="flex gap-5 w-2/3 justify-center items-center">
                        <button className="flex gap-3 p-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => printCashier()}
                        ><Print /> Imprimir</button>
                        <button className="flex gap-3 p-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => screenshotCashier()}
                        ><Cam /> Print</button>
                    </div>

                    <button className="w-2/3 py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                        onClick={() => closeCashier()}
                    >Fechar caixa</button>
                </footer>
            </div>
        </>
    );
};
