export const LayoutBase = ({ children }) => {
    return (
        <div className="min-h-[100dvh] pt-[75px] flex justify-center items-center">
            {children}
        </div>
    );
};
