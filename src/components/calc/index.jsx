import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export const Calc = ({ visibilityCalc }) => {

    const [calculo, setCalculo] = useState("0");

    const string = (action) => {
        setCalculo((oldValue) => oldValue !== "0" ? `${oldValue}${action}` : action);
    };

    const result = () => {
        try {
            if (calculo === "") {
                toast.error("Digite alguma coisa!", { duration: 1200 });
                return;
            };

            const result = parseFloat(eval(calculo)).toFixed(2);

            setCalculo(`${result}`);

        } catch (SyntaxError) {
            toast.error("Esse calculo está mal feito!", { duration: 1200 });
            setCalculo("0");
        };
    };

    const fontSize = calculo.length >= 9 ? '2.5rem' : '3.5rem';

    return (
        <div className={`border ${visibilityCalc ? '' : 'hidden'} border-[#EBAE4D] rounded-md bg-[#EBAE4D]/25 shadow-2xl w-[300px] h-[500px] flex flex-col justify-center items-center gap-4`}>
            <Toaster />
            <input className="px-1 overflow-hidden w-[95%] h-auto bg-[#EBAD00] rounded-md flex items-center justify-end text-6xl text-right flex-wrap"
                value={calculo}
                disabled
                style={{ fontSize }}  
            />

            <div className="w-[95%] h-[400px] rounded-md flex flex-col gap-1">
                <div className="w-full h-[75px] border border-[#EBAE4D] rounded-md flex gap-[4px] justify-center items-center">
                    <button onClick={(e) => string(e.target.value)} type="button" value="/" className="w-[50px] h-[50px] bg-[#CD7F00]/40 rounded-full">/</button>
                    <button onClick={(e) => string(e.target.value)} type="button" value="*" className="w-[50px] h-[50px] bg-[#CD7F00]/40 rounded-full">x</button>
                    <button onClick={(e) => string(e.target.value)} type="button" value="-" className="w-[50px] h-[50px] bg-[#CD7F00]/40 rounded-full">-</button>
                    <button onClick={(e) => string(e.target.value)} type="button" value="+" className="w-[50px] h-[50px] bg-[#CD7F00]/40 rounded-full">+</button>
                    <button onClick={() => setCalculo("0")} name="limpar" type="button" value="limpar" className="w-[50px] h-[50px] bg-[#EB4200] rounded-full">←</button>
                </div>

                <div className="flex flex-wrap-reverse gap-[4px] justify-center items-center border border-[#EBAE4D] rounded-md p-1">
                    <div className="flex gap-[4px]">
                        <button onClick={(e) => string(e.target.value)} name="0" type="button" value="0" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">0</button>
                        <button onClick={(e) => string(e.target.value)} name="." type="button" value="." className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">.</button>
                        <button onClick={(() => result())} type="button" value="=" className="w-[75px] h-[75px] bg-[#1C1D26]/40 rounded-full">=</button>
                    </div>

                    <button onClick={(e) => string(e.target.value)} name="1" type="button" value="1" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">1</button>
                    <button onClick={(e) => string(e.target.value)} name="2" type="button" value="2" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">2</button>
                    <button onClick={(e) => string(e.target.value)} name="3" type="button" value="3" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">3</button>
                    <button onClick={(e) => string(e.target.value)} name="4" type="button" value="4" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">4</button>
                    <button onClick={(e) => string(e.target.value)} name="5" type="button" value="5" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">5</button>
                    <button onClick={(e) => string(e.target.value)} name="6" type="button" value="6" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">6</button>
                    <button onClick={(e) => string(e.target.value)} name="7" type="button" value="7" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">7</button>
                    <button onClick={(e) => string(e.target.value)} name="8" type="button" value="8" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">8</button>
                    <button onClick={(e) => string(e.target.value)} name="9" type="button" value="9" className="w-[75px] h-[75px] bg-[#CD5C00]/40 rounded-full">9</button>
                </div>
            </div>
        </div>
    );
};