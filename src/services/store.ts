import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsReducer from './../slices/ingredientsSlice';
import feedsReducer from '../slices/feedsSlice';
import ordersReducer from '../slices/ordersSlice';
import orderBurgerReducer from '../slices/orderBurgerSlice';
import orderByNumberReducer from '../slices/orderByNumberSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  orderBurger: orderBurgerReducer,
  orderByNumber: orderByNumberReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
