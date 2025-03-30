import React, { createContext, useContext, useEffect, useState } from 'react';
import { Availability } from '../../../types/modelTypes';
import { getAvailabilities, getUser } from '../../../services/services';

interface ValuesContextType {
  selectedDate: Date;
  setSelectedDate: (args: Date) => void;
  selectedHour: string | null;
  setSelectedHour: (args: string | null) => void;
  allAvailabilities: Availability[];
  setAllAvailabilities: (args: Availability[]) => void;
  isLoadingTimesList: boolean;
  setIsLoadingTimesList: (args: boolean) => void;
  step: number;
  errorConfirmMessage: string;
  setErrorConfirmMessage: (args: string) => void;
  daysExcluded: number[];
  setDaysExcluded: (args: number[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ScheduleContext = createContext<ValuesContextType>(
  {} as ValuesContextType,
);

const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [allAvailabilities, setAllAvailabilities] = useState<Availability[]>(
    [],
  );
  const [isLoadingTimesList, setIsLoadingTimesList] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1);
  const [errorConfirmMessage, setErrorConfirmMessage] = useState<string>('');
  const [daysExcluded, setDaysExcluded] = useState<number[]>([]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  useEffect(() => {
    setSelectedDate(new Date());
  }, [allAvailabilities]);

  useEffect(() => {
    getUser('1').then((user) => setDaysExcluded(user?.daysExcluded || []));
  }, []);

    useEffect(() => {
      if (allAvailabilities.length == 0) {
        getAvailabilities()
          .then((times) => {
            setAllAvailabilities(times);
          })
          .then(() => setIsLoadingTimesList(false));
      }
    }, []);

   

  return (
    <ScheduleContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedHour,
        setSelectedHour,
        allAvailabilities,
        setAllAvailabilities,
        isLoadingTimesList,
        setIsLoadingTimesList,
        step,
        errorConfirmMessage,
        setErrorConfirmMessage,
        daysExcluded,
        setDaysExcluded,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useValuesSchedule = () => {
  return useContext(ScheduleContext);
};

export { ScheduleProvider, ScheduleContext };
