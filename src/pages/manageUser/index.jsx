import { useState } from "react";

import { ManagerUser, Settings, Categories, Navbar } from "../../components";

export const ManageUser = () => {

    const [showComponent, setShowComponent] = useState(1);

    return (
        <>
            <Navbar title="Configurações" url />
            <div className="p-2 flex flex-col w-full xl:w-[1000px] h-[90dvh] justify-start items-center">

                <div className="w-full flex justify-between items-center gap-2">
                    <button
                        className={`${showComponent === 1 && "bg-[#EB8F00] text-white border-[#EB8F00]"} border-2 border-[#1C1D26] transition-all delay-75 w-1/3 text-center p-2 rounded-md font-semibold`}
                        onClick={() => setShowComponent(1)}>
                        Usuários
                    </button>
                    <button
                        className={`${showComponent === 2 && "bg-[#EB8F00] text-white border-[#EB8F00]"} border-2 border-[#1C1D26] transition-all delay-75 w-1/3 text-center p-2 rounded-md font-semibold`}
                        onClick={() => setShowComponent(2)}>
                        Categorias
                    </button>
                    <button
                        className={`${showComponent === 3 && "bg-[#EB8F00] text-white border-[#EB8F00]"} border-2 border-[#1C1D26] transition-all delay-75 w-1/3 text-center p-2 rounded-md font-semibold`}
                        onClick={() => setShowComponent(3)}>
                        Configurações
                    </button>
                </div>
                <ManagerUser showComponent={showComponent} />
                <Categories showComponent={showComponent} />
                <Settings showComponent={showComponent} />
            </div>
        </>
    );
};
