import { useState } from "react";
import toast from 'react-hot-toast';

export const Calc = ({ visibilityCalc }) => {
    const [calculo, setCalculo] = useState("0");

    const string = (action) => {
        setCalculo((old) => old !== "0" ? `${old}${action}` : action);
    };

    const result = () => {
        try {
            if (calculo === "") {
                toast.error("Digite alguma coisa!", { duration: 1200 });
                return;
            }
            const resultado = parseFloat(eval(calculo)).toFixed(2);
            setCalculo(`${resultado}`);
        } catch {
            toast.error("Esse cálculo está mal feito!", { duration: 1200 });
            setCalculo("0");
        }
    };

    const fontSize = calculo.length >= 10 ? '1.5rem' : '2.2rem';

    return (
        <div className={`transition-all duration-300 ${visibilityCalc ? 'w-auto h-auto scale-100' : 'w-0 h-0 scale-0'} origin-top-right`}>
            <div className="w-[340px] rounded-2xl border border-[#EB8F00] bg-[#1C1D26] shadow-lg p-4 flex flex-col gap-4">
                {/* DISPLAY */}
                <div className="bg-[#EB8F00] text-white rounded-xl px-4 py-3 text-right font-mono shadow-inner h-[60px] overflow-x-auto" style={{ fontSize }}>
                    {calculo}
                </div>

                {/* OPERADORES */}
                <div className="grid grid-cols-5 gap-2">
                    {["/", "*", "-", "+", "←"].map((op, i) => (
                        <button
                            key={i}
                            onClick={() => op === "←" ? setCalculo("0") : string(op)}
                            className={`rounded-xl text-white font-bold py-3 shadow-md active:scale-95 transition-all
                                ${op === "←" ? "bg-red-600 hover:bg-red-500" : "bg-[#EB8F00] hover:bg-[#e07f00]"}`}
                        >
                            {op === "*" ? "×" : op}
                        </button>
                    ))}
                </div>

                {/* NÚMEROS */}
                <div className="grid grid-cols-3 gap-3">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                        <button
                            key={n}
                            value={n}
                            onClick={(e) => string(e.target.value)}
                            className="py-4 bg-[#2A2B36] text-white text-xl font-semibold rounded-xl shadow-md hover:bg-[#3a3b46] active:scale-95 transition"
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={(e) => string(e.target.value)}
                        value="0"
                        className="py-4 col-span-1 bg-[#2A2B36] text-white text-xl font-semibold rounded-xl shadow-md hover:bg-[#3a3b46] active:scale-95 transition"
                    >
                        0
                    </button>
                    <button
                        onClick={(e) => string(e.target.value)}
                        value="."
                        className="py-4 bg-[#2A2B36] text-white text-xl font-semibold rounded-xl shadow-md hover:bg-[#3a3b46] active:scale-95 transition"
                    >
                        .
                    </button>
                    <button
                        onClick={result}
                        className="py-4 bg-[#EB8F00] text-white text-xl font-bold rounded-xl shadow-md hover:bg-[#e07f00] active:scale-95 transition"
                    >
                        =
                    </button>
                </div>
            </div>
        </div>
    );
};
