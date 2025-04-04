import React, { JSX, useEffect, useState } from 'react';
import Login from './Login/Login';
import { isAuthenticated } from '../services/services';
import { useValuesGlobal } from './GlobalContext/GlobalContext';
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const {userId} = useValuesGlobal()

  useEffect(() => {
    isAuthenticated(userId).then(setIsAuth);
  }, []);

  if (!isAuth) {
    return <Login />;
  }
  return children;
};

export default ProtectedRoute;
