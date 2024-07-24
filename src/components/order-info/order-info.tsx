import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getAllIngredients } from './../../slices/ingredientsSlice';
import { useDispatch, useSelector } from './../../services/store';
import { useLocation, useParams } from 'react-router-dom';
import {
  fetchOrderByNumber,
  getOrderByNumber,
  getOrders
} from './../../slices/orderByNumberSlice';
export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ordersNumber = Number(number);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isNaN(ordersNumber)) {
      dispatch(fetchOrderByNumber(ordersNumber));
    }
  }, []);

  const orderData = useSelector(getOrderByNumber);

  const ingredients: TIngredient[] = useSelector(getAllIngredients);

  // const loadingStatus = useSelector(getOrderByNumberLoadingStatus);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
