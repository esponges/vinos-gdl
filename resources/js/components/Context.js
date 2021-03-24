import { createContext } from 'react';

export const Context = createContext({
    allProducts: "",
    cartContent: "",
    cartTotal: "",
    addToCart: () => {},
    cartCountUpdate: () => {},
    getCartContent: () => {},
    notifyMinAmountRemaining: () => {},
});
