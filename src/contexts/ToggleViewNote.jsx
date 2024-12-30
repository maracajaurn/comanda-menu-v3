import { createContext, useContext, useState } from "react";

const ToggleViewContext = createContext();

export const ToggleViewProvider = ({ children }) => {

    const [toggleView, setToggleView] = useState(false);

    return (
        <ToggleViewContext.Provider value={{ toggleView, setToggleView }}>
            {children}
        </ToggleViewContext.Provider>
    );
};

export const useToggleView = () => {
    return useContext(ToggleViewContext);
};
