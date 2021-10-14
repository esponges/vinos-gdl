import { configureStore/* , getDefaultMiddleware */ } from "@reduxjs/toolkit";
import cartReducer from './reducers/cartReducer';
import counterReducer from "./reducers/counterReducer";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        counter: counterReducer,
        // cartItems: cartReducer,
        // [productsApi.reducerPath]: productsApi.reducer,
    },
    devTools: true, // add logic to false when prod
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
});
