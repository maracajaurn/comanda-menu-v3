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
                        className="w-1/3 text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                        onClick={() => setShowComponent(1)}>
                        Usuários
                    </button>
                    <button
                        className="w-1/3 text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
                        onClick={() => setShowComponent(2)}>
                        Categorias
                    </button>
                    <button
                        className="w-1/3 text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold"
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
