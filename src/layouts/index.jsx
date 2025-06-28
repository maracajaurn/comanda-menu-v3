import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "../components";

export const LayoutBase = ({ children }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const user_id = localStorage.getItem("user_id") || "";

        setItems([
            { label: "Administração", link: `/${user_id}/admin` },
            { label: "Histórico de vendas", link: "/sales_history" },
            { label: "Comandas", link: "/admin/garcom/comandas" },
            { label: "Online", link: "/admin/created_online" },
            { label: "Cozinha", link: "/admin/cozinha/producao" },
            { label: "Bar", link: "/admin/barmen/producao" },
            { label: "Produtos", link: "/produtos" },
            { label: "Configurações", link: "/usuarios" },
        ]);
    }, []);

    return (
        <div className="min-h-[100dvh] pt-[75px] flex justify-center items-center">
            <Toaster />
            <Sidebar items={items} />
            {children}
        </div>
    );
};
