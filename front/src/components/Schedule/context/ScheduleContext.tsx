import React, { createContext, useContext, useEffect, useState } from 'react';
import { Availability } from '../../../types/modelTypes';
import { getAvailabilities } from '../../../services/services';
import { useValuesGlobal } from '../../GlobalContext/GlobalContext';

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
  selectedTimeIndex: number;
  setSelectedTimeIndex: (args: number) => void;
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
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(-1);
  const [isLoadingTimesList, setIsLoadingTimesList] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1);
  const [errorConfirmMessage, setErrorConfirmMessage] = useState<string>('');

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const { userId } = useValuesGlobal();

  useEffect(() => {
    setSelectedDate(new Date());
  }, [allAvailabilities]);

  
  useEffect(() => {
    if (allAvailabilities.length == 0 && userId) {
      getAvailabilities(userId)
        .then((times) => {
          setAllAvailabilities(times);
        })
        .then(() => setIsLoadingTimesList(false));
    }
  }, [userId]);

  useEffect(()=>{setSelectedTimeIndex(-1)},[selectedDate])

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
        selectedTimeIndex,
        setSelectedTimeIndex,
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
