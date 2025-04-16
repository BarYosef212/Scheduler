import React, { createContext, useContext, useEffect, useState } from 'react';
import { Availability } from '../../../types/modelTypes';
import * as services from '../../../services/services';
import { useParams } from 'react-router-dom';

interface ValuesContextType {
  step: number;
  setStep: (args: number) => void;
  isLoading: boolean;
  setIsLoading: (args: boolean) => void;
  allTimes: Availability[];
  setAllTimes: (args: Availability[]) => void;
}

const AdminContext = createContext<ValuesContextType>({} as ValuesContextType);

const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allTimes, setAllTimes] = useState<Availability[]>([]);
  const { userId } = useParams();

  useEffect(() => {
    if (userId)
      services.getAvailabilities(userId).then((list) => setAllTimes(list));
  }, [userId]);
  
  return (
    <AdminContext.Provider
      value={{
        step,
        setStep,
        isLoading,
        setIsLoading,
        allTimes,
        setAllTimes,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useValuesAdmin = () => {
  return useContext(AdminContext);
};

export { AdminProvider, AdminContext };
