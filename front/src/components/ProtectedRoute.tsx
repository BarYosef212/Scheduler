import React, { JSX } from 'react';
import Login from './Login/Login';
import { useValuesGlobal } from './GlobalContext/GlobalContext';
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuth } = useValuesGlobal();

  if (!isAuth) {
    return <Login />;
  }
  return children;
};

export default ProtectedRoute;
