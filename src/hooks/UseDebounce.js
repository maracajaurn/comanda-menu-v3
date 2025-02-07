import { useCallback, useRef } from "react";

export const useDebounce = (delay = 300) => {
    const debouncing = useRef(null);

    const debounce = useCallback((func) => {
        if (debouncing.current) {
            clearTimeout(debouncing.current);
        }

        debouncing.current = setTimeout(() => {
            func();
        }, delay);
    }, [delay]);

    return { debounce };
};
