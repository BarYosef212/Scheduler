import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../types/modelTypes';
import { getUser } from '../../services/services';

interface ValuesContextType {
  userId: string;
  user: User;
}

const GlobalContext = createContext<ValuesContextType>({} as ValuesContextType);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const defaultUser: User = {
    id: '',
    userName: '',
    email: '',
    password: '',
    daysExcluded: [],
    googleTokens: null,
  };

  const [user, setUser] = useState<User>(defaultUser);
  const { userId = '' } = useParams();

  useEffect(() => {
    if (userId)
      getUser(userId)
        .then((user) => setUser(user))
        .catch(() => setUser(defaultUser));
  }, [userId]);


  return (
    <GlobalContext.Provider
      value={{
        userId,
        user,
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
