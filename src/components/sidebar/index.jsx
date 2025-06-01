import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { BarsClose } from "../../libs/icons";

import { useToggleViewSidebar } from "../../contexts"

export const Sidebar = ({ items = [{ label: "Home", link: "/" }] }) => {
    const navigate = useNavigate();

    const { toggleViewSidebar, setToggleViewSidebar } = useToggleViewSidebar();

    return (
        <div className={`flex flex-row-reverse justify-between gap-2 h-full ${toggleViewSidebar ? "w-[300px] px-2 pt-5 border-r-2" : "w-[0px]"} border-gray-200 fixed z-50 top-0 left-0 bg-white transition-all duration-500 ease-in-out mt-[64px]`}>
            <button className="h-[50px] w-[50px] flex justify-center items-center text-gray-500 hover:border-gray-800"
                onClick={() => setToggleViewSidebar(false)} >
                <BarsClose size={7}/>
            </button>

            <ul className="w-[200px] flex flex-col gap-2 self-start">
                {items.map((item, index) => (
                    <li key={index}
                        className="w-full p-3 rounded-xl text-center border-[1px] text-gray-500 hover:text-gray-800 cursor-pointer"
                        onClick={() => {navigate(item.link); setToggleViewSidebar(false)}}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};