import React, { createContext, useContext, useEffect, useState } from 'react';
interface ValuesContextType {
}

const GlobalContext = createContext<ValuesContextType>({} as ValuesContextType);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  return (
    <GlobalContext.Provider
      value={{
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
