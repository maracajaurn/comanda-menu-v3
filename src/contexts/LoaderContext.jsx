import { useContext, createContext, useState } from "react";
import { Loader } from "../components";

const LoaderContext = createContext();

export const LoaderContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            <Loader>
                {children}
            </Loader>
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    return useContext(LoaderContext);
};