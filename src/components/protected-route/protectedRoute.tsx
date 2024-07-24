// import { Preloader } from '@ui';
// import { useSelector} from '../services/store';
// import { isAuthCheckedSelector, userDataSelector } from '../services/store/selectors';
// import { Navigate } from 'react-router';

// type ProtectedRouteProps = {
//   onlyUnAuth?: boolean;
//   children: React.ReactElement;
// };

// export const ProtectedRoute = ({ onlyUnAuth, children }: ProtectedRouteProps) => {
//     const isAuthChecked = useSelector(isAuthCheckedSelector); // isAuthCheckedSelector — селектор получения состояния загрузки пользователя
//     const user = useSelector(userDataSelector); // userDataSelector — селектор получения пользователя из store

//   if (!isAuthChecked) { // пока идёт чекаут пользователя, показываем прелоадер
//     return <Preloader />;
//   }

//   if (!onlyUnAuth && !user) { // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
//     return <Navigate replace to='/login'/>;
//   }

//   if (onlyUnAuth && user) { // если пользователь на странице авторизации и данные есть в хранилище
//     return <Navigate replace to="/list" />;
//   }

//     return children ;
// }
