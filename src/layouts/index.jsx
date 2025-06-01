import { Toaster } from "react-hot-toast";
import { Sidebar } from "../components";

const listItems = [
    { label: "Administração", link: "/admin" },
    { label: "Produtos", link: "/produtos" },
    { label: "Configurações", link: "/usuarios" },
    { label: "Comandas", link: "/garcom/comandas" },
    { label: "Online", link: "/created_online" },
    { label: "Cozinha", link: "/cozinha/producao" },
    { label: "Bar", link: "/barmen/producao" },
]

export const LayoutBase = ({ children }) => {
    return (
        <div className="min-h-[100dvh] pt-[75px] flex justify-center items-center">
            <Toaster />
            <Sidebar items={listItems} />
            {children}
        </div>
    );
};
