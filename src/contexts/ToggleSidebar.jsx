import { createContext, useContext, useState } from "react";

const ToggleSidebarContext = createContext();

export const ToggleSidebarProvider = ({ children }) => {

    const [toggleViewSidebar, setToggleViewSidebar] = useState(false);

    return (
        <ToggleSidebarContext.Provider value={{ toggleViewSidebar, setToggleViewSidebar }}>
            {children}
        </ToggleSidebarContext.Provider>
    );
};

export const useToggleViewSidebar = () => {
    return useContext(ToggleSidebarContext);
};
