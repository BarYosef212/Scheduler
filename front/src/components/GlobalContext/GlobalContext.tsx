import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated } from '../../services/services';
interface ValuesContextType {
  isAuth: boolean;
}

const GlobalContext = createContext<ValuesContextType>({} as ValuesContextType);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    isAuthenticated().then(setIsAuth);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isAuth,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useValuesGlobal = () => {
  return useContext(GlobalContext);
};

export { GlobalProvider, GlobalContext };
