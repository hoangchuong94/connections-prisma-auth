import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllGenders, createGender } from '@/actions/gender';
import { GenderState } from '.';

export type GenderType = {
    id: string;
    name: string;
};

interface GenderStateType {
    genders: GenderType[];
    loading: boolean;
    error: string | null;
}

const initialState: GenderStateType = {
    genders: [],
    loading: false,
    error: null,
};

export const fetchGendersThunk = createAsyncThunk<GenderType[], void, { rejectValue: string }>(
    'gender/fetchGenders',
    async (_, { rejectWithValue }) => {
        try {
            const result = await getAllGenders();
            if (result.success && result.data) {
                const genders = result.data.map((g: any) => ({
                    id: g.id,
                    name: g.name,
                }));
                return genders;
            }
            return rejectWithValue(result.error || 'Failed to fetch genders');
        } catch (error) {
            return rejectWithValue((error as Error).message || 'An error occurred while fetching genders');
        }
    },
);

export const createGenderThunk = createAsyncThunk<GenderType, { name: string }, { rejectValue: string }>(
    'gender/createGender',
    async (data, { rejectWithValue }) => {
        try {
            const result = await createGender(data);
            if (result.success && result.data) {
                return {
                    id: result.data.id,
                    name: result.data.name,
                };
            }
            return rejectWithValue(result.error || 'Failed to create gender');
        } catch (error) {
            return rejectWithValue((error as Error).message || 'An error occurred while creating gender');
        }
    },
);

const genderSlice = createSlice({
    name: 'gender',
    initialState,
    reducers: {
        setGenders: (state, action: PayloadAction<GenderType[]>) => {
            state.genders = action.payload;
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
            .addCase(fetchGendersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGendersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.genders = action.payload;
            })
            .addCase(fetchGendersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred while fetching genders';
            })

            .addCase(createGenderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGenderThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.genders.push(action.payload);
            })
            .addCase(createGenderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred while creating gender';
            });
    },
});

export const { setGenders, setLoading, setError } = genderSlice.actions;

export const selectGenders = (state: GenderState) => state.genderStore.genders;
export const selectLoading = (state: GenderState) => state.genderStore.loading;
export const selectError = (state: GenderState) => state.genderStore.error;

export default genderSlice.reducer;
