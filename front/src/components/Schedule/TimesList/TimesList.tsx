import { useEffect, useState } from 'react';
import TimeLabel from './TimeLabel/TimeLabel';
import './TimesList.css';
import { Loader } from '@mantine/core';
import { filterAvailabilitiesHours } from '../../../services/services';
import { Availability } from '../../../types/modelTypes';

interface TimesListProps {
  isLoadingTimesList: boolean;
  setSelectedHour: React.Dispatch<React.SetStateAction<string | null>>;
  allAvailabilities: Availability[];
  selectedDate: Date;
}

const TimesList: React.FC<TimesListProps> = ({
  isLoadingTimesList,
  setSelectedHour,
  allAvailabilities,
  selectedDate,
}) => {
  const [timesList, setTimesList] = useState<string[]>([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(-1);

  useEffect(() => {
    console.log("enter")
    const list = filterAvailabilitiesHours(allAvailabilities, selectedDate);
    console.log("list after change: ",list)
    setTimesList(list), setSelectedTimeIndex(-1);
    setSelectedHour(null);
  }, [selectedDate]);

  return (
    <>
      {isLoadingTimesList ? (
        <Loader />
      ) : (
        <div className='timesList-timeLabel-list'>
          {timesList &&
            timesList.map((time, index) => {
              return (
                <TimeLabel
                  key={index}
                  index={index}
                  time={time}
                  setSelectedTimeIndex={setSelectedTimeIndex}
                  selectedTimeIndex={selectedTimeIndex}
                  setSelectedHour={setSelectedHour}
                />
              );
            })}
        </div>
      )}
    </>
  );
};

export default TimesList;
