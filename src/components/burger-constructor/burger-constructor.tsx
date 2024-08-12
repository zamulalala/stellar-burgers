import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from './../../services/store';
import {
  getBurgerConstructor,
  resetConstructor
} from './../../slices/burgerConstructorSlice';
import {
  clearOrder,
  getCurrentOrderBurger,
  getOrderBurgerLoadingStatus,
  orderBurger
} from './../../slices/orderBurgerSlice';
import { getIsAuthenticated } from './../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** Получаем данные из стора */
  const constructorItems = useSelector(getBurgerConstructor);

  const orderRequest = useSelector(getOrderBurgerLoadingStatus) === 'loading';

  const orderModalData = useSelector(getCurrentOrderBurger);

  const isAuth = useSelector(getIsAuthenticated);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      return navigate('/login');
    }

    const orderIngredients = [];

    orderIngredients.push(constructorItems.bun._id);
    constructorItems.ingredients.forEach((ingredient) => {
      orderIngredients.push(ingredient._id);
    });

    orderIngredients.push(constructorItems.bun._id);

    dispatch(orderBurger(orderIngredients));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
