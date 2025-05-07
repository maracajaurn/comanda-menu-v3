import { useEffect } from "react";
import { toast } from "react-hot-toast";
import socket from "../service/socket";

export function useSocketOrderEvents(func, screens = []) {
    useEffect(() => {
        const handleNewOrder = (data) => {
            if (!data.screens.includes(screens)) return;

            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6>Novo pedido na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            func();
        };

        const handleProductRemoved = (data) => {
            if (!data.screens.includes(screens)) return;

            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6><span className="font-semibold underline">{data.product_name}</span> cancelado na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            func();
        };

        const handleQuantityChange = (data) => {
            if (!data.screens.includes(screens)) return;

            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <h6><span className="font-semibold">{data.action} {data.product_name}</span> na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 10000 });
            func();
        };

        const handleCheckCalceled = (data) => {
            toast((t) => (
                <div>
                    <h5>Comanda <span className="font-semibold">{data.client}</span> cancelada</h5>
                </div>
            ), { duration: 2000 });
            func();
        };

        const handleCheckFinished = (data) => {
            toast((t) => (
                <h6>Comanda <span className="font-semibold">{data.client}</span> finalizada</h6>
            ), { duration: 2000 });
            func();
        };

        const handleNewCheck = () => {
            toast("Nova comanda", { duration: 2000 });
        };

        const handleOrderReady = (data) => {
            if (screens !== "waiter") return;

            toast((t) => (
                <div className="flex gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <h6 className="text-center">Pedido <span className="font-semibold">{data.product}</span> pronto na comanda</h6>
                        <span className="font-semibold">{data.client}</span>
                    </div>
                    <button className="bg-[#EB8F00] text-white rounded-md p-2"
                        onClick={() => toast.dismiss(t.id)}
                    >OK</button>
                </div>
            ), { duration: 1000000 });
            func();
        };

        socket.on("new_order", handleNewOrder);
        socket.on("product_removed", handleProductRemoved);
        socket.on("quantity_change", handleQuantityChange);
        socket.on("check_canceled", handleCheckCalceled);
        socket.on("check_finished", handleCheckFinished);
        socket.on("new_check", handleNewCheck);
        socket.on("order_ready", handleOrderReady);

        toast.dismiss();

        return () => {
            socket.off("new_order", handleNewOrder);
            socket.off("product_removed", handleProductRemoved);
            socket.off("quantity_change", handleQuantityChange);
            socket.off("check_canceled", handleCheckCalceled);
            socket.off("check_finished", handleCheckFinished);
            socket.off("new_check", handleNewCheck);
            socket.off("order_ready", handleOrderReady);
        };
    }, [func]);
};
