import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  constructorItems: {
    bun: null as TConstructorIngredient | null,
    ingredients: [] as TConstructorIngredient[]
  }
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = { ...action.payload, id: uuidv4() };
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.ingredients.push({
        ...action.payload,
        id: uuidv4()
      });
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },
    resetConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    },
    moveUpIngredients: (state, action) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] = temp;
      }
    },
    moveDownIngredients: (state, action) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] = temp;
      }
    }
  },
  selectors: {
    getBurgerConstructor: (state) => state.constructorItems
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  resetConstructor,
  moveUpIngredients,
  moveDownIngredients
} = burgerConstructorSlice.actions;

export const { getBurgerConstructor } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
