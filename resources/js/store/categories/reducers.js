import { createSlice } from '@reduxjs/toolkit'

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        loading: 'idle',
        categories: []
    },
    reducers: {
        categoriesLoading: (state) => {
            if (state.loading === 'idle') {
                state.loading = 'pending';
            }
        },
        categoriesAdded: (state, action) => {
            if (state.loading === 'pending') {
                state.loading = 'idle';
                state.categories = (action.payload);
            }
        }
    }
});

export const { categoriesAdded, categoriesLoading } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
