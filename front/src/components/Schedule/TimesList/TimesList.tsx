import { useEffect, useState } from 'react';
import TimeLabel from './TimeLabel/TimeLabel';
import './TimesList.css';
import { Loader } from '@mantine/core';
import { filterAvailabilitiesHours } from '../../../services/services';
import { useValuesSchedule } from '../context/ScheduleContext';
import { v4 as uuid } from 'uuid';

const TimesList: React.FC = () => {
  const [timesList, setTimesList] = useState<string[]>([]);
  const {
    setSelectedHour,
    selectedDate,
    allAvailabilities,
    isLoadingTimesList,
  } = useValuesSchedule();

  useEffect(() => {
    const list = filterAvailabilitiesHours(allAvailabilities, selectedDate);
    setTimesList(list);
    setSelectedHour(null);
  }, [selectedDate]);

  return (
    <>
      {isLoadingTimesList ? (
        <Loader />
      ) : (
        <div className='timesList-timeLabel-list'>
          {timesList && timesList.length > 0 ? (
            timesList.map((time, index) => {
              return <TimeLabel key={uuid()} index={index} time={time} />;
            })
          ) : (
            <p>אין זמינויות עבור יום זה</p>
          )}
        </div>
      )}
    </>
  );
};

export default TimesList;
