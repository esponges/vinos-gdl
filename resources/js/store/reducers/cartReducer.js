// import { createSlice } from "@reduxjs/toolkit";
// import axios from 'axios';
// import { store } from "../store";

// const initialState = {
//     loading: 'idle',
//     items: [],
// };

// const cartSlice = createSlice({
//     name: "cartItems",
//     initialState,
//     reducers: {
//         cartItemsLoading(state, action) {
//             if (state.loading === 'idle') {
//                 state.loading = 'pending';
//             }
//         },
//         cartItemsAdded(state, action) {
//             if (state.loading === 'pending') {
//                 state.loading = 'idle';
//                 state.push(action.payload);
//             }
//         },
//         // addCartItem(state, action) {
//         //     state.push(action.payload);
//         // }
//     },
// });


// export const { cartItemsLoading, cartItemsAdded } = cartSlice.actions;
// export const { actions, reducer } = cartSlice;
// export default reducer;

// export const fetchCartItems = () => async (dispatch) => {
//     dispatch(cartItemsLoading());
//     const response = await axios.get('/cart');
//     dispatch(res.data);
// }

// store.dispatch(fetchCartItems());
// try to later refactor for using return {} instead shorthand  => ()


/* *************** */
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const productsApi = createApi({
//     reducerPath: 'productsApi',
//     baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
//     endpoints: (builder) => ({
//         getCartItems: builder.query({
//             query: () => 'cart',
//         }),
//     }),
// });

// export const { useGetCartItems } = productsApi;


// /* *********************** */
// import { createReducer } from "@reduxjs/toolkit";

// const todosReducer = createReducer([], (builder) => {
//     builder
//         .addCase('ADD_TODO', (state, action) => {
//             // "mutate" the array by calling push()
//             state.push(action.payload)
//         })
//         .addCase('TOGGLE_TODO', (state, action) => {
//             const todo = state[action.payload.index]
//             // "mutate" the object by overwriting a field
//             todo.completed = !todo.completed
//         })
//         .addCase('REMOVE_TODO', (state, action) => {
//             // Can still return an immutably-updated value if we want to
//             return state.filter((todo, i) => i !== action.payload.index)
//         })
// });

import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cartItems',
    initialState: {
        items: '',
    },
    reducers: {
        cartItemsAdded: (state, action) => {
            console.log(state, action);
            state.items = action.payload;
        }
    }
});

export const { cartItemsAdded } = cartSlice.actions;
export default cartSlice.reducer;