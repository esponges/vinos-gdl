import axios from "axios";
import { useEffect, useState } from "react";

export const useEffectProducts = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        axios.get("/cart/count").then((res) => {
            setCartCount(res.data[0]);
        });
    }, []);

    return {
        cartCount,
        setCartCount,
    };
};
