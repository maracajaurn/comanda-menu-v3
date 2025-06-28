import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BarsClose } from "../../libs/icons";
import { useToggleViewSidebar } from "../../contexts";

export const Sidebar = ({ items = [{ label: "Home", link: "/" }] }) => {
    const navigate = useNavigate();
    const { toggleViewSidebar, setToggleViewSidebar } = useToggleViewSidebar();

    useEffect(() => {
        if (toggleViewSidebar) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        };
        return () => {
            document.body.style.overflow = "";
        };
    }, [toggleViewSidebar]);

    return (
        <div
            className={`fixed inset-0 z-40 ${toggleViewSidebar ? "bg-black bg-opacity-50" : "pointer-events-none"
                } transition-opacity duration-300`}
            onClick={() => setToggleViewSidebar(false)}>
            <nav
                className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ${toggleViewSidebar ? "translate-x-0" : "-translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={() => setToggleViewSidebar(false)}
                    aria-label="Fechar menu">
                    <BarsClose size={24} />
                </button>

                <ul className="mt-16 flex flex-col gap-3 px-6">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="cursor-pointer rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                            onClick={() => {
                                navigate(item.link);
                                setToggleViewSidebar(false);
                            }}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};
