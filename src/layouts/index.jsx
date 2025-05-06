import { Toaster } from "react-hot-toast";
export const LayoutBase = ({ children }) => {
    return (
        <div className="min-h-[100dvh] pt-[75px] flex justify-center items-center">
            <Toaster />
            {children}
        </div>
    );
};
