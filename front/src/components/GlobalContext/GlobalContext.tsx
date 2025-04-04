import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
interface ValuesContextType {
  userId:string
}

const GlobalContext = createContext<ValuesContextType>({} as ValuesContextType);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const { userId = '' } = useParams();
  return (
    <GlobalContext.Provider
      value={{
        userId 
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
