import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDetailCategoriesByCategoryId } from '@/actions/detail-category';
import { DetailCategoryState } from '.';

export type DetailCategoryType = {
    id: string;
    name: string;
};

interface DetailCategoryStateType {
    detailCategories: DetailCategoryType[];
    loading: boolean;
    error: string | null;
}

const initialState: DetailCategoryStateType = {
    detailCategories: [],
    loading: false,
    error: null,
};

export const fetchDetailCategoriesByCategoryIdThunk = createAsyncThunk<
    DetailCategoryType[],
    string,
    { rejectValue: string }
>('detailCategory/fetchByCategoryId', async (categoryId, { rejectWithValue }) => {
    try {
        const result = await getDetailCategoriesByCategoryId(categoryId);
        if (result.success && result.data) {
            const detailCategories = result.data.map((d: any) => ({
                id: d.id,
                name: d.name,
            }));
            return detailCategories;
        }
        return rejectWithValue(result.error || 'Failed to fetch detail categories');
    } catch (error) {
        return rejectWithValue((error as Error).message || 'An error occurred while fetching detail categories');
    }
});

const detailCategorySlice = createSlice({
    name: 'detailCategoryByCategory',
    initialState,
    reducers: {
        setDetailCategories: (state, action: PayloadAction<DetailCategoryType[]>) => {
            state.detailCategories = action.payload;
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
            .addCase(fetchDetailCategoriesByCategoryIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDetailCategoriesByCategoryIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.detailCategories = action.payload;
            })
            .addCase(fetchDetailCategoriesByCategoryIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred while fetching detail categories';
            });
    },
});

export const { setDetailCategories, setLoading, setError } = detailCategorySlice.actions;

export const selectDetailCategories = (state: DetailCategoryState) => state.detailCategoryStore.detailCategories;
export const selectLoading = (state: DetailCategoryState) => state.detailCategoryStore.loading;
export const selectError = (state: DetailCategoryState) => state.detailCategoryStore.error;

export default detailCategorySlice.reducer;
