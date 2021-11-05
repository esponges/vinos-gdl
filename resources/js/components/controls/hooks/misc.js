import axios from "axios";
import { useEffect, useState } from "react";

export const useEffectProducts = () => {
    const [error, setError] = useState(null);
    const [products, setProducts] = useState(null);
    const [prods, setProds] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        axios
            .get("/categories")
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });

        axios
            .get("/products")
            .then((res) => {
                setProds(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });

        axios.get("/cart/count").then((res) => {
            setCartCount(res.data[0]);
        });
    }, []);

    return {
        products,
        prods,
        error,
        cartCount,
        setCartCount,
    };
};
