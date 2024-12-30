import { useToggleView } from "../../contexts";

export const ListinProductsForCheck = ({ products }) => {

    const { toggleView } = useToggleView()

    return (
        <div className={`${ toggleView? "flex" : "hidden" } flex justify-center items-center h-[100dvh] w-[100vw] bg-slate-950/50 fixed top-0 left-0`}>
            <div className="bg-white min-w-[300px] h-[400px] overflow-auto rounded-md flex flex-col items-center">
                <div className="p-5 bg-[#EB8F00] w-full border border-[#EB8F00]">
                    <h6 className="text-white text-center font-bold uppercase text-[18px]">Serão adicionados</h6>
                </div>
                <ul className="max-w-[90%] flex gap-5 my-5 flex-col divide-y divide-dashed divide-slate-700">
                    {products.map((product, index) => (
                        <li key={index}
                            className="w-[100%] flex justify-between gap-5 text-slate-700 font-semibold">
                            <span><span className="text-[#EB8F00]">{product.quantity}x</span> - {product.product_name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}