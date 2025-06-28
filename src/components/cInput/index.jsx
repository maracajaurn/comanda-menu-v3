export const CInput = ({ label = "", type = "text", id = "", name = "", placeholder = "", onChange = () => {}, value = "" }) => {
    return (
        <div className="mb-4">
            <label className="flex flex-col text-slate-700 text-sm font-bold">
                {label && label}
                <input
                    type={type}
                    id={id}
                    name={name}
                    className="focus:border-slate-800 w-[250px] border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={placeholder}
                    onChange={(e) => onChange((e.target.value).trim())}
                    value={value}
                />
            </label>
        </div>
    );
};