import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

const initialState = {
  ingredients: [] as TIngredient[],
  ingredientsLoadingStatus: 'idle' as 'idle' | 'loading' | 'error'
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async function () {
    return await getIngredientsApi();
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getAllIngredients: (state) => state.ingredients,
    getBuns: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'bun'),
    getMains: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    getSauces: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    getIngredientsLoadingStatus: (state) => state.ingredientsLoadingStatus
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.ingredientsLoadingStatus = 'loading';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredientsLoadingStatus = 'idle';
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.ingredientsLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  }
});

export const {
  getAllIngredients,
  getBuns,
  getMains,
  getSauces,
  getIngredientsLoadingStatus
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
