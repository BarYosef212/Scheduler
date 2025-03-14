import { useEffect, useState } from 'react';
import TimeLabel from './TimeLabel/TimeLabel';
import './TimesList.css';
import { filterAvailabilitiesHours } from '../../../services/services';
import { Availability } from '../../../types/userTypes';

interface TimesListProps {
  timesList: String[];
  selectedDate: Date | null;
  setTimesList: React.Dispatch<React.SetStateAction<String[]>>;
  allTimes: Availability[];
  setSelectedDate: React.Dispatch<React.SetStateAction<Date|null>>;
  isLoadingTimesList:boolean
}

const TimesList: React.FC<TimesListProps> = ({
  timesList,
  setTimesList,
  selectedDate,
  allTimes,
  setSelectedDate,
  isLoadingTimesList,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    const dateStr = selectedDate
      ? `${selectedDate?.getDate()}-${
          selectedDate?.getMonth() + 1
        }-${selectedDate?.getFullYear()}`
      : '';
    filterAvailabilitiesHours(allTimes, dateStr).then((list) =>
      setTimesList(list),
    );
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, [allTimes]);

  return (
    <>
      {isLoadingTimesList ? (
        <div className='loading-spinner'></div>
      ) : (
        <div className='timesList-timeLabel-list'>
          {timesList &&
            timesList.map((time, index) => {
              return (
                <TimeLabel
                  key={index}
                  time={time}
                  selectedDate={selectedDate}
                />
              );
            })}
        </div>
      )}
    </>
  );
};

export default TimesList;
