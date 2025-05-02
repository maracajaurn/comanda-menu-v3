export const LoadingItem = () => {
    return (
        <div className="flex flex-col py-4 px-6 w-full rounded-xl bg-slate-100/50 shadow-md border animate-pulse">
            <div className="w-full flex items-center justify-between gap-1">
                <div className="h-[120px] w-[180px] rounded-md bg-slate-300"></div>
                <div className="w-full flex flex-col items-center justify-between gap-2 text-center">
                    <h3 className="w-[200px] h-[25px] rounded bg-slate-400 text-[25px] font-bold"></h3>
                    <p className="w-[200px] h-[25px] rounded bg-slate-200 text-[15px] font-semibold"></p>
                    <h3 className="w-[200px] h-[25px] rounded bg-slate-300 text-[30px] font-semibold"></h3>
                </div>
            </div>
        </div>
    );
};