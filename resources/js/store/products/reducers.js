/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    loading: 'idle',
    products: [],
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
    },
    productAdded: (state, action) => {
      const index = state.products.findIndex((product) => product.id === action.payload.id);
      state.products[index] = {
        ...state.products[index],
        ...action.payload,
      };
    },
  },
});

export const { productsAdded, productsLoading, productAdded } = productsSlice.actions;
export default productsSlice.reducer;

export const getProduct = (id) => async (dispatch) => {
  dispatch(productsLoading());
  const { data } = await axios.get(`/products/${id}`);
  dispatch(productAdded(data));
  return data;
};
