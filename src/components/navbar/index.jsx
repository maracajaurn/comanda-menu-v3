import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useToggleView, useToggleViewSidebar } from "../../contexts";
import { LogoutService } from "../../service/logout/LogoutService";
import { useConnectionMonitor } from "../../hooks/ConnectionMonitor";

import { Back, ArrowRight, BarsOpen } from "../../libs/icons";

export const Navbar = ({ title, url, isLogout }) => {

    const { toggleViewSidebar, setToggleViewSidebar } = useToggleViewSidebar();

    const isOnline = useConnectionMonitor();

    const logoutButton = !!isLogout;

    const { toggleView, setToggleView } = useToggleView();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    const backOldPage = () => {
        setToggleView(false);
        navigate(-1);
    };

    const logout = () => {
        LogoutService.logout();
        navigate("/login");
    };

    const get_func = localStorage.getItem("func");
    const isAdminPage = location.pathname === "/admin";

    return (
        <nav className={`fixed top-0 z-10 w-full h-16 px-5 flex ${url ? "justify-between" : isLogout ? "justify-between" : "justify-center"} items-center bg-[#EB8F00] text-slate-100`}>
            {(get_func === "admin") && (
                <button className={`${toggleViewSidebar ? "w-0" : "w-[50px]"} h-[50px] flex justify-center items-center text-[#1C1D26] hover:border-gray-800 transition-all delay-500 ease-in-out`}
                    onClick={() => setToggleViewSidebar(true)} >
                    <BarsOpen size={7} />
                </button>
            )}

            <div>
                {!isOnline ? (
                    <h2 className={`transition-all delay-200 uppercase bg-red-600 px-3 py-2 rounded-md font-bold text-white`}>Sem internet</h2>
                ) : (
                    <h2 className="transition-all delay-200 font-bold uppercase text-[18px]">{title}</h2>
                )}
            </div>

            {get_func === "admin" ? (
                <>
                    {isAdminPage ? (
                        <>
                            {(logoutButton && !toggleView) &&
                                <button className="px-3 py-2 rounded-md border-2 border-red-600 bg-red-600 hover:text-red-600 hover:bg-transparent text-white transition-all delay-75"
                                    onClick={logout}
                                ><ArrowRight /></button>
                            }
                        </>
                    ) : (
                        <>
                            <button className="px-3 py-2 rounded-md bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                                onClick={backOldPage}
                            ><Back /></button>

                        </>
                    )}
                </>
            ) : (
                <>
                    {url &&
                        <button className="px-3 py-2 rounded-md bg-[#1C1D26] hover:bg-[#EB8F00] hover:text-[#1C1D26] border-2 border-transparent hover:border-[#1C1D26] transition-all delay-75"
                            onClick={backOldPage}
                        ><Back /></button>
                    }

                    {(logoutButton && !toggleView) &&
                        <button className="px-3 py-2 rounded-md border-2 border-red-600 bg-red-600 hover:text-red-600 hover:bg-transparent text-white transition-all delay-75"
                            onClick={logout}
                        ><ArrowRight /></button>
                    }
                </>
            )}
        </nav>
    );
};