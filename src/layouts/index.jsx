import { Toaster } from "react-hot-toast";
import { Sidebar } from "../components";

const listItems = [
    { label: "Administração", link: "/admin" },
    { label: "Histórico de vendas", link: "/sales_history" },
    { label: "Comandas", link: "/admin/garcom/comandas" },
    { label: "Online", link: "/admin/created_online" },
    { label: "Cozinha", link: "/admin/cozinha/producao" },
    { label: "Bar", link: "/admin/barmen/producao" },
    { label: "Produtos", link: "/produtos" },
    { label: "Configurações", link: "/usuarios" },
];

export const LayoutBase = ({ children }) => {
    return (
        <div className="min-h-[100dvh] pt-[75px] flex justify-center items-center">
            <Toaster />
            <Sidebar items={listItems} />
            {children}
        </div>
    );
};
