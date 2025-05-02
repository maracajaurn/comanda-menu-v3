import { Close } from "../../libs/icons";

export const Filter = ({ filter = "", setFilter, placeholder = "Buscar produto..." }) => {
    return (
        <div className="border px-3 py-5 w-full rounded-xl shadow-md">
            <label className="flex gap-2 items-center">
                <input
                    type="text"
                    className="w-full border-2 rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={placeholder}
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                />
                <button type="button" className="border-2 rounded-xl p-[10px] hover:text-red-600 hover:border-red-600 transition-all delay-75">
                    <i onClick={() => setFilter("")}><Close /></i>
                </button>
            </label>
        </div>
    );
};