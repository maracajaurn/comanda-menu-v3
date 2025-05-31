import { ManagerUser, Settings, Categories, Navbar } from "../../components"

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
