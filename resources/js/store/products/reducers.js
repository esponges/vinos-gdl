import { createSlice } from '@reduxjs/toolkit'

export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: 'idle',
        products: []
    },
    reducers: {
        productsLoading: (state) => {
            if (state.loading === 'idle') {
                state.loading = 'pending';
            }
        },
        productsAdded: (state, action) => {
            if (state.loading === 'pending') {
                state.loading = 'idle';
                state.products = (action.payload);
            }
        }
    }
});

export const { productsAdded, productsLoading } = productsSlice.actions;
export default productsSlice.reducer;
