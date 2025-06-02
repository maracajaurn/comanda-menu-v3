import { useEffect, useCallback } from "react";

import { useLoader } from "../../contexts/LoaderContext";
import { Load } from "../../libs/icons";

export const Loader = ({ children }) => {
    const { loading } = useLoader();

    const atualScroll = window.scrollY || 0;

    const scroll = useCallback(() => {
        window.scrollTo({
            top: atualScroll,
            behavior: 'smooth'
        });
    }, [atualScroll]);

    useEffect(() => {
        if (loading) {
            window.addEventListener("scroll", scroll);
            return () => {
                window.removeEventListener("scroll", scroll);
            };
        } else {
            window.removeEventListener("scroll", scroll);
        };
    }, [loading]);

    return (
        <div className="relative">
            {children}
            {loading && (
                <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-50 z-50"
                style={{
                    top: atualScroll,
                }}>
                    <Load />
                </div>
            )}
        </div>
    );
};
