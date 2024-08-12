import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from './../../services/store';
import { fetchFeeds } from '../../slices/feedsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((store) => store.feeds.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  function handleGetFeeds() {
    dispatch(fetchFeeds());
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
