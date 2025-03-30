import { useEffect, useState } from 'react';
import TimeLabel from './TimeLabel/TimeLabel';
import './TimesList.css';
import { Loader } from '@mantine/core';
import { filterAvailabilitiesHours } from '../../../services/services';
import { useValuesSchedule } from '../context/ScheduleContext';
import { v4 as uuid } from 'uuid';


const TimesList: React.FC = () => {
  const [timesList, setTimesList] = useState<string[]>([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(-1);
  const {
    setSelectedHour,
    selectedDate,
    allAvailabilities,
    isLoadingTimesList,
  } = useValuesSchedule();

  useEffect(() => {
    const list = filterAvailabilitiesHours(allAvailabilities, selectedDate)
    setTimesList(list), 
    setSelectedTimeIndex(-1);
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
                  key={uuid()}
                  index={index}
                  time={time}
                  setSelectedTimeIndex={setSelectedTimeIndex}
                  selectedTimeIndex={selectedTimeIndex}
                />
              );
            })}
        </div>
      )}
    </>
  );
};

export default TimesList;
