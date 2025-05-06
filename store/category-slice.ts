import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategoriesByGenderId } from '@/actions/category';
import { CategoryState } from '.';

export type CategoryType = {
    id: string;
    name: string;
};

interface CategoryStateType {
    categories: CategoryType[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryStateType = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCategoriesByGenderIdThunk = createAsyncThunk(
    'category/fetchByGenderId',
    async (genderId: string, { rejectWithValue }) => {
        try {
            const result = await getCategoriesByGenderId(genderId);
            if (result.success && result.data) {
                const categories = result.data.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                }));
                return categories;
            }
            return rejectWithValue(result.error || 'Failed to fetch categories');
        } catch (error) {
            return rejectWithValue((error as Error).message || 'An error occurred while fetching categories');
        }
    },
);

const categorySlice = createSlice({
    name: 'categoryByGender',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<CategoryType[]>) => {
            state.categories = action.payload;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesByGenderIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoriesByGenderIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategoriesByGenderIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'An error occurred while fetching categories';
            });
    },
});

export const { setCategories, setLoading, setError } = categorySlice.actions;
export const selectCategories = (state: CategoryState) => state.categoryStore.categories;
export const selectLoading = (state: CategoryState) => state.categoryStore.loading;
export const selectError = (state: CategoryState) => state.categoryStore.error;

export default categorySlice.reducer;
