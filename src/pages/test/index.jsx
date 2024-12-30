import { useEffect, useState } from "react";
import { ProductService } from "../../service/product/ProductService";

export const Test = () => {

    const [produts, setProduts] = useState([]);

    useEffect(() => {
        getProduts();
    }, []);

    const getProduts = async () => {
        const produts = await ProductService.getAll();
        setProduts(produts);
    };

    return (
        <div>
            <h1>Test Page</h1>
            <ul>
                {produts.map((produt) => (
                    <li key={produt.product_id}>
                        <p>{produt.product_id}</p>
                        <p>{produt.product_name}</p>
                        <p>{produt.price}</p>
                        <p>{produt.category}</p>
                        <p>{produt.description}</p>
                        <p>{produt.stok}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
