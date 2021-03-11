import { createContext } from 'react';

export const Context = createContext({
    allProducts: "",
    cartContent: "",
    addToCart: () => {},
    cartCountUpdate: () => {},
    getCartContent: () => {},
});
