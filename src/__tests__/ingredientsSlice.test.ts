import reducer, {
  fetchIngredients,
  getAllIngredients,
  getIngredientsLoadingStatus
} from '../slices/ingredientsSlice';
import { mockIngredients } from './mocks/ingredientsMock';
import { RootState } from '../services/store';

describe('ingredientsSlice', () => {
  const initialState: RootState['ingredients'] = {
    ingredients: [],
    ingredientsLoadingStatus: 'idle'
  };

  it('должен установить статус загрузки "loading" при вызове fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(getIngredientsLoadingStatus({ ingredients: state } as RootState)).toBe('loading');
  });

  it('должен установить ингредиенты и статус "idle" при вызове fetchIngredients.fulfilled', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const state = reducer(initialState, action);
    expect(getAllIngredients({ ingredients: state } as RootState)).toEqual(mockIngredients);
    expect(getIngredientsLoadingStatus({ ingredients: state } as RootState)).toBe('idle');
  });

  it('должен установить статус "error" при вызове fetchIngredients.rejected', () => {
    const action = { type: fetchIngredients.rejected.type };
    const state = reducer(initialState, action);
    expect(getIngredientsLoadingStatus({ ingredients: state } as RootState)).toBe('error');
  });
});
