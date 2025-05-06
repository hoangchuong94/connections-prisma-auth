import { configureStore } from '@reduxjs/toolkit';
import genderReducer from '@/store/gender-slice';
import categoryReducer from '@/store/category-slice';
import detailCategoryReducer from '@/store/detail-category-slice';

export const store = configureStore({
    reducer: {
        genderStore: genderReducer,
        categoryStore: categoryReducer,
        detailCategoryStore: detailCategoryReducer,
    },
});

export type GenderState = ReturnType<typeof store.getState>;
export type CategoryState = ReturnType<typeof store.getState>;
export type DetailCategoryState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
