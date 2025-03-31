import React, { JSX, useEffect, useState } from 'react';
import Login from './Login/Login';
import { useParams } from 'react-router-dom';
import { isAuthenticated } from '../services/services';
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { userId } = useParams();

  useEffect(() => {
    isAuthenticated(userId || '').then(setIsAuth);
  }, []);

  if (!isAuth) {
    return <Login />;
  }
  return children;
};

export default ProtectedRoute;
