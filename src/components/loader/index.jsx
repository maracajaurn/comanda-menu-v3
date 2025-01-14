import { useLoader } from "../../contexts/LoaderContext";
import { Load } from "../../libs/icons";

export const Loader = ({ children }) => {
    const { loading } = useLoader();

    return (
        <div className="relative">
            {children}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="loader text-white">
                        <Load />
                    </div>
                </div>
            )}
        </div>
    );
};
