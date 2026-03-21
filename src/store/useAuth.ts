import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { loginSuccess, logout } from './authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, token, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = (token: string, mobile: string, currentStep: number) => {
    localStorage.setItem('token', token);
    localStorage.setItem('mobile', mobile);
    localStorage.setItem('currentStep', currentStep.toString());

    dispatch(loginSuccess({ token, mobile, currentStep }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    token,
    loading,
    handleLogin,
    handleLogout,
  };
};
