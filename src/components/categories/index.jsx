import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useLoader } from "../../contexts";

import { Delete, Edit, Plus, Reflesh } from "../../libs/icons";
import { CategoryService } from "../../service/category/CategoryService";

export const Categories = ({ showComponent }) => {
    const { setLoading } = useLoader();

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name_category: "",
        screen: "",
        action: "create" | "update",
        category_id: 0
    });

    useEffect(() => {
        getAllCategoies();
    }, []);

    const createCategory = () => {
        if (!newCategory.name_category || !newCategory.screen) {
            return toast.error("Preencha todos os campos.");
        };

        const data = {
            name_category: newCategory.name_category,
            screen: newCategory.screen
        };

        CategoryService.create(data)
            .then((result) => {
                if (result.status) {
                    setNewCategory({ name_category: "", screen: "" });
                    getAllCategoies();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    };

    const deleteCategory = (id) => {
        CategoryService.deleteById(id)
            .then((result) => {
                if (result.status) {
                    getAllCategoies();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    };

    const getAllCategoies = useCallback(() => {
        CategoryService.getAll()
            .then((result) => {
                if (result.length > 0) {
                    setCategories(result);
                };

                if (result?.status === false) {
                    setLoading(false);
                    return toast.error(result.message);
                };

                return setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
                return
            });
    }, []);

    const handleNewCategory = (field, event) => {
        setNewCategory(prev => ({ ...prev, [field]: event.target.value }));
    };

    const updateCategory = () => {
        if (!newCategory.name_category || !newCategory.screen) {
            return toast.error("Preencha todos os campos.");
        };

        const data = {
            name_category: newCategory.name_category,
            screen: newCategory.screen
        };

        CategoryService.updateById(newCategory.category_id, data)
            .then((result) => {
                if (result.status) {
                    setNewCategory({ name_category: "", screen: "", action: "create", category_id: 0 });
                    getAllCategoies();
                    return toast.success(result.message);
                };

                return toast.error(result.message);
            })
            .catch((error) => {
                return toast.error(error.message);
            });
    };

    return (
        <div className={`w-full ${showComponent === 2 ? "flex" : "hidden"} flex-col mt-5`}>
            <h2 className="w-full text-center p-2 border-2 rounded-md border-[#1C1D26] text-[#1C1D26] font-semibold">
                Categorias
            </h2>

            <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-2 py-2 text-center">
                            Categoria
                        </th>
                        <th scope="col" className="px-2 py-2 text-center">
                            Tela
                        </th>
                        <th scope="col" className="px-2 py-2 text-center">
                            Ação
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.category_id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" className="text-center uppercase px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {category.name_category}
                            </td>
                            <td scope="row" className="text-center uppercase px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {category.screen}
                            </td>
                            <td className="px-2 py-2 flex justify-center">
                                <button
                                    className=" p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                    onClick={() => setNewCategory(() => ({
                                        name_category: category.name_category,
                                        screen: category.screen,
                                        action: "update",
                                        category_id: category.category_id
                                    }))}
                                ><Edit /></button>

                                <button
                                    className="p-2 rounded-md text-white hover:text-[#1C1D26] hover:bg-[#EB8F00] transition-all delay-75"
                                    onClick={() => deleteCategory(category.category_id)}
                                ><Delete /></button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-5">
                <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                    <input type="text"
                        placeholder="Nome da categoria"
                        className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newCategory.name_category}
                        onChange={(e) => handleNewCategory("name_category", e)} />
                </label>

                <label className="text-slate-700 text-sm font-bold mb-2 flex flex-col">
                    <select name="screen_category"
                        id="screen_category"
                        value={newCategory.screen}
                        onChange={(e) => handleNewCategory("screen", e)}
                        className="w-full border rounded-xl p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Selecione a tela</option>
                        <option value="bar">Bar</option>
                        <option value="churrasco">Churrasco</option>
                        <option value="sem tela">Sem tela</option>
                    </select>
                </label>
                <button
                    className="flex gap-1 justify-center w-full p-3 font-semibold text-white self-center mt-5
                                    rounded-xl bg-[#EB8F00] hover:bg-[#1C1D26] transition-all delay-75"
                    onClick={() => { newCategory.action === "update" ? updateCategory() : createCategory() }}>
                    {newCategory.action === "update" ? (<><Reflesh /> Atualizar categoria</>) : (<><Plus /> Cadastrar categoria</>)}
                </button>
            </div>
        </div>
    );
};