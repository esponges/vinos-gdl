import axios from 'axios';
import { categoriesAdded, categoriesLoading } from '../categories';
import { productsAdded, productsLoading } from '../products/';
import { fetchCartItems } from '../cart/reducers';

export const initialize = () => async (dispatch, getState) => {
    /* might want to do some special fetch depending if user is logged in */
    dispatch(fetchCartItems());
    dispatch(getProducts());
    dispatch(getCategories());
};

const getProducts = () => async (dispatch, getState) => {
    dispatch(productsLoading());
    const { data } = await axios.get('/products');
    dispatch(productsAdded(data));
};

const getCategories = () => async (dispatch, getState) => {
    dispatch(categoriesLoading());
    const { data } = await axios.get('/categories');
    dispatch(categoriesAdded(data));
};

