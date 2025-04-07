import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import html2canvas from 'html2canvas';

import { Navbar } from "../../components";
import { useLoader } from "../../contexts";

import { Grafic, Money, MoneyF, Swath, Print, Cam, Card } from "../../libs/icons";

import socket from "../../service/socket";
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

        const today = new Date().toLocaleDateString("pt-BR");
        setData(today);
        getCashierOpen();

    }, []);

    // check_finished
    useEffect(() => {
        socket.on("check_finished", () => {
            getCashierOpen();
        });

        return () => { socket.off("check_finished") };
    }, []);

    const getCashierOpen = useCallback(() => {
        CashierService.getByStatus(1)
            .then((result) => {
                if (result.length > 0) {
                    setCashier(result[0]);
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

    const printCashier = () => {
        const janelaDeImpressao = window.open('', '_blank');
        janelaDeImpressao.document.write(`
            <html>
                <head>
                    <title>Imprimir</title>
                    <style>
                        body {
                            font-family: monospace;
                            font-size: 12px;
                            padding: 0;
                            margin: 0;
                            width: 80mm;
                        }
                        .container {
                            padding: 10px;
                        }
                        .center {
                            text-align: center;
                        }
                        .bold {
                            font-weight: bold;
                        }
                        .section {
                            margin: 10px 0;
                        }
                        hr {
                            border: none;
                            border-top: 1px dashed #000;
                            margin: 8px 0;
                        }
                        p {
                            margin: 4px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="center section">
                            <p class="bold">FECHAMENTO DE CAIXA</p>
                            <hr />
                        </div>
                        <div class="section">
                            <p>Receita Total Gerada: <span class="bold">R$ ${Number(cashier.total_value).toFixed(2).replace(".", ",")}</span></p>
                            <p>Total de Comandas: <span class="bold">${cashier.lenght_cheks}</span></p>
                            <p>Total de Produtos Vendidos: <span class="bold">${cashier.lenght_products}</span></p>
                        </div>
                        <hr />
                        <div class="section">
                            <p class="bold">Vendas por Categoria</p>
                            <p>Pix: <span class="bold">R$ ${Number(cashier.pix).toFixed(2).replace(".", ",") || "0,00"}</span></p>
                            <p>Dinheiro: <span class="bold">R$ ${Number(cashier.cash).toFixed(2).replace(".", ",") || "0,00"}</span></p>
                            <p>Cartão Crédito: <span class="bold">R$ ${Number(cashier.credit).toFixed(2).replace(".", ",") || "0,00"}</span></p>
                            <p>Cartão Débito: <span class="bold">R$ ${Number(cashier.debit).toFixed(2).replace(".", ",") || "0,00"}</span></p>
                        </div>
                        <hr />
                        <div class="center section">
                            <p>Obrigado!</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        janelaDeImpressao.document.close();
        janelaDeImpressao.print();
    };


    return (
        <>
            <Navbar title={"Resumo do dia"} isLogout />
            <div className="w-full pt-5 flex flex-col items-center">
                <Toaster />
                <div className="flex justify-center flex-wrap bg-slate-100/50 py-5 px-1 w-[97%] my-10 rounded-md shadow-md gap-1">
                    <div className="w-full flex justify-center gap-1">
                        <button className="w-full font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate("/produtos")}
                        >Produtos</button>

                        <button className="w-full font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate("/usuarios")}
                        >Configurações</button>
                    </div>

                    <div className="w-full flex justify-center gap-1">
                        <button className="w-full font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate("/garcom/comandas")}
                        >Comandas</button>

                        <button className="w-full font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate("/cozinha/producao")}
                        >Cozinha</button>

                        <button className="w-full font-semibold text-white py-2 rounded-md hover:bg-[#EB8F00] bg-[#1C1D26] transition-all delay-75"
                            onClick={() => navigate("/barmen/producao")}
                        >Bar</button>
                    </div>
                </div>

                <main className="w-full my-10 pb-10 flex flex-col items-center gap-14" id="screenshotCashier">
                    <div className="flex gap-10 flex-col">

                        <p><span className="font-semibold text-[#1C1d26]">Data:</span> {date}</p>

                        <p className="text-2xl text-green-600">Receita</p>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Money />
                            <div className="text-end">
                                <p className="text-slate-400">Receita Total Gerada</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.total_value || 0).toFixed(2).replace(".", ",")}</p>
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
                                <p className="text-2xl">R$ {parseFloat(cashier.pix || 0).toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <MoneyF />
                            <div className="text-end">
                                <p className="text-slate-400">Dinheiro</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.cash || 0).toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Crédito</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.credit || 0).toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 min-w-[300px] rounded-lg shadow-md px-5 justify-between bg-slate-100/50">

                            <Card />
                            <div className="text-end">
                                <p className="text-slate-400">Cartão Débito</p>
                                <p className="text-2xl">R$ {parseFloat(cashier.debit || 0).toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="w-full flex flex-col gap-3 justify-between items-center py-3 bg-[#EB8F00] text-slate-100">
                    <h5 className="text-[28px] font-semibold">Finalizar o dia</h5>

                    <div className="flex gap-5 justify-center items-center">
                        <button className="w-1/2 flex items-center gap-3 p-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => printCashier()}
                        ><Print /> Imprimir</button>
                        <button className="w-1/2 flex items-center gap-3 p-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={() => screenshotCashier()}
                        ><Cam /> Print</button>
                    </div>

                    <button className="w-[260px] py-2 text-[20px] font-bold rounded-xl bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                        onClick={() => closeCashier()}
                    >Fechar caixa</button>
                </footer>
            </div>
        </>
    );
};
