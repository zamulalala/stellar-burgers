import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveUpIngredients,
  moveDownIngredients
} from '../slices/burgerConstructorSlice';
import { mockBun, mockMain, mockSauce } from './mocks/ingredientsMock';

describe('burgerConstructorSlice reducer', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    }
  };

  it('должен обрабатывать экшен добавления булки', () => {
    const action = addBun(mockBun);
    const newState = reducer(initialState, action);
    expect(newState.constructorItems.bun).toEqual(mockBun);
  });

  it('должен обрабатывать экшен добавления ингредиента', () => {
    const action = addIngredient(mockMain);
    const newState = reducer(initialState, action);
    expect(newState.constructorItems.ingredients).toContainEqual(mockMain);
  });

  it('должен обрабатывать экшен удаления ингредиента', () => {
    const stateWithIngredients = {
      constructorItems: {
        bun: null,
        ingredients: [mockMain, mockSauce]
      }
    };
    const action = removeIngredient(mockMain);
    const newState = reducer(stateWithIngredients, action);
    expect(newState.constructorItems.ingredients).not.toContainEqual(mockMain);
    expect(newState.constructorItems.ingredients).toContainEqual(mockSauce);
  });

  it('должен обрабатывать экшен перемещения ингредиента вверх', () => {
    const stateWithIngredients = {
      constructorItems: {
        bun: null,
        ingredients: [mockMain, mockSauce]
      }
    };
    const action = moveUpIngredients(1);
    const newState = reducer(stateWithIngredients, action);
    expect(newState.constructorItems.ingredients[0]).toEqual(mockSauce);
    expect(newState.constructorItems.ingredients[1]).toEqual(mockMain);
  });

  it('должен обрабатывать экшен перемещения ингредиента вниз', () => {
    const stateWithIngredients = {
      constructorItems: {
        bun: null,
        ingredients: [mockMain, mockSauce]
      }
    };
    const action = moveDownIngredients(0);
    const newState = reducer(stateWithIngredients, action);
    expect(newState.constructorItems.ingredients[0]).toEqual(mockSauce);
    expect(newState.constructorItems.ingredients[1]).toEqual(mockMain);
  });
});
