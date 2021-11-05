import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const cartSlice = createSlice({
    name: 'cartItems',
    initialState: {
        loading: 'idle',
        items: []
    },
    reducers: {
        cartItemsLoading: (state) => {
            if (state.loading === 'idle') {
                state.loading = 'pending';
            }
        },
        cartItemsAdded: (state, action) => {
            if (state.loading === 'pending') {
                state.loading = 'idle';
                state.items = Object.values(action.payload);
            }
        },
        cartItemAdded: (state, action) => {
            return
        },
    }
});

export const { cartItemsAdded, cartItemsLoading } = cartSlice.actions;
export default cartSlice.reducer;

export const fetchCartItems = () => async (dispatch, getState) => {
    dispatch(cartItemsLoading());
    const { data } = await axios.get('/cart');
    dispatch(cartItemsAdded(data));
    return data;
};

export const addItemToCart = (id, itemCount = 1) => async (dispatch, getState) => {
    const res = await axios.get(`cart/${id}/add/${itemCount}`);
    dispatch(fetchCartItems());
    return true;
};
