import { configureStore/* , getDefaultMiddleware */ } from "@reduxjs/toolkit";
import productsReducer from "./products/reducers";
import cartReducer from './reducers/cartReducer';
import { categoriesReducer } from './categories/';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
        categories: categoriesReducer,
    },
    devTools: true, // add logic to false when prod
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
});
