import { Navbar } from "../../components";
import { ManagerUser, Settings, Categories } from "../../components"

export const ManageUser = () => {
    return (
        <>
            <Navbar title="Configurações" url />
            <div className="flex flex-col gap-10 mb-10">
                <ManagerUser />
                <Settings />
                <Categories />
            </div>
        </>
    );
};
