import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from './../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearError,
  getIsAuthenticated,
  getUserError,
  getUserLoadingStatus,
  loginUser
} from './../../slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(getUserError);
  const loadingStatus = useSelector(getUserLoadingStatus);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({
        email,
        password
      })
    );
    navigate('/', { replace: true });
  };

  useEffect(() => {
    dispatch(clearError());
  }, []);

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
